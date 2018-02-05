UNAME := $(shell uname)
COMPOSE_FILE_EXTRA_ARG :=

ifeq ($(UNAME), Linux)
COMPOSE_FILE_EXTRA_ARG := -f docker-compose.linux.yml
endif

# Help message borrowed from https://github.com/edx/devstack, which borrowed it from https://github.com/pydanny/cookiecutter-djangopackage.
help: ## display a help message
	@echo $(MAKEFILE_LIST)
	@echo "Please use \`make <target>' where <target> is one of"
	@perl -nle'print $& if m{^[\.%a-zA-Z_-]+:.*?## .*$$}' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m  %-25s\033[0m %s\n", $$1, $$2}'

shell: ## run a shell on the studio-frontend container
	docker exec -it dahlia.studio-frontend /bin/bash

attach:
	docker attach --sig-proxy=false dahlia.studio-frontend

up: ## bring up studio-frontend container
	docker-compose $(COMPOSE_FILE_EXTRA_ARG) up studio-frontend

up-detached: ## bring up studio-frontend container in detached mode
	docker-compose $(COMPOSE_FILE_EXTRA_ARG) up -d studio-frontend

logs: ## show logs for studio-frontend container
	docker-compose logs -f studio-frontend

down: ## stop and remove studio-frontend container
	docker-compose down

npm-install-%: ## install specified % npm package on the studio-frontend container
	docker exec dahlia.studio-frontend npm install $* --save-dev
	git add package.json

from-scratch: ## start development environment from scratch
	make down
	docker rmi edxops/studio-frontend
	docker build -t edxops/studio-frontend:latest --no-cache .
	make up

restart:
	make down
	make up

restart-detached:
	make down
	make up-detached

devstack.update: ## use this if you don't want to fire up the dedicated asset watching containers
	docker exec -t edx.devstack.studio bash -c 'source /edx/app/edxapp/edxapp_env && cd /edx/app/edxapp/edx-platform && paver webpack'

asset-page-flag: ## insert a waffle flag into local docker devstack
	docker exec -t edx.devstack.studio bash -c 'source /edx/app/edxapp/edxapp_env && cd /edx/app/edxapp/edx-platform && echo "from cms.djangoapps.contentstore.config.models import NewAssetsPageFlag; NewAssetsPageFlag.objects.all().delete(); NewAssetsPageFlag.objects.create(enabled=True, enabled_for_all_courses=True);" | ./manage.py lms --settings=devstack_docker shell && echo "NewAssetsPageFlag inserted!"'

i18n.docker: ## what devs should do from their host machines
	docker exec -t dahlia.studio-frontend bash -c 'make i18n.extract && make i18n.preprocess'

i18n.extract: ## move display strings from displayMessages.jsx to displayMessages.json
	npm run-script i18n_extract

i18n.preprocess: ## convert strings defined in displayMessages.json into .po file for Transifex
	$$(npm bin)/react-intl-gettext json2pot -d en src/data/i18n/default/src/components/ src/data/i18n/default/transifex_input.po

i18n.pre_validate: | i18n.extract i18n.preprocess
	git diff --exit-code -G "^(msgid|msgstr)" ## shoutout to edx/i18n-tools/blob/master/i18n/changed.py

package-lock.validate:
	git diff --name-only --exit-code package-lock.json

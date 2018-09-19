UNAME := $(shell uname)

# Help message borrowed from https://github.com/edx/devstack, which borrowed it from https://github.com/pydanny/cookiecutter-djangopackage.
help: ## display a help message
	@echo $(MAKEFILE_LIST)
	@echo "Please use \`make <target>' where <target> is one of"
	@perl -nle'print $& if m{^[\.%a-zA-Z_-]+:.*?## .*$$}' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m  %-25s\033[0m %s\n", $$1, $$2}'

shell: ## run a shell on the studio-frontend container
	docker exec -it dahlia.studio-frontend /bin/bash

attach: ## attach local standard input, output, and error streams to studio-frontend container
	docker attach --sig-proxy=false dahlia.studio-frontend

up: ## bring up studio-frontend container
	docker-compose up studio-frontend

up-detached: ## bring up studio-frontend container in detached mode
	docker-compose up -d studio-frontend

logs: ## show logs for studio-frontend container
	docker-compose logs -f studio-frontend

down: ## stop and remove studio-frontend container
	docker-compose down

stop: ## stops studio-frontend container
	docker-compose stop

npm-install-%: ## install specified % npm package on the studio-frontend container
	docker exec dahlia.studio-frontend npm install $* --save-dev
	git add package.json

from-scratch: ## start development environment from scratch
	make down
	docker rmi edxops/studio-frontend
	docker build -t edxops/studio-frontend:latest --no-cache .
	make up

restart: ## bring container down and back up
	make down
	make up

restart-detached: ## bring container down and back up in detached mode
	make down
	make up-detached

devstack.update: ## use this if you don't want to fire up the dedicated asset watching containers
	docker exec -t edx.devstack.studio bash -c 'source /edx/app/edxapp/edxapp_env && cd /edx/app/edxapp/edx-platform && paver webpack'

asset-page-flag: ## insert a waffle flag into local docker devstack
	docker exec -t edx.devstack.studio bash -c 'source /edx/app/edxapp/edxapp_env && cd /edx/app/edxapp/edx-platform && echo "from cms.djangoapps.contentstore.config.models import NewAssetsPageFlag; NewAssetsPageFlag.objects.all().delete(); NewAssetsPageFlag.objects.create(enabled=True, enabled_for_all_courses=True);" | ./manage.py lms --settings=devstack_docker shell && echo "NewAssetsPageFlag inserted!"'

i18n.docker: ## what devs should do from their host machines
	docker exec -t dahlia.studio-frontend bash -c 'make i18n.extract && make i18n.preprocess'

extract_translations: ## no prerequisites so we can control order of operations
	echo "We have to define this target due to tooling assumptions"
	echo "Also we have to npm install using this hook b/c there's no other place for it in the current setup"
	npm install
	npm run-script i18n_extract

i18n.extract: ## move display strings from displayMessages.jsx to displayMessages.json
	npm run-script i18n_extract

i18n.preprocess: ## gather all display strings into a single file
	$$(npm bin)/reactifex ./src/data/i18n/default/src/components/ ./src/data/i18n/default/transifex_input.json

i18n.pre_validate: | i18n.extract i18n.preprocess
	git diff --exit-code ./src/data/i18n/default/transifex_input.json

tx_url1 = https://www.transifex.com/api/2/project/edx-platform/resource/studio-frontend/translation/en/strings/
tx_url2 = https://www.transifex.com/api/2/project/edx-platform/resource/studio-frontend/source/
push_translations: | i18n.extract
	# Transifex is set up to watch transifex_input.json, but that filetype lacks comments
	./node_modules/reactifex/bash_scripts/get_hashed_strings.sh $(tx_url1)
	$$(npm bin)/reactifex ./src/data/i18n/default/src/components/ --comments
	./node_modules/reactifex/bash_scripts/put_comments.sh $(tx_url2)

pull_translations: ## must be exactly this name for edx tooling support, see ecommerce-scripts/transifex/pull.py
	# explicit list of languages defined here and in currentlySupportedLangs.jsx
	tx pull -f --mode reviewed --language="ar,fr,es_419,zh_CN"

copy-dist:
	for f in dist/*; do docker cp $$f edx.devstack.studio:/edx/app/edxapp/edx-platform/node_modules/@edx/studio-frontend/dist/; done

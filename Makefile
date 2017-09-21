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

devstack-install: ## install local version of package into docker devstack for development
	docker exec -t edx.devstack.lms bash -c 'source /edx/app/edxapp/nodeenvs/edxapp/bin/activate && cd /edx/app/edxapp/edx-platform && npm uninstall @edx/studio-frontend && cd /edx/src/studio-frontend && npm link && cd /edx/app/edxapp/edx-platform && npm link @edx/studio-frontend'

asset-page-flag: ## insert a waffle flag into local docker devstack
	docker exec -t edx.devstack.lms bash -c 'source /edx/app/edxapp/edxapp_env && cd /edx/app/edxapp/edx-platform && echo "from cms.djangoapps.contentstore.config.models import NewAssetsPageFlag; NewAssetsPageFlag.objects.all().delete(); NewAssetsPageFlag.objects.create(enabled=True, enabled_for_all_courses=True);" | ./manage.py lms --settings=devstack_docker shell && echo "NewAssetsPageFlag inserted!"'

publish: publish-patch ## default is a path release

publish-%: ## publish a new version from master. Argument will be fed into `npm version`, see https://docs.npmjs.com/cli/version for valid values.
	if [ $$(git rev-parse --abbrev-ref HEAD) != "master" ]; then echo "you may only publish from master" && exit 1; fi
	@git diff --quiet || (echo 'unclean git repo, please commit all changes before publish'; exit 1)
	export VERSION=$$(npm version patch);git checkout -b dahlia/$$VERSION;npm publish --access public;git push --set-upstream origin dahlia/$$VERSION && git push --tags
	echo "NPM package published, git branch created and tags pushed. Go to https://github.com/edx/studio-frontend to see your PR and merge the package.json update"

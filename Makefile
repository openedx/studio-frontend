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

devstack-install: validate-devstack-folders ## install local version of package into docker devstack for development
	# note that this assumes a structure /src/sfe_parent/studio-frontend
	# step 0: remove studio-frontend from edx-platform/node_modules
	docker exec -t edx.devstack.studio bash -c 'source /edx/app/edxapp/nodeenvs/edxapp/bin/activate && cd /edx/app/edxapp/edx-platform && npm uninstall @edx/studio-frontend && rm -rf ./node_modules/@edx/studio-frontend'
	# step 1: create symlink in /edx/src/sfe_parent/symlinks
	# note that we delete studio-frontend/node_modules; this is deliberate
	docker exec -t edx.devstack.studio bash -c 'mkdir -p /edx/src/sfe_parent/symlinks && rm -rf /edx/src/sfe_parent/symlinks/* && source /edx/app/edxapp/edxapp_env && cd /edx/src/sfe_parent/studio-frontend && export npm_config_prefix=/edx/src/sfe_parent/symlinks && npm link && rm -rf /edx/src/sfe_parent/studio-frontend/node_modules'
	# step 2: install symlinked package under edx-platform
	# if studio-frontend/node_modules exists during this step, it can cause issues
	docker exec -t edx.devstack.studio bash -c 'source /edx/app/edxapp/edxapp_env && cd /edx/app/edxapp/edx-platform && export npm_config_prefix=/edx/src/sfe_parent/symlinks && npm link @edx/studio-frontend'
	# step 3: repair installations
	docker exec -t edx.devstack.studio bash -c 'source /edx/app/edxapp/edxapp_env && cd /edx/app/edxapp/edx-platform && npm update && npm install'
	docker exec -t edx.devstack.studio bash -c 'source /edx/app/edxapp/edxapp_env && cd /edx/app/edxapp/edx-platform/node_modules/@edx/studio-frontend && npm install && npm run build'
	# step 4: update assets properly, so webservers know about them
	docker exec -t edx.devstack.studio bash -c 'source /edx/app/edxapp/edxapp_env && cd /edx/app/edxapp/edx-platform && paver update_assets'

devstack.update: ## use this if you don't want to fire up the dedicated asset watching containers
	docker exec -t edx.devstack.studio bash -c 'source /edx/app/edxapp/edxapp_env && cd /edx/app/edxapp/edx-platform && paver webpack'

asset-page-flag: ## insert a waffle flag into local docker devstack
	docker exec -t edx.devstack.studio bash -c 'source /edx/app/edxapp/edxapp_env && cd /edx/app/edxapp/edx-platform && echo "from cms.djangoapps.contentstore.config.models import NewAssetsPageFlag; NewAssetsPageFlag.objects.all().delete(); NewAssetsPageFlag.objects.create(enabled=True, enabled_for_all_courses=True);" | ./manage.py lms --settings=devstack_docker shell && echo "NewAssetsPageFlag inserted!"'

validate-devstack-folders:
	export TEMP_FILE=$$(date +%s) && touch $$TEMP_FILE && docker exec -t edx.devstack.studio bash -c 'if [[ $$(ls /edx/src/sfe_parent/studio-frontend/$$TEMP_FILE) ]]; then echo "Folder structure looks good"; else echo "Your folders are FUBAR, talk to Eric (who should really come up with an automatic way of repairing this situation)"; exit 1; fi' && rm -rf $$TEMP_FILE

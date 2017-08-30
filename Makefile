
# Help message borrowed from https://github.com/edx/devstack, which borrowed it from https://github.com/pydanny/cookiecutter-djangopackage.
help: ## display a help message
	@echo $(MAKEFILE_LIST)
	@echo "Please use \`make <target>' where <target> is one of"
	@perl -nle'print $& if m{^[\.%a-zA-Z_-]+:.*?## .*$$}' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m  %-25s\033[0m %s\n", $$1, $$2}'

shell: ## run a shell on the studio-frontend container
	docker exec -it dahlia.studio-frontend /bin/bash

up: ## bring up studio-frontend container
	docker-compose up studio-frontend

up-detached: ## bring up studio-frontend container in detached mode
	docker-compose up -d studio-frontend
	
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
	docker build -t edxops/studio-frontend:lastest --no-cache .
	make up
	

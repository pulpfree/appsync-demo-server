include .env

default: buildapp awsPackage awsDeploy

deploy: compileapp awspackage awsdeploy

compileapp:
	@rm -fr build/* && \
	yarn run build && \
	cp package.json build/ && \
	cp ./src/config/defaults.yaml build/config/ && \
	cd ./build && \
	yarn install --prod

buildapp:
	yarn run build

run: buildapp
	sam local start-api

validate:
	sam validate

awspackage:
	@aws cloudformation package \
   --template-file template.yaml \
   --output-template-file ${SAM_TPL_FILE} \
   --s3-bucket $(AWS_BUCKET_NAME) \
   --s3-prefix $(AWS_BUCKET_PREFIX) \
   --profile $(AWS_PROFILE)

awsdeploy:
	@aws cloudformation deploy \
   --template-file ${SAM_TPL_FILE} \
   --stack-name $(AWS_STACK_NAME) \
   --capabilities CAPABILITY_IAM \
   --profile $(AWS_PROFILE)

describe:
	@aws cloudformation describe-stacks \
		--region $(AWS_REGION) \
		--stack-name $(AWS_STACK_NAME)
include .env

default: compileapp awsPackage awsDeploy

deploy: buildapp awspackage awsdeploy

buildapp:
	@rm -fr build/* && \
	yarn run build && \
	cp package.json build/ && \
	cd ./build && \
	yarn install --prod

compileapp:
	yarn run build

run:
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
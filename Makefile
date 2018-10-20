include .env

EXPIRATION = $(shell echo $$(( $(shell date +%s) + 604800 ))) # 7 days from now (timestamp)

AWS_STACK_NAME ?= $(PROJECT_NAME)-$(ENV)
AWS_BUCKET_NAME ?= $(PROJECT_NAME)-artifacts

default: buildapp awspackage awsdeploy

deploy: compileapp awspackage awsdeploy

compileapp:
	@rm -fr build/* && \
	yarn run build && \
	cp package.json build/ && \
	cp ./src/config/defaults.yaml build/config/ && \
	cd ./build && \
	yarn install --prod

buildapp:
	cp ./src/config/defaults.yaml build/config/ && \
	yarn run build

run: buildapp
	sam local start-api -n env.json

validate:
	sam validate

configure:
	@ aws s3api create-bucket \
		--bucket $(AWS_BUCKET_NAME) \
		--region $(AWS_REGION)

# Next line only if not in us-east-1
#		--create-bucket-configuration LocationConstraint=$(AWS_REGION)

awspackage:
	@aws cloudformation package \
   --template-file ${FILE_TEMPLATE} \
   --output-template-file ${FILE_PACKAGE} \
   --s3-bucket $(AWS_BUCKET_NAME) \
   --s3-prefix $(AWS_BUCKET_PREFIX) \
   --profile $(AWS_PROFILE) \
   --region $(AWS_REGION)

awsdeploy:
	@aws cloudformation deploy \
   --template-file ${FILE_PACKAGE} \
   --region $(AWS_REGION) \
   --stack-name $(AWS_STACK_NAME) \
   --capabilities CAPABILITY_IAM \
   --profile $(AWS_PROFILE) \
   --force-upload \
	 --parameter-overrides \
	 	  ParamProjectName=$(PROJECT_NAME) \
			ParamKeyExpiration=$(EXPIRATION) \
			ParamENV=$(ENV)

describe:
	@aws cloudformation describe-stacks \
		--region $(AWS_REGION) \
		--stack-name $(AWS_STACK_NAME)

outputs:
	@ make describe \
		| jq -r '.Stacks[0].Outputs'

.PHONY: default deploy compileapp buildapp run validate configure awspackage awsdeploy describe outputs

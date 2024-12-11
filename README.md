# WpwilsonSite

The code and build for Patrick's personal website wpwilson.com.

## Description

Originally based on PatrickWilson.Site. This website has been modified and extended for hosting on AWS as opposed to an on-prem server.

Guide for website hosting from S3 - https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteEndpoints.html
Guide for serverless SPA application - https://docs.aws.amazon.com/whitepapers/latest/serverless-multi-tier-architectures-api-gateway-lambda/single-page-application.html

Files uploaded to client_files_s3_bucket automatically on `terraform apply` if there are differences.

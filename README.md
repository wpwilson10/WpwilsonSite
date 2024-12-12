# WpwilsonSite

This project deploys a React based single-page application (SPA) using AWS services through a serverless architecture with Terraform for infrastructure provisioning.

## Description

Guide for website hosting from S3 - https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteEndpoints.html

Guide for serverless SPA application - https://docs.aws.amazon.com/whitepapers/latest/serverless-multi-tier-architectures-api-gateway-lambda/single-page-application.html

## Setup

First apply only - If not using domains obtained in Route53, the domain in the registrar service (e.g. GoDaddy, NameCheap) needs its nameservers updated to point to the provisioned Route53 nameservers.

Files uploaded to client_files_s3_bucket automatically on `terraform apply` if there are differences.

import json
import os
from typing import Any

DOMAIN_NAME = os.environ.get("DOMAIN_NAME", "https://www.example.com")


# Function that exists only to enable CORS from API Gateway
def lambda_handler(event: dict[str, Any], context: Any) -> dict[str, Any]:
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": DOMAIN_NAME,
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
        "body": json.dumps("Hello from Lambda!"),
    }

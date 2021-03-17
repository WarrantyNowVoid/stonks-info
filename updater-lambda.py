import boto3
import json
import urllib3

s3 = boto3.client('s3')

endpoint = 'https://api.twelvedata.com/quote?symbol=DJI&apikey=6affe6c8a0bc42b9a6fd2f86a457e692'

def lambda_handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))

    http = urllib3.PoolManager()
    req = http.request('GET', endpoint)
    json_data = json.loads(req.data)

    extracted_data = {
        "percent_change": float(json_data["percent_change"])
    }

    s3.put_object(Bucket='stonks.info', Key='current.json', Body=bytes(json.dumps(extracted_data).encode('UTF-8')))

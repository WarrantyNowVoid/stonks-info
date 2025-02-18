import boto3
import json
import urllib3

s3 = boto3.client('s3')

endpoint = 'https://data.alpaca.markets/v2/stocks/SPY/snapshot'

def lambda_handler(event, context):
    http = urllib3.PoolManager()
    headers = {
        'Accept': 'application/json',
        'APCA-API-KEY-ID': 'lolimnottellingyougetyourownitsfree',
        'APCA-API-SECRET-KEY': 'hunter2'
    }
    req = http.request('GET', endpoint, headers=headers)
    json_data = json.loads(req.data)

    print("API response: " + json.dumps(json_data, indent=2))

    if all(k in json_data.keys() for k in ["dailyBar", "prevDailyBar"]):
        
        prev_close = float(json_data["prevDailyBar"]["c"])
        curr_close = float(json_data["dailyBar"]["c"])
        pchange = (100 * (curr_close - prev_close) / prev_close)

        extracted_data = {
            "percent_change": pchange
        }

        print("Saving extracted data: " + json.dumps(extracted_data, indent=2))

        s3.put_object(Bucket='stonks.info', Key='current.json', Body=bytes(json.dumps(extracted_data).encode('UTF-8')))
    else:
        print("Error repsonse, quitting")
    

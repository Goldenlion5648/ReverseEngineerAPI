from fastapi import FastAPI
import os
import json

from openai import OpenAI
from typing import Any
from dotenv import load_dotenv

from fastapi import FastAPI
from pydantic import BaseModel

from fastapi.middleware.cors import CORSMiddleware

import subprocess

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class ReverseAPIRequest(BaseModel):
    har_data: str
    api_description: str

class CurlCommand(BaseModel):
    command: str


@app.post("/api/reverse-api")
def reverse_api(request: ReverseAPIRequest):
    result = parse_har_with_llm(request.har_data, request.api_description)
    return {
        "response" : result
    }

@app.post("/api/run-curl")
def run_curl_command(curl_command: CurlCommand):
    print("command was", curl_command)
    result = subprocess.run(curl_command.command, shell=True, capture_output=True)
    return {
        "stdout" : result.stdout.decode(),
        "stderr" : result.stderr.decode()
    }

def parse_har_with_llm(har_data: str, api_description: str) -> str:
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    print("got request with ", api_description)
    har_as_json = json.loads(har_data)
    # print(json.dumps(har_as_json))
    url_to_request_dict = {}
    print(type(har_as_json))
    for group in har_as_json["log"]["entries"]:
        if "request" in group:
            cur_request = group["request"]
            if "url" in cur_request:
                if "response" in group:
                    cur_response = group["request"]
                else:
                    cur_response = {}
                url_to_request_dict[cur_request["url"]] = [
                    cur_request,
                    cur_response
                ]
    print(url_to_request_dict.keys(), len(url_to_request_dict))
    all_urls = "\n".join(url_to_request_dict.keys())
    response = client.chat.completions.create(
        model="o3-mini-2025-01-31",
        messages=[
            {
                "role": "system", 
                "content": f"""what are all the urls here that could be the
                api url for this (only give the URLs separated by a new line, 
                no other text): {api_description}\n\n{all_urls}"""
            }
        ]
    )
    urls_to_check = (response.choices[0].message.content)
    print("\ncandidates are:\n", urls_to_check, "\n", sep='')
    requests_to_check = []
    for url in urls_to_check.splitlines():
        if url in url_to_request_dict:
            requests_to_check.append(json.dumps(url_to_request_dict[url]))
    
    requests_to_check = "\n\n".join(requests_to_check)

    response = client.chat.completions.create(
        model="o3-mini-2025-01-31",
        messages=[
            {
                "role": "system", 
                "content": f"""
                Choose the request that most closely would do what the 
                user asks, and output the curl command for it. Do not 
                output anything else besides the curl command. Make the 
                curl command all on one line. {requests_to_check}
                """
            },
            {"role": "user", "content": f"{api_description}"}
        ]
    )
    print("returning", response.choices[0].message.content)
    return response.choices[0].message.content
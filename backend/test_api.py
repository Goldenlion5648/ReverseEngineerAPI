import os
import json

from openai import OpenAI
from typing import Dict, Any
from main import parse_har_with_llm
from dotenv import load_dotenv

load_dotenv()

if __name__ == '__main__':
    with open("../examples/recipescal.com.har", encoding='utf-8') as f:
        har_data=f.read().strip()
    print(parse_har_with_llm(har_data, "Can you reverse engineer the API that gives me recipes for a given portion and calorie count?"))

    # with open("../examples/flightradar24.com.har", encoding='utf-8') as f:
    #     har_data=f.read().strip()
    # print(parse_har_with_llm(har_data, "Can you give me a curl command to get info about the Lockheed C-130H Hercules HERBLK?"))
    
    # print(parse_har_with_llm(har_data, "Return the API that fetches the weather of San Francisco."))
"""
Install the Google AI Python SDK

$ pip install google-generativeai

See the getting started guide for more information:
https://ai.google.dev/gemini-api/docs/get-started/python
"""
import enum
import os

import google.generativeai as genai
from config import settings

genai.configure(api_key=settings.GOOGLE_AI_API_KEY)


class OutputType(enum.Enum):
    JSON = "application/json"
    TEXT = "text/plain"


def getModel(system_instruction: str, model_name: str = "gemini-1.5-flash", output_type: OutputType = OutputType.TEXT) -> genai.GenerativeModel:
    # Create the model
    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 8192,
        "response_mime_type": output_type.value,
    }
    return genai.GenerativeModel(
        model_name=model_name,
        generation_config=generation_config,
        system_instruction=system_instruction,
        # safety_settings = Adjust safety settings
        # See https://ai.google.dev/gemini-api/docs/safety-settings
    )

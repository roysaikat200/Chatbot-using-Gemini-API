from google import genai
from google.genai import types
import os
import markdown
from configure import SYSTEM_INSTRUCTION
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY is None:
    raise ValueError("API key not found. Please set the GEMINI_API_KEY environment variable.")


class Gemini:
    def __init__(self):
        self.client = genai.Client(api_key=GEMINI_API_KEY)
        self.model = "gemini-2.0-flash"
        self.tools = [types.Tool(google_search=types.GoogleSearch())]

        self.generate_content_config = types.GenerateContentConfig(
            temperature=1.75,
            top_p=0.95,
            top_k=40,
            max_output_tokens=8192,
            tools=self.tools,
            response_mime_type="text/plain",
            system_instruction=[types.Part.from_text(text=SYSTEM_INSTRUCTION)]
        )

    def generate(self, user_prompt):
        """Generate AI response from Gemini model given a user prompt."""
        contents = [types.Content(role="user", parts=[types.Part.from_text(text=user_prompt)])]
        response = self.client.models.generate_content_stream(
            model=self.model, contents=contents, config=self.generate_content_config
        )

        # Construct the response from streamed chunks
        ai_response = "".join(chunk.text for chunk in response if chunk.text)
        response = markdown.markdown(ai_response)

        return response.strip() if response else "I'm sorry, I couldn't process that."


# # Example Usage (Testing in CLI)
# if __name__ == "__main__":
#     chatbot = Gemini()
#     while True:
#         user_input = input("User: ")
#         if user_input.lower() == "exit":
#             print("Goodbye! 👋")
#             break
#         response = chatbot.generate(user_input)
#         print("\nAI:", response, "\n")


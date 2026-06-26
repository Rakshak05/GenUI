from dotenv import load_dotenv
load_dotenv()
from langchain_google_genai import ChatGoogleGenerativeAI

candidate_models = [
    "gemini-2.5-pro",
    "gemini-2.0-flash-lite",
    "gemini-flash-latest",
]

for model in candidate_models:
    print(f"Testing model: {model}")
    try:
        llm = ChatGoogleGenerativeAI(model=model)
        res = llm.invoke("hello")
        print(f" -> SUCCESS: {res.content[:30]}...")
    except Exception as e:
        print(f" -> FAILED: {str(e)[:150]}")

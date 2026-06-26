from dotenv import load_dotenv
load_dotenv()
from langchain_google_genai import ChatGoogleGenerativeAI

candidate_models = [
    "gemini-flash-latest",
    "gemini-pro-latest",
]

for model in candidate_models:
    print(f"Testing model: {model}")
    try:
        llm = ChatGoogleGenerativeAI(model=model)
        res = llm.invoke("hello")
        print(f" -> SUCCESS: {res.content[:30]}...")
    except Exception as e:
        print(f" -> FAILED: {str(e)[:150]}")

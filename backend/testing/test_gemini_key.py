from dotenv import load_dotenv
load_dotenv()
import os
from langchain_google_genai import ChatGoogleGenerativeAI

print("GOOGLE_API_KEY from env:", os.getenv("GOOGLE_API_KEY")[:10] + "..." if os.getenv("GOOGLE_API_KEY") else "None")
try:
    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")
    res = llm.invoke("hello")
    print("Success:", res)
except Exception as e:
    import traceback
    traceback.print_exc()


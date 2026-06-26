from dotenv import load_dotenv
load_dotenv()
from langchain_google_genai import ChatGoogleGenerativeAI
try:
    llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash")
    res = llm.invoke("hello")
    print("SUCCESS:", res.content)
except Exception as e:
    print("FAILED:", str(e))

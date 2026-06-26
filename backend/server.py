from dotenv import load_dotenv
load_dotenv()

import threading
import traceback
import sys
import time

def dump_stacks_periodically():
    while True:
        time.sleep(10)
        try:
            with open("stack_trace.txt", "w") as f:
                for thread_id, frame in sys._current_frames().items():
                    f.write(f"\n--- Thread {thread_id} ---\n")
                    traceback.print_stack(frame, file=f)
        except Exception as e:
            pass

threading.Thread(target=dump_stacks_periodically, daemon=True).start()

from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from ag_ui_langgraph import add_langgraph_fastapi_endpoint
# pyrefly: ignore [missing-import]
from copilotkit import LangGraphAGUIAgent, CopilotKitMiddleware, a2ui
from langchain.agents import create_agent
# from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.checkpoint.memory import MemorySaver
from langchain.tools import tool
import uvicorn
import os
import json
from typing_extensions import TypedDict
from todos import AgentState, todo_tools

app = FastAPI()

# ── L4: Sales data tool ────────────────────────────────────────────────
@tool
def get_sales_data() -> dict:
    """Fetch the current sales metrics and category breakdown."""
    return {
        "total_revenue": "$1,240,000",
        "new_customers": 340,
        "conversion_rate": "3.8%",
        "revenue_by_category": [
            {"label": "SaaS", "value": 520000},
            {"label": "Services", "value": 380000},
            {"label": "Hardware", "value": 200000},
            {"label": "Support", "value": 140000},
        ],
        "monthly_trend": [
            {"label": "Jan", "value": 180000},
            {"label": "Feb", "value": 210000},
            {"label": "Mar", "value": 195000},
            {"label": "Apr", "value": 240000},
            {"label": "May", "value": 260000},
            {"label": "Jun", "value": 155000},
        ],
    }

# ── L4: Fixed-schema Flight search tools ──────────────────────────────
CATALOG_ID = "copilotkit://app-dashboard-catalog"
SURFACE_ID = "flight-search-results"

FLIGHT_SCHEMA = [
    {"id": "root", "component": "List", "children": {"componentId": "flight-card", "path": "/flights"}, "direction": "horizontal", "gap": 16},
    {"id": "flight-card", "component": "Card", "child": "main-col"},
    {"id": "main-col", "component": "Column", "children": ["airline-img", "header-row", "meta-row", "divider-1", "times-row", "route-row", "divider-2", "status-row", "divider-3", "book-btn"], "align": "stretch", "gap": 8},
    {"id": "airline-img", "component": "Image", "src": {"path": "airlineLogo"}, "alt": {"path": "airline"}, "height": 32},
    {"id": "header-row", "component": "Row", "children": ["airline-name", "price-text"], "justify": "spaceBetween", "align": "center"},
    {"id": "airline-name", "component": "Text", "text": {"path": "airline"}, "variant": "h3"},
    {"id": "price-text", "component": "Text", "text": {"path": "price"}, "variant": "h2"},
    {"id": "meta-row", "component": "Row", "children": ["flight-number", "date-text"], "justify": "spaceBetween", "align": "center"},
    {"id": "flight-number", "component": "Text", "text": {"path": "flightNumber"}, "variant": "caption"},
    {"id": "date-text", "component": "Text", "text": {"path": "date"}, "variant": "caption"},
    {"id": "divider-1", "component": "Divider"},
    {"id": "times-row", "component": "Row", "children": ["depart-time", "duration-text", "arrive-time"], "justify": "spaceBetween", "align": "center"},
    {"id": "depart-time", "component": "Text", "text": {"path": "departureTime"}, "variant": "h2"},
    {"id": "duration-text", "component": "Text", "text": {"path": "duration"}, "variant": "caption"},
    {"id": "arrive-time", "component": "Text", "text": {"path": "arrivalTime"}, "variant": "h2"},
    {"id": "route-row", "component": "Row", "children": ["origin-code", "arrow-text", "dest-code"], "justify": "spaceBetween", "align": "center"},
    {"id": "origin-code", "component": "Text", "text": {"path": "origin"}, "variant": "h3"},
    {"id": "arrow-text", "component": "Text", "text": "→", "variant": "h3"},
    {"id": "dest-code", "component": "Text", "text": {"path": "destination"}, "variant": "h3"},
    {"id": "divider-2", "component": "Divider"},
    {"id": "status-row", "component": "Row", "children": ["status-text"], "align": "center"},
    {"id": "status-text", "component": "Text", "text": {"path": "status"}, "variant": "caption"},
    {"id": "divider-3", "component": "Divider"},
    {"id": "book-btn", "component": "Button", "label": "Book Flight", "variant": "primary", "action": {"event": {"name": "bookFlight"}}},
]

class Flight(TypedDict):
    id: str
    airline: str
    airlineLogo: str
    flightNumber: str
    origin: str
    destination: str
    date: str
    departureTime: str
    arrivalTime: str
    duration: str
    status: str
    price: str

@tool
def search_flights(origin: str, destination: str) -> list:
    """Search for available flights between two airports."""
    return [
        {"id": "1", "airline": "Delta Air Lines", "airlineLogo": "https://www.gstatic.com/flights/airline_logos/70px/DL.png", "flightNumber": "DL 520", "origin": origin, "destination": destination, "date": "2026-07-01", "departureTime": "08:00", "arrivalTime": "16:35", "duration": "5h 35m", "status": "On Time", "price": "$389"},
        {"id": "2", "airline": "United Airlines", "airlineLogo": "https://www.gstatic.com/flights/airline_logos/70px/UA.png", "flightNumber": "UA 1583", "origin": origin, "destination": destination, "date": "2026-07-01", "departureTime": "10:15", "arrivalTime": "18:42", "duration": "5h 27m", "status": "On Time", "price": "$412"},
        {"id": "3", "airline": "JetBlue", "airlineLogo": "https://www.gstatic.com/flights/airline_logos/70px/B6.png", "flightNumber": "B6 416", "origin": origin, "destination": destination, "date": "2026-07-01", "departureTime": "14:30", "arrivalTime": "23:05", "duration": "5h 35m", "status": "On Time", "price": "$345"},
    ]

from typing import List

@tool
def display_flights(flights: List[Flight]) -> str:
    """Display flights as rich cards in a horizontal row."""
    return a2ui.render(
        operations=[
            a2ui.create_surface(SURFACE_ID, catalog_id=CATALOG_ID),
            a2ui.update_components(SURFACE_ID, FLIGHT_SCHEMA),
            a2ui.update_data_model(SURFACE_ID, {"flights": flights}),
        ],
    )

# ── Image generation — single frontend component tool ─────────────────
# The frontend registers a useComponent("showImage") that takes {prompt, title, description}
# and calls pollinations.ai to generate the image client-side.
# The agent only needs to call this ONE tool — no multi-step chain needed.
# This is much more reliable on local models like qwen2.5 / ollama.

# ── Graph configuration ───────────────────────────────────────────────
all_tools = [get_sales_data, search_flights, display_flights] + todo_tools

# Use local Ollama model
from langchain_ollama import ChatOllama
print("Using local Ollama model: qwen2.5:3b")
llm_model = ChatOllama(model="qwen2.5:3b")

graph = create_agent(
    model=llm_model,
    state_schema=AgentState,
    tools=all_tools,
    middleware=[CopilotKitMiddleware()],
    checkpointer=MemorySaver(),
    system_prompt=(
        "You are a helpful GenUI assistant.\n\n"

        "## CRITICAL RULE — IMAGE REQUESTS\n"
        "When the user asks for ANY image, picture, photo, illustration, greeting card, poster, "
        "artwork, or visual output — you MUST call the showImage tool. "
        "Do NOT describe the image in text. Do NOT say you cannot generate images. "
        "ALWAYS call showImage. Pass the user's full description as the prompt field.\n\n"

        "Example: user says 'show me a sunset' → you call showImage with prompt='a beautiful sunset over the ocean'\n"
        "Example: user says 'make a birthday card for my mom' → you call showImage with prompt='a colorful birthday card with flowers and the message Happy Birthday Mom'\n\n"

        "## Other tool guidance\n"
        "- Sales/business data: call get_sales_data first, then call generate_a2ui.\n"
        "- Flights: call search_flights first, then call display_flights with the list.\n"
        "- Todos: use manage_todos and get_todos. Call frontend tool openOrCloseTodos(open=true) first.\n\n"

        "After any tool renders UI, do NOT repeat the data in text."
    ),
)

agent = LangGraphAGUIAgent(
    name="default",
    description="Fullstack GenUI demo agent",
    graph=graph,
)

from fastapi import Request
from fastapi.responses import StreamingResponse
from ag_ui.core.types import RunAgentInput
from ag_ui.encoder import EventEncoder
from ag_ui.core.events import EventType, RunStartedEvent, ToolCallStartEvent, ToolCallArgsEvent, ToolCallEndEvent, RunFinishedEvent
import uuid

@app.post("/")
async def langgraph_agent_endpoint(input_data: RunAgentInput, request: Request):
    # Check if the last message is a user message asking for an image
    is_image_request = False
    prompt_to_use = "a beautiful sunset"
    
    if input_data.messages:
        last_msg = input_data.messages[-1]
        if getattr(last_msg, "role", None) == "user":
            content_str = ""
            if isinstance(last_msg.content, str):
                content_str = last_msg.content
            elif isinstance(last_msg.content, list):
                for part in last_msg.content:
                    if getattr(part, "type", None) == "text":
                        content_str += getattr(part, "text", "")
            
            content_lower = content_str.lower()
            if any(kw in content_lower for kw in ["image", "picture", "sunset", "photo", "drawing", "illustration", "card", "generate", "show", "paint", "art"]):
                is_image_request = True
                prompt_to_use = content_str
                print(f"Intercepted image request in custom router: '{prompt_to_use}'")

    if is_image_request:
        accept_header = request.headers.get("accept")
        encoder = EventEncoder(accept=accept_header)
        
        async def event_generator():
            yield encoder.encode(RunStartedEvent(
                type=EventType.RUN_STARTED,
                thread_id=input_data.thread_id,
                run_id=input_data.run_id
            ))
            
            tool_call_id = "call_" + str(uuid.uuid4()).replace("-", "")[:12]
            yield encoder.encode(ToolCallStartEvent(
                type=EventType.TOOL_CALL_START,
                tool_call_id=tool_call_id,
                tool_call_name="showImage",
                parent_message_id=tool_call_id
            ))
            
            args = {
                "prompt": prompt_to_use,
                "title": "Generated Image",
                "description": f"Successfully generated: {prompt_to_use}"
            }
            yield encoder.encode(ToolCallArgsEvent(
                type=EventType.TOOL_CALL_ARGS,
                tool_call_id=tool_call_id,
                delta=json.dumps(args)
            ))
            
            yield encoder.encode(ToolCallEndEvent(
                type=EventType.TOOL_CALL_END,
                tool_call_id=tool_call_id
            ))
            
            yield encoder.encode(RunFinishedEvent(
                type=EventType.RUN_FINISHED,
                thread_id=input_data.thread_id,
                run_id=input_data.run_id
            ))

        return StreamingResponse(
            event_generator(),
            media_type=encoder.get_content_type()
        )

    # Otherwise, delegate to the original agent run logic
    accept_header = request.headers.get("accept")
    encoder = EventEncoder(accept=accept_header)
    request_agent = agent.clone()

    async def event_generator():
        async for event in request_agent.run(input_data):
            yield encoder.encode(event)

    return StreamingResponse(
        event_generator(),
        media_type=encoder.get_content_type()
    )

add_langgraph_fastapi_endpoint(app=app, agent=agent, path="/")

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8086, reload=False)


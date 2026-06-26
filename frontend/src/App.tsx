import { z } from "zod";
import { CopilotChat, useAgent, useFrontendTool, useComponent } from "@copilotkit/react-core/v2";
import { useState, useEffect } from "react";
import { TodoAppLayout } from "@/components/todo-app-layout";
import { TodoList } from "@/components/todo-list";
import { FlightCard, FlightCardProps } from "@/components/flight-card";
import { PieChart, PieChartProps } from "@/components/pie-chart";
import { ImageCard, ImageCardProps } from "@/components/image-card";
import {
  useExampleSuggestions,
  useExampleDynamicSuggestions,
  useExampleFixedSuggestions,
} from "@/hooks/use-example-suggestions";

export default function App() {
  const [todosOpen, setTodosOpen] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // ── L6: Subscribe to shared agent state ──────────────────────────────
  const { agent } = useAgent();

  useEffect(() => {
    let interval: any = null;
    if (agent?.isRunning) {
      setSeconds(0);
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [agent?.isRunning]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // ── L3: Controlled components registration ──────────────────────────
  useComponent({
    name: "showMyName",
    description: "Show the user's name in a beautiful card.",
    parameters: z.object({ name: z.string().describe("User name") }),
    render: ({ name }) => (
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 rounded-2xl shadow-md font-semibold tracking-tight animate-fade-in">
        👋 Welcome, {name}! How can I help you today?
      </div>
    ),
  });

  useComponent({
    name: "pieChart",
    description: "Controlled Generative UI that displays data as a pie chart.",
    parameters: PieChartProps,
    render: PieChart,
  });

  useComponent({
    name: "flightCard",
    description: "Controlled Generative UI that displays a single flight summary card.",
    parameters: FlightCardProps,
    render: FlightCard,
  });

  // ── Image generation component ────────────────────────────────────────
  useComponent({
    name: "showImage",
    description:
      "Generate and display an AI image from a visual text prompt. " +
      "Use this whenever the user asks for an image, photo, picture, illustration, " +
      "greeting card, poster, design, artwork, or any visual output. " +
      "Pass the full visual description as 'prompt'.",
    parameters: ImageCardProps,
    render: ImageCard,
  });

  // ── L6: Frontend tool — agent can open/close the panel ───────────────
  useFrontendTool({
    name: "openOrCloseTodos",
    description: "Open or close the todo panel.",
    parameters: z.object({ open: z.boolean().describe("Whether to open or close the panel") }),
    handler: async ({ open }) => {
      setTodosOpen(open);
      return `Todos are ${open ? "open" : "closed"}.`;
    },
  });

  // Run suggestions hooks to register prompts in the copilot chat instance
  useExampleSuggestions();
  useExampleDynamicSuggestions();
  useExampleFixedSuggestions();

  return (
    <TodoAppLayout
      chat={
        <div className="relative h-full flex flex-col w-full">
          {agent?.isRunning && (
            <div className="absolute top-3 right-3 z-50 bg-neutral-900/90 text-white px-3.5 py-2 rounded-full text-xs font-mono flex items-center gap-2 shadow-xl border border-neutral-800 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Thinking for {formatTime(seconds)}</span>
            </div>
          )}
          <CopilotChat
            labels={{
              welcomeMessageText: "Hi! I am your AI assistant. I can show you flights, display charts, or help manage your checklist tasks.",
              chatInputPlaceholder: "Ask me anything...",
            }}
            className="h-full border-none flex-1"
          />
        </div>
      }
      open={todosOpen}
      onOpenChange={setTodosOpen}
      panel={(onClose) => (
        <TodoList
          todos={agent?.state?.todos || []}
          onUpdate={(updated) => agent?.setState({ todos: updated })}
          isRunning={agent?.isRunning || false}
          onClose={onClose}
        />
      )}
    />
  );
}

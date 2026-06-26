import { useConfigureSuggestions } from "@copilotkit/react-core/v2";

/** L3: Controlled GenUI suggestions */
export function useExampleSuggestions() {
  useConfigureSuggestions({
    instructions: "Suggest these flight example prompts: 'Search flights SFO to JFK', 'Show SFO to JFK flights'",
    minSuggestions: 2,
    maxSuggestions: 2,
  });
}

/** L4: Dynamic schema A2UI suggestions */
export function useExampleDynamicSuggestions() {
  useConfigureSuggestions({
    instructions:
      'Suggest a sales dashboard prompt like: "Show me a sales dashboard with revenue, customers, and conversion rate"',
    minSuggestions: 1,
    maxSuggestions: 1,
  });
}

/** L4: Fixed schema flight suggestions */
export function useExampleFixedSuggestions() {
  useConfigureSuggestions({
    instructions:
      'Suggest fixed-schema flights: "Show me flights from SFO to JFK"',
    minSuggestions: 1,
    maxSuggestions: 1,
  });
}


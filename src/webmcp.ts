//https://github.com/GoogleChromeLabs/webmcp-tools/blob/main/demos/react-flightsearch/src/webmcp.ts
//https://developer.chrome.com/docs/ai/webmcp/imperative-api
//https://developer.chrome.com/docs/ai/webmcp/declarative-api


const registeredTools: Record<string, AbortController | null> = {
  counterInc: null,
  getCounter: null,
};

const incrementCounterTool = {
  name: "incrementCounter",
  description: "Increments the counter by a specified value.",
  inputSchema: {
    type: "object",
    properties: { value: { type: "number" } },
  },
  execute: async ({ value }: { value: number }) => {
    const counter  = document.getElementById('counter') as HTMLElement;
    if (counter) {
      const currentValue = parseInt(counter.innerText, 10) || 0;
      counter.innerText = (currentValue + value).toString();
    }
  },
  annotations: {
    readOnlyHint: false,
    untrustedContentHint: true
  },
};

const getCounterTool = {
  name: "getCounter",
  description: "Retruns the counter value.",
  outputSchema: {
    type: "string",
    description: "a value of the actual counter",
  },
  execute: async () => {
    const counter  = document.getElementById('counter') as HTMLElement;
    return counter.innerText;
  },
  annotations: {
    readOnlyHint: false,
    untrustedContentHint: true
  },
};

export function registerCounterTool() {
  const modelContext = document.modelContext || navigator.modelContext;
  if (modelContext) {
    if (!registeredTools.counter) {
      registeredTools.counterInc = new AbortController();
      registeredTools.getCounter = new AbortController();
      modelContext.registerTool(incrementCounterTool, { signal: registeredTools.counterInc.signal });
      modelContext.registerTool(getCounterTool, { signal: registeredTools.getCounter.signal });
    }
  }
}

export function unregisterCounterTool() {
  if (registeredTools.getCounter) {
    registeredTools.getCounter.abort();
    registeredTools.getCounter = null;
  }
  if(registeredTools.counterInc){
    registeredTools.counterInc.abort();
    registeredTools.counterInc = null;
  }
}
import { useEffect, useState } from "react";

export function useTaskRunner() {
  const [message, setMessageState] = useState({ scope: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!message.text) return undefined;

    const timeoutId = window.setTimeout(() => setMessageState({ scope: "", text: "" }), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [message]);

  function setMessage(text, scope = "global") {
    setMessageState(text ? { scope, text } : { scope: "", text: "" });
  }

  function messageFor(scope) {
    return message.scope === scope ? message.text : "";
  }

  async function runTask(task, scope = "global") {
    setLoading(true);
    setMessageState({ scope: "", text: "" });

    try {
      await task();
    } catch (error) {
      setMessage(error.message, scope);
    } finally {
      setLoading(false);
    }
  }

  return {
    message: message.text,
    messageFor,
    loading,
    setMessage,
    runTask
  };
}

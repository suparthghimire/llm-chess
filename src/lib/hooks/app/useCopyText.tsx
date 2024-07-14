import { useState } from "react";

const useCopyToClipboard = () => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle"); // 'idle', 'loading', 'success', 'error'

  const copyToClipboard = async (text: string) => {
    setStatus("loading");
    try {
      await navigator.clipboard.writeText(text);
      setStatus("success");
    } catch (error) {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 2000); // Reset status after 2 seconds
    }
  };

  return { status, copyToClipboard };
};

export default useCopyToClipboard;

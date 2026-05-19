import { useState, useRef, useEffect } from "react";
import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me anything — I'm here to help." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios({
        url: `${baseURL}/${SummaryApi.chat.url}`,
        method: SummaryApi.chat.method,
        data: {
          messages: updatedMessages
            .filter(m => m.role !== "assistant" || updatedMessages.indexOf(m) !== 0)
            .map(({ role, content }) => ({ role, content })),
        },
        withCredentials: true,
      });

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.reply }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", content: "Hi! Ask me anything — I'm here to help." }]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.28 9.28a5.76 5.76 0 0 0-.44-4.72 5.9 5.9 0 0 0-6.37-2.83 5.76 5.76 0 0 0-4.33-1.93 5.9 5.9 0 0 0-5.62 4.08 5.76 5.76 0 0 0-3.84 2.79 5.9 5.9 0 0 0 .73 6.91 5.76 5.76 0 0 0 .44 4.72 5.9 5.9 0 0 0 6.37 2.83 5.76 5.76 0 0 0 4.33 1.93 5.9 5.9 0 0 0 5.63-4.09 5.76 5.76 0 0 0 3.83-2.78 5.9 5.9 0 0 0-.73-6.91z"/>
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Chat Assistant</p>
            <p className="text-xs text-gray-400">Powered by groq</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="text-xs text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors"
        >
          Clear chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>

            {/* AI Avatar */}
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.28 9.28a5.76 5.76 0 0 0-.44-4.72 5.9 5.9 0 0 0-6.37-2.83 5.76 5.76 0 0 0-4.33-1.93 5.9 5.9 0 0 0-5.62 4.08 5.76 5.76 0 0 0-3.84 2.79 5.9 5.9 0 0 0 .73 6.91 5.76 5.76 0 0 0 .44 4.72 5.9 5.9 0 0 0 6.37 2.83 5.76 5.76 0 0 0 4.33 1.93 5.9 5.9 0 0 0 5.63-4.09 5.76 5.76 0 0 0 3.83-2.78 5.9 5.9 0 0 0-.73-6.91z"/>
                </svg>
              </div>
            )}

            {/* Bubble */}
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-green-600 text-white rounded-br-sm"
                  : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
              }`}
            >
              {msg.content}
            </div>

            {/* User Avatar */}
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-1 text-white text-xs font-semibold">
                You
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.28 9.28a5.76 5.76 0 0 0-.44-4.72 5.9 5.9 0 0 0-6.37-2.83 5.76 5.76 0 0 0-4.33-1.93 5.9 5.9 0 0 0-5.62 4.08 5.76 5.76 0 0 0-3.84 2.79 5.9 5.9 0 0 0 .73 6.91 5.76 5.76 0 0 0 .44 4.72 5.9 5.9 0 0 0 6.37 2.83 5.76 5.76 0 0 0 4.33 1.93 5.9 5.9 0 0 0 5.63-4.09 5.76 5.76 0 0 0 3.83-2.78 5.9 5.9 0 0 0-.73-6.91z"/>
              </svg>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex gap-2 items-end max-w-4xl mx-auto">
          <textarea
            className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent max-h-32 min-h-[44px] bg-gray-50"
            placeholder="Message ChatGPT..."
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="w-11 h-11 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
            </svg>
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          Press <kbd className="bg-gray-100 px-1 rounded">Enter</kbd> to send · <kbd className="bg-gray-100 px-1 rounded">Shift+Enter</kbd> for new line
        </p>
      </div>

    </div>
  );
};

export default ChatPage;
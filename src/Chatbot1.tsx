import { useState } from "react";
import { MessageCircle, Mic, Send } from "lucide-react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi, I am SixD's Virtual Assistant." },
    { sender: "bot", text: "How can I help you?" }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask-question/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input })
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { sender: "bot", text: data.answer }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Something went wrong." }
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      
      {/* Header */}
      <div className="bg-orange-500 text-white text-xl font-bold p-4 text-center">
        SixD Chatbot
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[70%] px-4 py-2 rounded-xl ${
              msg.sender === "user"
                ? "ml-auto bg-orange-500 text-white"
                : "bg-gray-100"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="bg-gray-100 px-4 py-2 rounded-xl w-fit">
            Typing...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 flex gap-3 border-t">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded-full px-4 py-2"
          placeholder="Type message..."
        />

        <button onClick={sendMessage} className="bg-orange-500 text-white p-3 rounded-full">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}


"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send, X, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AISalesChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! 👋 I'm here to help you build your dream website. What brings you here today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate session ID on mount
  useEffect(() => {
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(id);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: input,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage: Message = {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);

        // Show escalation notification if needed
        if (data.shouldEscalate) {
          console.log("Conversation escalated:", data.escalationReason);
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting. Please try again or call us at (984) 400-9443.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 z-50 group p-2"
        size="icon"
      >
        <div className="relative w-full h-full rounded-full bg-white/10 backdrop-blur-sm p-2 border-2 border-white/30">
          <Image
            src="/logo-transparent.png"
            alt="Kreative Intelligence"
            fill
            className="object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-[380px] h-[600px] shadow-2xl flex flex-col z-50 bg-slate-900 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-slate-700 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center gap-3">
          <div className="relative">
            <MessageCircle className="h-6 w-6 text-white" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-white">
              Live Chat
            </CardTitle>
            <p className="text-xs text-blue-100">We're online now!</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 text-white hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-slate-800 text-slate-100 border border-slate-700"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      <div className="p-4 border-t border-slate-700 bg-slate-900">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          Powered by AI • Typically responds in seconds
        </p>
      </div>
    </Card>
  );
}


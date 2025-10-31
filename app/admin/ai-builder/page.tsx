
"use client";

import { useState, useRef, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Paperclip, 
  Sparkles, 
  Zap,
  Download,
  Trash2,
  MessageSquare,
  Loader2,
  FileText,
  Image as ImageIcon,
  File
} from "lucide-react";
import { toast } from "sonner";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
};

export default function AIBuilderPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Welcome to **Kreative AI Builder**!\n\nI'm your AI assistant powered by advanced technology. I can help you:\n\n✨ **Build complete websites** - Just describe what you want\n🎨 **Design landing pages** - Tell me your vision\n🔧 **Modify existing projects** - I'll make the changes\n📊 **Create features** - Add functionality to your sites\n💡 **Brainstorm ideas** - Let's discuss your projects\n\n**How would you like to start?**",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
    toast.success(`${files.length} file(s) added`);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
      attachments: attachments.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
      })),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append("message", input);
      attachments.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/ai-builder/chat", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setAttachments([]);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "👋 Welcome back! How can I help you build something amazing today?",
        timestamp: new Date(),
      },
    ]);
    toast.success("Chat cleared");
  };

  const exportChat = () => {
    const chatContent = messages
      .map((msg) => `[${msg.role.toUpperCase()}] ${msg.content}`)
      .join("\n\n");
    
    const blob = new Blob([chatContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kreative-ai-chat-${Date.now()}.txt`;
    a.click();
    toast.success("Chat exported");
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-4 h-4" />;
    if (type.includes("pdf")) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <AdminLayout>
      <div className="h-screen flex flex-col bg-black">
        {/* Header */}
        <div className="border-b border-gray-800 bg-gray-900 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Kreative AI Builder</h1>
                <p className="text-sm text-gray-400">Your intelligent website building assistant</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={exportChat}
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={clearChat}
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-3xl ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-blue-600 to-purple-600"
                    : "bg-gray-900 border border-gray-800"
                } rounded-lg p-4`}
              >
                <div className="flex items-start gap-3">
                  {message.role === "assistant" && (
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg flex-shrink-0">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div
                      className={`prose prose-sm ${
                        message.role === "user" ? "text-white" : "text-gray-300"
                      } max-w-none whitespace-pre-wrap`}
                    >
                      {message.content}
                    </div>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.attachments.map((file, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs flex items-center gap-1"
                          >
                            {getFileIcon(file.type)}
                            {file.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="mt-2 text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                  <div className="text-gray-400">AI is thinking...</div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-800 bg-gray-900 p-6">
          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {attachments.map((file, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="flex items-center gap-2 pr-1"
                >
                  {getFileIcon(file.type)}
                  <span className="text-xs">{file.name}</span>
                  <button
                    onClick={() => removeAttachment(idx)}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="icon"
              className="border-gray-700 text-gray-300 flex-shrink-0"
            >
              <Paperclip className="w-5 h-5" />
            </Button>

            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe what you want to build... (Shift+Enter for new line)"
              className="flex-1 bg-gray-800 border-gray-700 text-white resize-none"
              rows={3}
            />

            <Button
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && attachments.length === 0)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex-shrink-0"
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-3 h-3" />
              <span>Powered by Advanced AI • Your branded solution</span>
            </div>
            <div>Press Enter to send, Shift+Enter for new line</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

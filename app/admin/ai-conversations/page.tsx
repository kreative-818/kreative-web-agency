
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, 
  AlertCircle, 
  CheckCircle, 
  Phone,
  Mail,
  User,
  TrendingUp,
  Clock,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";

interface Conversation {
  id: number;
  sessionId: string;
  visitorName: string | null;
  visitorEmail: string | null;
  visitorPhone: string | null;
  status: string;
  aiConfidence: number;
  conversionIntent: string;
  estimatedValue: number | null;
  humanTookOver: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ConversationMessage {
  id: number;
  role: string;
  content: string;
  createdAt: string;
}

export default function AIConversationsPage() {
  const [activeConversations, setActiveConversations] = useState<Conversation[]>([]);
  const [escalatedConversations, setEscalatedConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadConversations = async () => {
    try {
      const [activeRes, escalatedRes] = await Promise.all([
        fetch("/api/ai-agent/active"),
        fetch("/api/ai-agent/escalated"),
      ]);

      const activeData = await activeRes.json();
      const escalatedData = await escalatedRes.json();

      if (activeData.success) {
        setActiveConversations(activeData.conversations);
      }

      if (escalatedData.success) {
        setEscalatedConversations(escalatedData.escalated);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadConversationMessages = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/ai-agent/history?sessionId=${sessionId}`);
      const data = await response.json();

      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const takeoverConversation = async (sessionId: string) => {
    try {
      const response = await fetch("/api/ai-agent/takeover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          humanName: "Owner",
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Conversation taken over successfully");
        loadConversations();
      }
    } catch (error) {
      console.error("Failed to takeover conversation:", error);
      toast.error("Failed to takeover conversation");
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getIntentBadge = (intent: string) => {
    const colors: any = {
      high: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-gray-100 text-gray-800",
      unknown: "bg-gray-100 text-gray-800",
    };

    return <Badge className={colors[intent] || colors.unknown}>{intent}</Badge>;
  };

  const stats = {
    totalActive: activeConversations.length,
    totalEscalated: escalatedConversations.length,
    highIntent: activeConversations.filter((c) => c.conversionIntent === "high").length,
    totalEstimatedValue: activeConversations.reduce(
      (sum, c) => sum + (c.estimatedValue || 0),
      0
    ),
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Sales Conversations</h1>
          <p className="text-muted-foreground">
            Monitor and manage AI-powered sales conversations
          </p>
        </div>
        <Button onClick={loadConversations}>Refresh</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActive}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.totalEscalated}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Intent</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.highIntent}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Pipeline</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats.totalEstimatedValue / 100).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversations Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">
            Active ({activeConversations.length})
          </TabsTrigger>
          <TabsTrigger value="escalated">
            Escalated ({escalatedConversations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">Loading conversations...</p>
              </CardContent>
            </Card>
          ) : activeConversations.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  No active conversations right now
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeConversations.map((conversation) => (
                <Card
                  key={conversation.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedConversation(conversation.id);
                    loadConversationMessages(conversation.sessionId);
                  }}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {conversation.visitorName || "Anonymous Visitor"}
                        </CardTitle>
                        <div className="flex gap-2 items-center text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(conversation.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getIntentBadge(conversation.conversionIntent)}
                        {conversation.humanTookOver && (
                          <Badge variant="outline">Human Active</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-4 text-sm">
                      {conversation.visitorEmail && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[150px]">
                            {conversation.visitorEmail}
                          </span>
                        </div>
                      )}
                      {conversation.visitorPhone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{conversation.visitorPhone}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-muted-foreground">AI Confidence</p>
                        <p className={`text-lg font-bold ${getConfidenceColor(conversation.aiConfidence)}`}>
                          {conversation.aiConfidence}%
                        </p>
                      </div>

                      {conversation.estimatedValue && (
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Est. Value</p>
                          <p className="text-lg font-bold">
                            ${(conversation.estimatedValue / 100).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {!conversation.humanTookOver && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          takeoverConversation(conversation.sessionId);
                        }}
                        className="w-full"
                        variant="outline"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Take Over Conversation
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="escalated" className="space-y-4">
          {escalatedConversations.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  No escalated conversations
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {escalatedConversations.map(({ conversation, escalation }) => (
                <Card key={conversation.id} className="border-red-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          {conversation.visitorName || "Anonymous Visitor"}
                        </CardTitle>
                        <div className="flex gap-2 items-center text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(escalation.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <Badge variant="destructive">{escalation.urgency}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-red-900">
                        Escalation Reason:
                      </p>
                      <p className="text-sm text-red-700">{escalation.reason}</p>
                    </div>

                    <div className="flex gap-4 text-sm">
                      {conversation.visitorEmail && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span>{conversation.visitorEmail}</span>
                        </div>
                      )}
                      {conversation.visitorPhone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{conversation.visitorPhone}</span>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => takeoverConversation(conversation.sessionId)}
                      className="w-full"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Take Over Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Conversation Messages Modal */}
      {selectedConversation && messages.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Conversation Messages</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[500px] overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm font-medium mb-1">
                    {message.role === "user" ? "Customer" : "AI Agent"}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}


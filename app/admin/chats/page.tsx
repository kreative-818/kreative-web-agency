
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Phone, Mail, User, Clock, TrendingUp, AlertCircle } from "lucide-react";

type Message = {
  id: number;
  role: string;
  content: string;
  isHuman: boolean;
  createdAt: string;
  metadata?: any;
};

type Conversation = {
  id: number;
  sessionId: string;
  channel: string;
  visitorName: string | null;
  visitorEmail: string | null;
  visitorPhone: string | null;
  status: string;
  aiConfidence: number;
  conversionIntent: string;
  humanTookOver: boolean;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
};

export default function ChatsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/ai-agent/conversations");
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversationDetails = async (conversationId: number) => {
    try {
      const response = await fetch(`/api/ai-agent/conversations/${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedConversation(data.conversation);
      }
    } catch (error) {
      console.error("Error fetching conversation details:", error);
    }
  };

  const takeOverConversation = async (conversationId: number) => {
    try {
      const response = await fetch(`/api/ai-agent/conversations/${conversationId}/takeover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ humanName: "Admin" }),
      });
      if (response.ok) {
        fetchConversations();
        if (selectedConversation) {
          fetchConversationDetails(conversationId);
        }
      }
    } catch (error) {
      console.error("Error taking over conversation:", error);
    }
  };

  const filterConversations = (convos: Conversation[]) => {
    if (activeTab === "all") return convos;
    if (activeTab === "chat") return convos.filter((c) => c.channel === "chat");
    if (activeTab === "sms") return convos.filter((c) => c.channel === "sms");
    if (activeTab === "phone") return convos.filter((c) => c.channel === "phone");
    if (activeTab === "active") return convos.filter((c) => c.status === "active");
    if (activeTab === "escalated") return convos.filter((c) => c.status === "escalated");
    return convos;
  };

  const getChannelIcon = (channel: string) => {
    if (channel === "chat") return <MessageSquare className="h-4 w-4" />;
    if (channel === "sms") return <MessageSquare className="h-4 w-4" />;
    if (channel === "phone") return <Phone className="h-4 w-4" />;
    return <MessageSquare className="h-4 w-4" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") return <Badge variant="default">Active</Badge>;
    if (status === "closed") return <Badge variant="secondary">Closed</Badge>;
    if (status === "escalated") return <Badge variant="destructive">Escalated</Badge>;
    if (status === "converted") return <Badge className="bg-green-600">Converted</Badge>;
    return <Badge variant="outline">{status}</Badge>;
  };

  const getIntentBadge = (intent: string) => {
    if (intent === "high") return <Badge className="bg-green-600">High Intent</Badge>;
    if (intent === "medium") return <Badge className="bg-yellow-600">Medium Intent</Badge>;
    if (intent === "low") return <Badge variant="secondary">Low Intent</Badge>;
    return <Badge variant="outline">{intent}</Badge>;
  };

  const filteredConversations = filterConversations(conversations);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Conversations</h1>
        <p className="text-muted-foreground">
          View and manage all customer conversations (Chat, SMS, Phone)
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conversations.filter((c) => c.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conversations.filter((c) => c.channel === "sms").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Need Attention</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conversations.filter((c) => c.status === "escalated").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Conversations List */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="sms">SMS</TabsTrigger>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : filteredConversations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No conversations yet
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredConversations.map((convo) => (
                      <div
                        key={convo.id}
                        onClick={() => fetchConversationDetails(convo.id)}
                        className={`p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedConversation?.id === convo.id ? "bg-muted" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getChannelIcon(convo.channel)}
                            <span className="font-medium">
                              {convo.visitorName || convo.visitorPhone || "Unknown"}
                            </span>
                          </div>
                          {getStatusBadge(convo.status)}
                        </div>
                        {convo.visitorPhone && (
                          <div className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                            <Phone className="h-3 w-3" />
                            {convo.visitorPhone}
                          </div>
                        )}
                        {convo.conversionIntent !== "unknown" && (
                          <div className="mt-2">{getIntentBadge(convo.conversionIntent)}</div>
                        )}
                        <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(convo.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Conversation Details */}
        <div className="md:col-span-2">
          {selectedConversation ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getChannelIcon(selectedConversation.channel)}
                      {selectedConversation.visitorName ||
                        selectedConversation.visitorPhone ||
                        "Unknown"}
                    </CardTitle>
                    <CardDescription>
                      {selectedConversation.channel.toUpperCase()} Conversation •{" "}
                      {getStatusBadge(selectedConversation.status)}
                    </CardDescription>
                  </div>
                  {!selectedConversation.humanTookOver && (
                    <Button
                      onClick={() => takeOverConversation(selectedConversation.id)}
                      size="sm"
                    >
                      Take Over
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Customer Info */}
                <div className="mb-4 p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <div className="grid gap-2 text-sm">
                    {selectedConversation.visitorPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedConversation.visitorPhone}</span>
                      </div>
                    )}
                    {selectedConversation.visitorEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedConversation.visitorEmail}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span>AI Confidence: {selectedConversation.aiConfidence}%</span>
                    </div>
                    {selectedConversation.conversionIntent !== "unknown" && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {getIntentBadge(selectedConversation.conversionIntent)}
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Messages */}
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {selectedConversation.messages && selectedConversation.messages.length > 0 ? (
                      selectedConversation.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.role === "user" ? "justify-start" : "justify-end"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.role === "user"
                                ? "bg-muted"
                                : message.isHuman
                                ? "bg-blue-600 text-white"
                                : "bg-primary text-primary-foreground"
                            }`}
                          >
                            <div className="text-sm">{message.content}</div>
                            <div className="text-xs mt-1 opacity-70">
                              {new Date(message.createdAt).toLocaleTimeString()}
                              {message.isHuman && " • Human"}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        No messages yet
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-[600px]">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

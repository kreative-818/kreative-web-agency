
// Simple in-memory store for active conversations
// In production, this should be in a database

interface Conversation {
  id: string
  messages: Array<{
    role: 'user' | 'assistant' | 'support'
    content: string
    timestamp: Date
  }>
  phoneNumber?: string
  status: 'active' | 'live_support' | 'closed'
  createdAt: Date
  lastActivity: Date
}

const conversations = new Map<string, Conversation>()

export function createConversation(id: string): Conversation {
  const conversation: Conversation = {
    id,
    messages: [],
    status: 'active',
    createdAt: new Date(),
    lastActivity: new Date()
  }
  conversations.set(id, conversation)
  return conversation
}

export function getConversation(id: string): Conversation | undefined {
  return conversations.get(id)
}

export function updateConversation(id: string, updates: Partial<Conversation>) {
  const conversation = conversations.get(id)
  if (conversation) {
    Object.assign(conversation, updates)
    conversation.lastActivity = new Date()
    conversations.set(id, conversation)
  }
}

export function addMessage(
  conversationId: string, 
  role: 'user' | 'assistant' | 'support',
  content: string
) {
  const conversation = conversations.get(conversationId)
  if (conversation) {
    conversation.messages.push({
      role,
      content,
      timestamp: new Date()
    })
    conversation.lastActivity = new Date()
    conversations.set(conversationId, conversation)
  }
}

export function getConversationByPhone(phoneNumber: string): Conversation | undefined {
  for (const conv of conversations.values()) {
    if (conv.phoneNumber === phoneNumber && conv.status === 'live_support') {
      return conv
    }
  }
  return undefined
}

export function getAllConversations(): Conversation[] {
  return Array.from(conversations.values())
}

// Clean up old conversations (older than 24 hours)
setInterval(() => {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)
  for (const [id, conv] of conversations.entries()) {
    if (conv.lastActivity < cutoff) {
      conversations.delete(id)
    }
  }
}, 60 * 60 * 1000) // Run every hour

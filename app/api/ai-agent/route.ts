
import { NextRequest, NextResponse } from 'next/server';
import { 
  buildConversationContext, 
  parseAgentResponse,
  ConversationMessage 
} from '@/lib/ai-sales-agent';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array required' },
        { status: 400 }
      );
    }

    // Build conversation with system context
    const conversationMessages = buildConversationContext(messages);

    // Call Abacus AI LLM API
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: conversationMessages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.statusText}`);
    }

    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        let buffer = '';
        let partialRead = '';
        let isInMessage = false;
        let messageBuffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            partialRead += decoder.decode(value, { stream: true });
            let lines = partialRead.split('\n');
            partialRead = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  // Parse the complete response to extract action
                  const agentDecision = parseAgentResponse(buffer);
                  
                  // Send final parsed response
                  const finalData = JSON.stringify({
                    type: 'complete',
                    decision: agentDecision
                  });
                  controller.enqueue(encoder.encode(`data: ${finalData}\n\n`));
                  controller.close();
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content || '';
                  if (content) {
                    buffer += content;
                    
                    // Check if we've reached the MESSAGE: part
                    if (!isInMessage) {
                      if (buffer.includes('MESSAGE:')) {
                        isInMessage = true;
                        // Extract everything after MESSAGE:
                        const messagePart = buffer.split('MESSAGE:')[1];
                        if (messagePart) {
                          // Check if this part contains metadata tags
                          const metadataTags = ['SERVICE:', 'PRICE:', 'DESCRIPTION:', 'REASON:', 'SUMMARY:'];
                          let cleanMessage = messagePart;
                          
                          for (const tag of metadataTags) {
                            if (cleanMessage.includes(tag)) {
                              cleanMessage = cleanMessage.split(tag)[0];
                              break;
                            }
                          }
                          
                          messageBuffer = cleanMessage;
                          // Stream what we have so far
                          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'chunk', content: cleanMessage })}\n\n`));
                        }
                      }
                    } else {
                      // We're in the message part, check if we've hit a metadata tag
                      const metadataTags = ['SERVICE:', 'PRICE:', 'DESCRIPTION:', 'REASON:', 'SUMMARY:'];
                      const combinedBuffer = messageBuffer + content;
                      
                      let shouldStop = false;
                      for (const tag of metadataTags) {
                        if (combinedBuffer.includes(tag)) {
                          // Stop streaming, we've reached metadata
                          const cleanContent = combinedBuffer.split(tag)[0].substring(messageBuffer.length);
                          if (cleanContent) {
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'chunk', content: cleanContent })}\n\n`));
                          }
                          shouldStop = true;
                          break;
                        }
                      }
                      
                      if (!shouldStop) {
                        // Continue streaming
                        messageBuffer += content;
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'chunk', content })}\n\n`));
                      }
                    }
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('AI Agent error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

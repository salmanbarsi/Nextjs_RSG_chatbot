import { generateText, UIMessage, convertToModelMessages, streamText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,   // <-- API KEY HERE
});

export async function POST(request: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await request.json();

    const result = streamText({
      model: openrouter.chat("nvidia/nemotron-nano-12b-v2-vl:free"),
      messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error in POST /chat:", error);
    return Response.json({ text: "Error generating response." }, { status: 500 });
  }
}

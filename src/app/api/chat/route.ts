import { generateText, UIMessage, convertToModelMessages, streamText } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";

export async function POST(request: Request) {
    try {
    const { messages } : { messages : UIMessage[] } = await request.json();

    const result = streamText({
        model: openrouter("nvidia/nemotron-nano-12b-v2-vl:free"),
        messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error("Error in POST /chat:", error);
    return Response.json({ text: "Error generating response." }, { status: 500 });
  }
}
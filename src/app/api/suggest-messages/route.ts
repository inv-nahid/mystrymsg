import OpenAI from "openai"
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { NextResponse } from "next/server"

export const runtime = "edge"

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY!,
// })

export async function POST(req: Request) {
  try {
    const prompt = "Generate exactly 5 highly engaging, curiosity-driven anonymous message prompts for a secret messaging app (like Qooh.me or NGL), designed to feel personal, slightly vulnerable, and exciting to answer, similar to “truth or dare” (primarily truth-style) while remaining safe and respectful; avoid generic or overused questions, sensitive or harmful topics, and explicit content; keep each question short, sharp, and conversational, crafted to spark curiosity or reveal personality, hidden thoughts, or opinions; ensure variety by including one slightly flirty, one deep or thought-provoking, one fun or chaotic, one mildly risky but still appropriate, and one wholesome yet personal question; output everything as a single string with each question separated by “||”, and do not include numbering, explanations, or any extra text.";

    const response = streamText({
      model: openai("gpt-4o-mini"),
      prompt
    })
    
    return response.toTextStreamResponse()

  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error
      return NextResponse.json(
        { error: { name, status, headers, message } },
        { status },
      )
    } else {
      console.error("An unknown error occurred:", error)
      throw error
    }
  }
}

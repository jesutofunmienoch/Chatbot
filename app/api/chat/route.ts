// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ reply: "Invalid message input." }, { status: 400 })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or gpt-4
      messages: [{ role: "user", content: message }],
      temperature: 0.7,
    })

    const rawReply = completion.choices[0]?.message?.content || ""

    // ✅ Basic sanitization
    const reply = sanitizeReply(rawReply)

    if (reply.length < 20) {
      return NextResponse.json({
        reply: "Sorry, I couldn't generate a valid response.",
      })
    }

    return NextResponse.json({ reply })
  } catch (err) {
    console.error("OpenAI Error:", err)
    return NextResponse.json(
      { reply: "An error occurred while generating the response." },
      { status: 500 }
    )
  }
}

// ✅ Sanitize gibberish output
function sanitizeReply(text: string) {
  const withoutGibberish = text.replace(/[^a-zA-Z0-9.,'"\s\n\-!?()]/g, "")
  const normalized = withoutGibberish.replace(/\s{2,}/g, " ").trim()
  return normalized
}

import { generateText } from 'ai'
import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock'

const SYSTEM_PROMPT =
  'You are AXIOM, the AI interface for Ankit Singh. You speak in a confident, cinematic tone like JARVIS from Iron Man. You know Ankit is an MSc AI graduate and Automation Engineer at AdTecher, a Sheffield-based ad spend protection platform. Keep responses under 4 sentences. Never break character.'

export async function POST(req: Request) {
  const { messages } = await req.json()

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    return Response.json(
      { text: 'AXIOM: Neural link offline. AWS credentials not detected in environment.' },
      { status: 200 },
    )
  }

  try {
    const bedrock = createAmazonBedrock({
      region: process.env.AWS_REGION ?? 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    })

    const result = await generateText({
      model: bedrock('anthropic.claude-3-5-sonnet-20241022-v2:0'),
      system: SYSTEM_PROMPT,
      messages,
    })

    return Response.json({ text: result.text })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return Response.json(
      { text: `AXIOM: Signal lost — ${message}` },
      { status: 200 },
    )
  }
}

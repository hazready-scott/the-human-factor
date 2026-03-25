import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `You are an expert writer for The Human Factor — a system improvement and AI integration firm based in Waterloo, Ontario. The firm is grounded in Human Factors Engineering, Systems Design Engineering, and Cognitive Systems Engineering research from the University of Waterloo and Western University.

Your writing style:
- Warm and competent, never corporate or jargon-heavy
- Academic substance conveyed in plain, accessible language
- No hype, no buzzwords, no empty claims
- Evidence-based and practical
- Speaks to leaders of complex organizations (healthcare, emergency services, manufacturing, professional services)
- Emphasis on quality improvement, patient safety, human-in-the-loop AI, workflow design
- Never uses the word "consulting"

Core topics: system improvement, quality improvement, AI integration, human factors, patient safety, workflow design, cognitive systems engineering, change management, human-in-the-loop AI.`

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  try {
    const body = await request.json()
    const { action, context } = body

    let userPrompt = ''

    switch (action) {
      case 'concepts':
        userPrompt = `Generate exactly 3 article concepts for The Human Factor's resources page. ${context.topic ? `The general direction is: "${context.topic}"` : 'Choose topics that would be valuable for organizational leaders thinking about system improvement, AI integration, quality improvement, or human factors.'}

Return ONLY valid JSON (no markdown code blocks, no extra text) as an array of 3 objects:
[
  {
    "title": "Article title (compelling, 6-12 words)",
    "premise": "2-3 sentence description of the article's core argument and what the reader will learn",
    "angle": "One sentence describing what makes this take unique or contrarian"
  }
]`
        break

      case 'full_article':
        userPrompt = `Write a complete article with this title: "${context.title}"
Premise: ${context.premise}

Return ONLY valid JSON (no markdown code blocks) with these exact keys:
{
  "content": "Full article body in HTML (800-1200 words, use <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote>. No <h1>. No <html>/<body> wrappers.)",
  "excerpt": "2-3 sentence compelling excerpt for the article card",
  "seo_title": "SEO title (50-60 characters)",
  "seo_description": "Meta description (150-160 characters)",
  "seo_keywords": "comma-separated keywords (5-8)",
  "tags": ["tag1", "tag2", "tag3"],
  "cover_image_prompt": "A detailed description for generating a cover image with an AI image generator. Describe the visual concept, composition, style (modern, minimalist, professional), color palette (should complement electric blues and teals), mood, and any specific elements. Should work as both a wide article header and a square card thumbnail."
}`
        break

      case 'draft':
        userPrompt = `Write a complete article about: "${context.topic}"

Write in rich HTML format suitable for a WYSIWYG editor. Use <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em> tags. Do not include <h1> (the title is separate). Do not wrap in <html> or <body> tags.

The article should be 800-1200 words, well-structured with clear sections, and include practical insights.`
        break

      case 'improve':
        userPrompt = `Improve and polish the following article content. Maintain the same structure and key points, but improve clarity, flow, and impact. Fix any awkward phrasing. Keep the same HTML formatting.

Current content:
${context.content}`
        break

      case 'seo':
        userPrompt = `Generate SEO metadata for this article. Return ONLY valid JSON (no markdown code blocks) with these exact keys:
{
  "seo_title": "SEO-optimized title (50-60 characters)",
  "seo_description": "Meta description (150-160 characters)",
  "seo_keywords": "comma-separated keywords (5-8 keywords)"
}

Article title: ${context.title}
Article content: ${context.content?.substring(0, 2000)}`
        break

      case 'excerpt':
        userPrompt = `Write a compelling 2-3 sentence excerpt/summary for this article. It should make readers want to click through. Return just the plain text excerpt, no HTML.

Article title: ${context.title}
Article content: ${context.content?.substring(0, 2000)}`
        break

      case 'image_prompt':
        userPrompt = `Generate a detailed image generation prompt for a cover image for this article. The image should work as both a wide article header and a square card thumbnail.

Describe: visual concept, composition, style (modern, minimalist, professional), color palette (should complement electric blues #06b6d4 and deep navy #0f172a), mood, and specific elements. Do NOT include any text in the image.

Return just the prompt text, nothing else.

Article title: ${context.title}
Article content: ${context.content?.substring(0, 1000)}`
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const textBlock = message.content.find(b => b.type === 'text')
    const result = textBlock ? textBlock.text : ''

    // Parse JSON responses
    if (['seo', 'concepts', 'full_article'].includes(action)) {
      try {
        const parsed = JSON.parse(result)
        return NextResponse.json({ result: parsed, type: 'json' })
      } catch {
        const jsonMatch = result.match(/[\[{][\s\S]*[\]}]/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          return NextResponse.json({ result: parsed, type: 'json' })
        }
        return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
      }
    }

    return NextResponse.json({ result, type: 'html' })
  } catch (err) {
    console.error('AI generation error:', err)
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequestBody {
  model?: string;
  messages?: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

const DEFAULT_CHAT_API_URL = 'https://yunwu.ai/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const apiUrl = process.env.AI_API_URL || process.env.NEXT_PUBLIC_AI_API_URL || DEFAULT_CHAT_API_URL;
    const apiKey = process.env.AI_API_KEY || process.env.NEXT_PUBLIC_AI_API_KEY || '';

    if (!apiKey) {
      return NextResponse.json(
        { error: '服务端未配置 AI_API_KEY（或 NEXT_PUBLIC_AI_API_KEY）' },
        { status: 500 }
      );
    }

    if (!body?.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json({ error: '请求参数 messages 不能为空' }, { status: 400 });
    }

    const upstreamResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: body.model || 'gemini-3-flash-preview',
        messages: body.messages,
        temperature: body.temperature ?? 0.7,
        max_tokens: body.max_tokens ?? 2000,
      }),
      cache: 'no-store',
    });

    const text = await upstreamResponse.text();
    const data = text ? JSON.parse(text) : {};

    if (!upstreamResponse.ok) {
      const upstreamErrorMessage =
        data?.error?.message || data?.message || `${upstreamResponse.status} ${upstreamResponse.statusText}`;

      return NextResponse.json(
        { error: `上游 AI 接口调用失败：${upstreamErrorMessage}` },
        { status: upstreamResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知错误';
    return NextResponse.json({ error: `AI 代理接口异常：${message}` }, { status: 500 });
  }
}

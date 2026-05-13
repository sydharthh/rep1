export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  model: string;
  provider: string;
  tokensUsed?: number;
}

export interface LLMOptions {
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export abstract class BaseLLM {
  abstract readonly name: string;
  abstract readonly model: string;

  abstract complete(messages: LLMMessage[], options?: LLMOptions): Promise<LLMResponse>;

  async completeJSON<T>(messages: LLMMessage[], options?: LLMOptions): Promise<T> {
    const response = await this.complete(messages, { ...options, systemPrompt: `${options?.systemPrompt ?? ''}\nRespond ONLY with valid JSON. No markdown code blocks.` });
    return JSON.parse(response.content) as T;
  }
}

export class ClaudeProvider extends BaseLLM {
  readonly name = 'claude';
  readonly model = 'claude-3-5-sonnet-20241022';

  async complete(messages: LLMMessage[], options?: LLMOptions): Promise<LLMResponse> {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('VITE_ANTHROPIC_API_KEY not set');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: options?.maxTokens ?? 4096,
        system: options?.systemPrompt,
        messages: messages.filter(m => m.role !== 'system'),
      }),
    });

    if (!response.ok) throw new Error(`Claude API error: ${response.status}`);
    const data = await response.json() as { content: Array<{ text: string }>; usage: { input_tokens: number; output_tokens: number } };
    return {
      content: data.content[0]?.text ?? '',
      model: this.model,
      provider: this.name,
      tokensUsed: data.usage.input_tokens + data.usage.output_tokens,
    };
  }
}

export class OpenAIProvider extends BaseLLM {
  readonly name = 'openai';
  readonly model = 'gpt-4o';

  async complete(messages: LLMMessage[], options?: LLMOptions): Promise<LLMResponse> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) throw new Error('VITE_OPENAI_API_KEY not set');

    const allMessages = options?.systemPrompt
      ? [{ role: 'system' as const, content: options.systemPrompt }, ...messages]
      : messages;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: this.model, messages: allMessages, max_tokens: options?.maxTokens ?? 4096 }),
    });

    if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);
    const data = await response.json() as { choices: Array<{ message: { content: string } }>; usage: { total_tokens: number }; model: string };
    return {
      content: data.choices[0]?.message?.content ?? '',
      model: data.model,
      provider: this.name,
      tokensUsed: data.usage.total_tokens,
    };
  }
}

export class GeminiProvider extends BaseLLM {
  readonly name = 'gemini';
  readonly model = 'gemini-1.5-pro';

  async complete(messages: LLMMessage[], options?: LLMOptions): Promise<LLMResponse> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error('VITE_GEMINI_API_KEY not set');

    const systemInstruction = options?.systemPrompt;
    const contents = messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined, contents }),
    });

    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
    const data = await response.json() as { candidates: Array<{ content: { parts: Array<{ text: string }> } }>; usageMetadata: { totalTokenCount: number } };
    return {
      content: data.candidates[0]?.content?.parts[0]?.text ?? '',
      model: this.model,
      provider: this.name,
      tokensUsed: data.usageMetadata?.totalTokenCount,
    };
  }
}

export class AIProviderManager {
  private providers: BaseLLM[];
  private primaryIndex = 0;

  constructor(providers: BaseLLM[]) {
    this.providers = providers;
  }

  async complete(messages: LLMMessage[], options?: LLMOptions): Promise<LLMResponse> {
    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[(this.primaryIndex + i) % this.providers.length];
      try {
        return await provider.complete(messages, options);
      } catch {
        if (i === this.providers.length - 1) throw new Error('All AI providers failed');
      }
    }
    throw new Error('No AI providers available');
  }

  async completeJSON<T>(messages: LLMMessage[], options?: LLMOptions): Promise<T> {
    const response = await this.complete(messages, {
      ...options,
      systemPrompt: `${options?.systemPrompt ?? ''}\nRespond ONLY with valid JSON. No markdown.`,
    });
    return JSON.parse(response.content) as T;
  }
}

export const defaultAIManager = new AIProviderManager([
  new ClaudeProvider(),
  new OpenAIProvider(),
  new GeminiProvider(),
]);

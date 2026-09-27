import Anthropic from "@anthropic-ai/sdk";
import { CHAT_MODEL } from "@/lib/config";
import { systemPrompt } from "@/lib/knowledge";

/**
 * POST /api/chat — streams an answer from Claude as server-sent events:
 *   data: {"type":"content","token":"…"}   (repeated)
 *   data: {"type":"error","code":"…"}      (on failure)
 *   data: [DONE]
 *
 * GET /api/chat — { configured: boolean } so the console knows whether AI is available.
 */

const SYSTEM = systemPrompt();
const MAX_MESSAGE = 1000;
const MAX_HISTORY = 20;
const MAX_HISTORY_CHARS = 4000;

// Basic per-IP rate limit to protect the API key (per server instance).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 30;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_REQUESTS;
}

function makeClient(): Anthropic | null {
  // Reads ANTHROPIC_API_KEY (or another configured credential) from the environment.
  try {
    return new Anthropic();
  } catch {
    return null;
  }
}

const isConfigured = () => Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);

export async function GET() {
  return Response.json({ configured: isConfigured() });
}

type Body = { message?: unknown; history?: unknown };

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim().slice(0, MAX_MESSAGE) : "";
  if (!message) return Response.json({ error: "bad_request" }, { status: 400 });

  const history: Anthropic.Beta.BetaMessageParam[] = Array.isArray(body.history)
    ? body.history
        .slice(-MAX_HISTORY)
        .filter(
          (m): m is { role: "user" | "assistant"; content: string } =>
            !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.length > 0,
        )
        .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_HISTORY_CHARS) }))
    : [];
  while (history.length && history[0].role !== "user") history.shift();

  const client = isConfigured() ? makeClient() : null;
  if (!client) return Response.json({ error: "not_configured" }, { status: 503 });

  const encoder = new TextEncoder();
  const send = (controller: ReadableStreamDefaultController, data: unknown) =>
    controller.enqueue(encoder.encode(`data: ${typeof data === "string" ? data : JSON.stringify(data)}\n\n`));

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const claude = client.beta.messages.stream(
          {
            model: CHAT_MODEL,
            // Short, chatty answers; also caps what a public endpoint can spend per request.
            max_tokens: 2048,
            system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
            messages: [...history, { role: "user", content: message }],
            // Low effort keeps chat replies quick.
            output_config: { effort: "low" },
            // If the model's safety classifiers decline a request, Anthropic re-runs it on a fallback model.
            betas: ["server-side-fallback-2026-07-01"],
            fallbacks: "default",
          },
          { signal: req.signal },
        );

        for await (const event of claude) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            send(controller, { type: "content", token: event.delta.text });
          }
        }

        const final = await claude.finalMessage();
        if (final.stop_reason === "refusal") {
          send(controller, { type: "content", token: "\n(I can't help with that one — ask me about my work instead.)" });
        }
      } catch (error) {
        const code =
          error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError
            ? "not_configured"
            : error instanceof Anthropic.RateLimitError
              ? "rate_limited"
              : error instanceof Anthropic.APIUserAbortError
                ? "aborted"
                : "upstream";
        if (code === "upstream") console.error("[api/chat]", error);
        send(controller, { type: "error", code });
      }
      send(controller, "[DONE]");
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

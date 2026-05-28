/**
 * HezCast API Client
 * Connects Next.js frontend to FastAPI backend on port 8503
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8503";

// ── Types ──────────────────────────────────────────────────────

export type JobStatus =
  | "queued" | "generating_hooks" | "awaiting_selection"
  | "processing" | "composing" | "qa_check"
  | "completed" | "failed" | "needs_review";

export interface Job {
  job_id:          string;
  brand:           string;
  topic:           string;
  status:          JobStatus;
  duration_sec:    number | null;
  render_time_ms:  number | null;
  qa_passed:       boolean | null;
  llm_used:        string | null;
  output_path:     string | null;
  output_url:      string | null;
  error_message:   string | null;
  thumbnail_paths: string[] | null;
  created_at:      string;
  completed_at:    string | null;
}

export interface HookVariant {
  variant_num: number;
  hook_text:   string;
  selected:    boolean;
}

export interface GenerateRequest {
  topic?: string;
  url?:   string;
  brand:  string;
  tone?:  string;
}

export interface GenerateResponse {
  job_id: string;
  status: string;
}

export interface BalanceResponse {
  credits:       number;
  plan:          string;
  plan_name:     string;
  monthly_alloc: number;
}

export interface HealthResponse {
  status:   string;
  version:  string;
  services: Record<string, string>;
}

export interface Brand {
  name:                 string;
  tone:                 string;
  style:                string;
  audience:             string;
  persona_name:         string;
  hook_variants:        number;
  video_duration_target: number;
  subtitle_color:       string;
}

// ── Client ─────────────────────────────────────────────────────

class HezCastAPI {
  private base: string;
  private apiKey: string;

  constructor(base = API_BASE, apiKey = "") {
    this.base   = base;
    this.apiKey = apiKey;
  }

  private async request<T>(
    method:  string,
    path:    string,
    body?:   unknown,
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.apiKey) headers["X-API-Key"] = this.apiKey;

    const res = await fetch(`${this.base}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new APIError(res.status, err.detail || "Request failed");
    }

    return res.json();
  }

  // ── Health ────────────────────────────────────────────────────

  async health(): Promise<HealthResponse> {
    return this.request("GET", "/health");
  }

  // ── Brands ────────────────────────────────────────────────────

  async brands(): Promise<Brand[]> {
    return this.request("GET", "/brands");
  }

  // ── Generate ──────────────────────────────────────────────────

  async generate(req: GenerateRequest): Promise<GenerateResponse> {
    return this.request("POST", "/generate", req);
  }

  // ── Status ────────────────────────────────────────────────────

  async status(jobId: string): Promise<Job> {
    return this.request("GET", `/status/${jobId}`);
  }

  // ── Hooks ─────────────────────────────────────────────────────

  async hooks(jobId: string): Promise<HookVariant[]> {
    return this.request("GET", `/hooks/${jobId}`);
  }

  async selectHook(jobId: string, variantNum: number): Promise<{ job_id: string; status: string }> {
    return this.request("POST", `/hooks/${jobId}/select`, { variant_num: variantNum });
  }

  // ── Billing ───────────────────────────────────────────────────

  async balance(): Promise<BalanceResponse> {
    return this.request("GET", "/billing/balance");
  }

  async topup(pkg: string): Promise<{ checkout_url: string; credits: number }> {
    return this.request("POST", "/billing/topup", { package: pkg });
  }

  async plans(): Promise<unknown[]> {
    return this.request("GET", "/billing/plans");
  }

  // ── Onboarding ────────────────────────────────────────────────

  async createBrand(config: Record<string, unknown>): Promise<{ brand_id: string; name: string }> {
    return this.request("POST", "/onboarding/brand", config);
  }

  async myBrands(): Promise<unknown[]> {
    return this.request("GET", "/onboarding/brands");
  }

  async onboardingStatus(): Promise<{ complete: boolean; missing: string[] }> {
    return this.request("GET", "/onboarding/complete");
  }

  // ── Telegram ──────────────────────────────────────────────────

  async telegramInfo(): Promise<{ configured: boolean; chat_id: string | null }> {
    return this.request("GET", "/telegram/webhook/info");
  }

  async registerWebhook(domain: string): Promise<{ ok: boolean; webhook_url?: string }> {
    return this.request("POST", "/telegram/webhook/register", { domain });
  }
}

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "APIError";
  }
}

// Singleton instance
export const api = new HezCastAPI();

// Factory for authenticated instances
export function createAPI(apiKey: string) {
  return new HezCastAPI(API_BASE, apiKey);
}

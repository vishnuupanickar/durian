import { D1DatabaseSummarySchema } from "@durian/shared";

type CloudflareDatabaseListResponse = {
  errors?: Array<{ message?: string }>;
  result?: Array<{
    created_at: string;
    file_size?: number;
    name: string;
    num_tables?: number;
    uuid: string;
    version?: string;
  }>;
  success: boolean;
};

class CloudflareClient {
  async listDatabases(token: string): Promise<import("@durian/shared").D1DatabaseSummary[]> {
    const accountId = extractAccountId(token);
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const payload = (await response.json()) as CloudflareDatabaseListResponse;
    if (!response.ok || !payload.success) {
      const message = payload.errors?.[0]?.message ?? "Failed to fetch D1 databases from Cloudflare.";
      throw new Error(message);
    }

    return (payload.result ?? []).map((database) =>
      D1DatabaseSummarySchema.parse({
        id: database.uuid,
        name: database.name,
        createdAt: database.created_at,
        fileSizeBytes: database.file_size ?? null,
        tableCount: database.num_tables ?? null,
        version: database.version ?? null
      })
    );
  }
}

function extractAccountId(token: string): string {
  const parts = token.split(":");
  if (parts.length === 2 && parts[0]) {
    return parts[0];
  }

  throw new Error(
    "Durian currently expects a token in the format <account_id>:<api_token>. This keeps the first scaffold simple until account lookup is implemented."
  );
}

export const cloudflareClient = new CloudflareClient();


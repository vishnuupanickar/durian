import { z } from "zod";

export const AuthTokenSchema = z.object({
  token: z
    .string()
    .min(1, "Cloudflare token is required.")
    .refine((value) => value.includes(":"), "Use the format <account_id>:<api_token> for this first scaffold.")
});

export const D1DatabaseSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  fileSizeBytes: z.number().nullable(),
  tableCount: z.number().nullable(),
  version: z.string().nullable()
});

export const D1ListResponseSchema = z.object({
  databases: z.array(D1DatabaseSummarySchema),
  error: z.string().optional()
});

export const SystemAppInfoSchema = z.object({
  name: z.string(),
  version: z.string(),
  platform: z.string()
});

export const ElectronApiSchema = z.object({
  auth: z.object({
    getStatus: z.function().returns(z.promise(z.object({ hasToken: z.boolean() }))),
    saveToken: z.function().args(AuthTokenSchema).returns(z.promise(z.object({ ok: z.boolean() })))
  }),
  d1: z.object({
    listDatabases: z.function().returns(z.promise(D1ListResponseSchema))
  }),
  system: z.object({
    getAppInfo: z.function().returns(z.promise(SystemAppInfoSchema))
  })
});

export const IpcChannels = {
  AuthGetStatus: "auth:get-status",
  AuthSaveToken: "auth:save-token",
  D1ListDatabases: "d1:list-databases",
  SystemGetAppInfo: "system:get-app-info"
} as const;

export type AuthTokenInput = z.infer<typeof AuthTokenSchema>;
export type D1DatabaseSummary = z.infer<typeof D1DatabaseSummarySchema>;
export type D1ListResponse = z.infer<typeof D1ListResponseSchema>;
export type SystemAppInfo = z.infer<typeof SystemAppInfoSchema>;

export type DurianElectronApi = {
  auth: {
    getStatus: () => Promise<{ hasToken: boolean }>;
    saveToken: (input: AuthTokenInput) => Promise<{ ok: boolean }>;
  };
  d1: {
    listDatabases: () => Promise<D1ListResponse>;
  };
  system: {
    getAppInfo: () => Promise<SystemAppInfo>;
  };
};

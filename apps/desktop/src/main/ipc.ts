import { ipcMain } from "electron";
import {
  AuthTokenSchema,
  D1ListResponseSchema,
  IpcChannels,
  SystemAppInfoSchema,
  type D1DatabaseSummary
} from "@durian/shared";
import { cloudflareClient } from "./services/cloudflare";
import { secureStore } from "./services/secure-store";

export function registerIpcHandlers(): void {
  ipcMain.handle(IpcChannels.AuthSaveToken, async (_event, payload) => {
    const parsed = AuthTokenSchema.parse(payload);
    await secureStore.setToken(parsed.token);
    return { ok: true };
  });

  ipcMain.handle(IpcChannels.AuthGetStatus, async () => {
    const hasToken = await secureStore.hasToken();
    return { hasToken };
  });

  ipcMain.handle(IpcChannels.D1ListDatabases, async () => {
    const token = await secureStore.getToken();
    if (!token) {
      return D1ListResponseSchema.parse({
        databases: [],
        error: "No Cloudflare API token is configured yet."
      });
    }

    const databases: D1DatabaseSummary[] = await cloudflareClient.listDatabases(token);
    return D1ListResponseSchema.parse({ databases });
  });

  ipcMain.handle(IpcChannels.SystemGetAppInfo, async () => {
    return SystemAppInfoSchema.parse({
      name: "Durian",
      version: "0.1.0",
      platform: process.platform
    });
  });
}

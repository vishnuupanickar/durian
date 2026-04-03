import { contextBridge, ipcRenderer } from "electron";
import {
  AuthTokenSchema,
  D1ListResponseSchema,
  IpcChannels,
  SystemAppInfoSchema,
  type DurianElectronApi
} from "@durian/shared";

const api: DurianElectronApi = {
  auth: {
    async getStatus() {
      return ipcRenderer.invoke(IpcChannels.AuthGetStatus);
    },
    async saveToken(input) {
      const payload = AuthTokenSchema.parse(input);
      return ipcRenderer.invoke(IpcChannels.AuthSaveToken, payload);
    }
  },
  d1: {
    async listDatabases() {
      const response = await ipcRenderer.invoke(IpcChannels.D1ListDatabases);
      return D1ListResponseSchema.parse(response);
    }
  },
  system: {
    async getAppInfo() {
      const response = await ipcRenderer.invoke(IpcChannels.SystemGetAppInfo);
      return SystemAppInfoSchema.parse(response);
    }
  }
};

contextBridge.exposeInMainWorld("durian", api);


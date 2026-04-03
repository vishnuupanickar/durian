/// <reference types="vite/client" />

import type { DurianElectronApi } from "@durian/shared";

declare global {
  interface Window {
    durian: DurianElectronApi;
  }
}

export {};


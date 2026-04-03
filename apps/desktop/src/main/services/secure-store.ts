const SERVICE_NAME = "durian";
const ACCOUNT_NAME = "cloudflare-api-token";

class SecureStore {
  async getToken(): Promise<string | null> {
    const keytar = await this.loadKeytar();
    const storedValue = await keytar.getPassword(SERVICE_NAME, ACCOUNT_NAME);
    return storedValue ?? null;
  }

  async setToken(token: string): Promise<void> {
    const keytar = await this.loadKeytar();
    await keytar.setPassword(SERVICE_NAME, ACCOUNT_NAME, token);
  }

  async hasToken(): Promise<boolean> {
    const token = await this.getToken();
    return Boolean(token);
  }

  private async loadKeytar(): Promise<typeof import("keytar")> {
    const keytar = await import("keytar");
    return keytar;
  }
}

export const secureStore = new SecureStore();

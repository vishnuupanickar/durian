import { FormEvent, useEffect, useState, useTransition } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAppStore } from "./state/app-store";

export function App() {
  const [tokenInput, setTokenInput] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const setHasToken = useAppStore((state) => state.setHasToken);

  const appInfoQuery = useQuery({
    queryKey: ["app-info"],
    queryFn: () => window.durian.system.getAppInfo()
  });

  const authStatusQuery = useQuery({
    queryKey: ["auth-status"],
    queryFn: async () => {
      const status = await window.durian.auth.getStatus();
      setHasToken(status.hasToken);
      return status;
    }
  });

  const databasesQuery = useQuery({
    queryKey: ["d1-databases"],
    queryFn: () => window.durian.d1.listDatabases(),
    enabled: authStatusQuery.data?.hasToken === true
  });

  const saveTokenMutation = useMutation({
    mutationFn: (token: string) => window.durian.auth.saveToken({ token }),
    onSuccess: async () => {
      setStatusMessage("Token saved. Durian is ready to fetch D1 databases.");
      setHasToken(true);
      await authStatusQuery.refetch();
      await databasesQuery.refetch();
      setTokenInput("");
    },
    onError: (error) => {
      setStatusMessage(error instanceof Error ? error.message : "Unable to save token.");
    }
  });

  useEffect(() => {
    if (databasesQuery.error instanceof Error) {
      setStatusMessage(databasesQuery.error.message);
    }
  }, [databasesQuery.error]);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    startTransition(() => {
      setStatusMessage(
        "Using <account_id>:<api_token> for the first scaffold. We can replace this with an account picker next."
      );
    });
    void saveTokenMutation.mutateAsync(tokenInput);
  }

  const hasToken = authStatusQuery.data?.hasToken === true;
  const databases = databasesQuery.data?.databases ?? [];

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Cloudflare D1 desktop studio</p>
        <h1>Durian</h1>
        <p className="lede">
          A desktop workspace for browsing D1 databases, running SQL, and eventually importing SQLite
          with guardrails.
        </p>
        <div className="meta-row">
          <span>{appInfoQuery.data?.platform ?? "desktop"}</span>
          <span>v{appInfoQuery.data?.version ?? "0.1.0"}</span>
          <span>{hasToken ? "token configured" : "token missing"}</span>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Connect Cloudflare</h2>
            <p>The first slice stores a token securely and lists available D1 databases.</p>
          </div>
        </div>

        <form className="token-form" onSubmit={handleSubmit}>
          <label htmlFor="token">Cloudflare credentials</label>
          <input
            id="token"
            name="token"
            type="password"
            placeholder="account_id:api_token"
            value={tokenInput}
            onChange={(event) => setTokenInput(event.target.value)}
            autoComplete="off"
          />
          <button type="submit" disabled={!tokenInput || saveTokenMutation.isPending}>
            {saveTokenMutation.isPending ? "Saving..." : "Save Token"}
          </button>
        </form>

        {(statusMessage || isPending) && (
          <p className="status">
            {statusMessage}
            {isPending ? " Updating UI..." : ""}
          </p>
        )}
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>D1 Databases</h2>
            <p>This is the first end-to-end vertical slice for Durian.</p>
          </div>
          <button
            type="button"
            className="secondary-button"
            disabled={!hasToken || databasesQuery.isFetching}
            onClick={() => void databasesQuery.refetch()}
          >
            {databasesQuery.isFetching ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {!hasToken && <p className="empty">Add a token above to load your D1 database list.</p>}
        {hasToken && databases.length === 0 && !databasesQuery.isFetching && (
          <p className="empty">No databases returned yet. This may be a valid empty account or a token issue.</p>
        )}
        {databases.length > 0 && (
          <div className="database-list">
            {databases.map((database) => (
              <article key={database.id} className="database-card">
                <div className="database-topline">
                  <h3>{database.name}</h3>
                  <span>{database.tableCount ?? "?"} tables</span>
                </div>
                <p className="database-id">{database.id}</p>
                <div className="database-stats">
                  <span>Created {new Date(database.createdAt).toLocaleDateString()}</span>
                  <span>
                    {database.fileSizeBytes === null
                      ? "Size unknown"
                      : `${Math.max(1, Math.round(database.fileSizeBytes / 1024))} KB`}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}


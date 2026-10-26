// A `fetch` that answers from the app's own API route files in the same process, so a test can
// drive the real screens against the real server code without a network.
import * as me from '@/app/api/auth/me+api';
import * as signIn from '@/app/api/auth/sign-in+api';
import * as signOut from '@/app/api/auth/sign-out+api';
import * as signUp from '@/app/api/auth/sign-up+api';
import * as health from '@/app/api/health+api';
import * as task from '@/app/api/tasks/[id]+api';
import * as tasks from '@/app/api/tasks+api';
import { createServerApp, setServerApp, type ServerAppOptions } from '@/server/app';

type Handler = (request: Request, params: Record<string, string>) => Response | Promise<Response>;

const ROUTES: { pattern: RegExp; module: Record<string, unknown> }[] = [
  { pattern: /^\/api\/health$/, module: health },
  { pattern: /^\/api\/auth\/sign-up$/, module: signUp },
  { pattern: /^\/api\/auth\/sign-in$/, module: signIn },
  { pattern: /^\/api\/auth\/sign-out$/, module: signOut },
  { pattern: /^\/api\/auth\/me$/, module: me },
  { pattern: /^\/api\/tasks$/, module: tasks },
  { pattern: /^\/api\/tasks\/(?<id>[^/]+)$/, module: task },
];

/** Starts a fresh server and returns a `fetch` that calls its route handlers. */
export function inProcessServer(options: ServerAppOptions = {}) {
  setServerApp(createServerApp({ iterations: 1_000, ...options }));
  const requests: string[] = [];
  const fetch = async (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
    const request = new Request(input, init);
    const { pathname } = new URL(request.url);
    requests.push(`${request.method} ${pathname}`);
    for (const { pattern, module } of ROUTES) {
      const match = pattern.exec(pathname);
      if (!match) continue;
      const handler = module[request.method] as Handler | undefined;
      if (!handler) return new Response(null, { status: 405 });
      return handler(request, { ...match.groups });
    }
    return new Response(null, { status: 404 });
  };
  return { fetch: fetch as typeof globalThis.fetch, requests };
}

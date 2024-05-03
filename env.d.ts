import { CfProperties, Request, ExecutionContext, KVNamespace, D1Database } from '@cloudflare/workers-types';

declare module 'h3' {
    interface H3EventContext {
        cf: CfProperties,
        cloudflare: {
          request: Request,
          env: {
            MY_KV: KVNamespace,
            D1: D1Database,
          }
          context: ExecutionContext,
        };
    }
}
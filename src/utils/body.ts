import { EventHandlerRequest, H3Event } from 'h3';

export function hasBody(event: H3Event) {
  const method = event.method.toUpperCase();
  return ['PUT', 'POST', 'PATCH', 'DELETE'].includes(method);
}

export async function getBodyBuffer(
  event: H3Event,
): Promise<Buffer | undefined> {
  if (!hasBody(event)) return;
  return await readRawBody(event, false);
}

/**
 * Does not validate whether the response is an HTML reponse.
 */
export async function rewriteLinks(event: H3Event<EventHandlerRequest>, response: Response, { base }: { base?: string } = {}) {
  const _base = "http://localhost:8787"

  const html = (getRequestWebStream(event) as ReadableStream<Uint8Array>)
  
  // add base tag
  const baseTag = `<base href="${_base}">`;
}
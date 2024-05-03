import { getBodyBuffer, rewriteLinks } from '@/utils/body';
import {
  getProxyHeaders,
  getAfterResponseHeaders,
  getBlacklistedHeaders,
} from '@/utils/headers';
import {
  createTokenIfNeeded,
  isAllowedToMakeRequest,
  setTokenHeader,
} from '@/utils/turnstile';

export const app = createApp();

const router = createRouter();

app.use(router);

router.get('/', defineEventHandler(async (event) => {
  // handle cors, if applicable
  if (isPreflightRequest(event)) return handleCors(event, {});
  
  // parse destination URL
  const host = event.web?.request?.headers?.get('host');
  if (!host)
    return await sendJson({
      event,
      status: 400,
      data: {
        error: 'Invalid host',
      },
    });

  // get first subdomain
  const subdomain = host.split('.').at(0);
  if (!subdomain)
    return await sendJson({
      event,
      status: 400,
      data: {
        error: 'Invalid subdomain',
      },
    });

  // const destination = getQuery<{ destination?: string }>(event).destination;
  const result = event.context.cloudflare.env.D1.prepare('SELECT * FROM subdomains WHERE subdomain = ?')
  .bind(subdomain)
  .first();


  if (!(await isAllowedToMakeRequest(event)))
    return await sendJson({
      event,
      status: 401,
      data: {
        error: 'Invalid or missing token',
      },
    });

  // read body
  const body = await getBodyBuffer(event);
  const token = await createTokenIfNeeded(event);

  const destination = "https://www.example.com"

  // proxy
  try {
    await specificProxyRequest(event, destination, {
      blacklistedHeaders: getBlacklistedHeaders(),
      fetchOptions: {
        redirect: 'follow',
        headers: getProxyHeaders(event.headers),
        body,
      },
      async onResponse(outputEvent, response) {
        const headers = getAfterResponseHeaders(response.headers, response.url);
        setResponseHeaders(outputEvent, headers);
        if (token) setTokenHeader(event, token);

        // parse html and rewrite links if any
        if (response.headers.get('content-type')?.includes('text/html')) {
          await rewriteLinks(outputEvent, response);
        }
      },
    });
  } catch (e) {
    console.log('Error fetching', e);
    throw e;
  }
})
);
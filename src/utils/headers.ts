// import { HeaderGenerator, PRESETS } from 'header-generator';


// const headerGenerator = new HeaderGenerator({
//   browserListQuery: PRESETS.MODERN_DESKTOP.browserListQuery,
//   // @ts-ignore
//   operatingSystems: PRESETS.MODERN_WINDOWS.operatingSystems,
// });

// const proxyHeaders = headerGenerator.getHeaders();


const headerMap: Record<string, string> = {
  'X-Cookie': 'Cookie',
  'X-Referer': 'Referer',
  'X-Origin': 'Origin',
  'X-User-Agent': 'User-Agent',
  'X-X-Real-Ip': 'X-Real-Ip',
};

// Some headers are added by Cloudflare and other services 
// Should not be forwarded to the origin to avoid detection
const blacklistedHeaders = [
  'cf-connecting-ip',
  'cf-worker',
  'cf-ray',
  'cf-visitor',
  'cf-ew-via',
  'cdn-loop',
  'x-amzn-trace-id',
  'cf-ipcountry',
  'x-forwarded-for',
  'x-forwarded-host',
  'x-forwarded-proto',
  'forwarded',
  'x-real-ip',
  'content-length',
  ...Object.keys(headerMap),
];

function copyHeader(
  headers: Headers,
  outputHeaders: Headers,
  inputKey: string,
  outputKey: string,
) {
  if (headers.has(inputKey))
    outputHeaders.set(outputKey, headers.get(inputKey) ?? '');
}

export function getProxyHeaders(headers: Headers): Headers {
  const output = new Headers();

  // Object.entries(proxyHeaders).forEach((entry) => {
  //   output.set(entry[0], entry[1]);
  // });

  Object.entries(headerMap).forEach((entry) => {
    copyHeader(headers, output, entry[0], entry[1]);
  });

  return output;
}

export function getAfterResponseHeaders(
  headers: Headers,
  finalUrl: string,
): Record<string, string> {
  const output: Record<string, string> = {};

  if (headers.has('Set-Cookie'))
    output['X-Set-Cookie'] = headers.get('Set-Cookie') ?? '';

  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Expose-Headers': '*',
    'Access-Control-Allow-Headers': '*',
    Vary: 'Origin',
    'X-Final-Destination': finalUrl,
    'Content-Security-Policy': '',
    'X-Frame-Options': 'ALLOWALL',
  };
}

export function getBlacklistedHeaders() {
  return blacklistedHeaders;
}

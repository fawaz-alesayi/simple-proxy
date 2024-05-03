# simple-iframe-proxy

A simple proxy specialized in loading any website in an iframe's.

---

### features:
 - Deployable on many platforms - thanks to nitro
 - header rewrites - read and write protected headers
 - bypass CORS - always allows browser to send requests through it
 - secure it with turnstile - prevent bots from using your proxy

 Special for this fork:
 - Static link rewriting - Rewrites all links in the returned HTML to point to this proxy.
 - Relative asset forwarding - adds a `<base>` element that points to the proxy url.
 - Dynamic asset forwarding - adds a Service Worker that redirects all dynamically fetched assets to the proxy url

> [!WARNING]
> Turnstile integration only works properly with cloudflare workers as platform

### supported platforms:
 - cloudflare workers
 - AWS lambda
 - nodejs
 - bunjs
 - netlify edge functions

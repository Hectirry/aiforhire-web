// Cloudflare Pages Function — markdown content negotiation for AI agents.
// Serves /index.md when the homepage is requested with Accept: text/markdown,
// and guarantees discovery Link headers on the homepage (HTML or markdown),
// since _headers may not apply when Functions sit in front of static assets.

const LINK_HEADER_VALUES = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</auth.md>; rel="service-doc"; type="text/markdown"',
  '</index.md>; rel="alternate"; type="text/markdown"',
];

function appendDiscoveryHeaders(headers) {
  for (const value of LINK_HEADER_VALUES) {
    headers.append('Link', value);
  }
  headers.append('Vary', 'Accept');
}

export async function onRequest(context) {
  try {
    const { request } = context;
    const pathname = new URL(request.url).pathname;
    const isHomepage = pathname === '/' || pathname === '/index.html';
    const accept = request.headers.get('Accept') || '';

    if (isHomepage && accept.includes('text/markdown')) {
      const asset = await context.env.ASSETS.fetch(
        new URL('/index.md', request.url)
      );
      if (asset.ok) {
        const text = await asset.text();
        const headers = new Headers();
        headers.set('Content-Type', 'text/markdown; charset=utf-8');
        headers.set('X-Markdown-Tokens', String(Math.ceil(text.length / 4)));
        appendDiscoveryHeaders(headers);
        return new Response(text, { status: 200, headers });
      }
      // index.md missing — fall through to the normal HTML response.
    }

    const response = await context.next();
    if (isHomepage) {
      const augmented = new Response(response.body, response);
      appendDiscoveryHeaders(augmented.headers);
      return augmented;
    }
    return response;
  } catch (err) {
    return context.next();
  }
}

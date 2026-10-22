// Run from an independent network: node scripts/audit-public-demos.mjs > network-audit.json
// Read-only checks. This does not replace the browser scenarios in docs/portfolio-demo-audit.md.
import https from 'node:https';

const targets = [
  'https://adam-sapiecha.github.io/Portfolio-AdamSapiecha/index.html',
  'https://adam-sapiecha.github.io/Portfolio-AdamSapiecha/projects.html',
  'https://adam-sapiecha.github.io/Portfolio-AdamSapiecha/taskmesh/',
  'https://adam-sapiecha.github.io/Portfolio-AdamSapiecha/sentinelhub/',
  'https://adam-sapiecha.github.io/Portfolio-AdamSapiecha/dual-agent/',
  'https://luxonis.tail6ad453.ts.net:8443/taskmesh/',
  'https://luxonis.tail6ad453.ts.net:8443/support/',
  'https://luxonis.tail6ad453.ts.net:8443/support/api/health',
  'https://luxonis.tail6ad453.ts.net:8443/',
  'https://luxonis.tail6ad453.ts.net:8443/lab',
  'https://luxonis.tail6ad453.ts.net:8443/process/',
  'https://luxonis.tail6ad453.ts.net:8443/sentinelhub/',
  'https://luxonis.tail6ad453.ts.net:8443/sentinelhub/sample.html',
  'https://luxonis.tail6ad453.ts.net:8443/sentinelhub/examples/roads.geojson',
  'https://luxonis.tail6ad453.ts.net:8443/sentinelhub/examples/flood.geojson',
];

function publicIPv4(ip) {
  const [a, b] = ip.split('.').map(Number);
  return a > 0 && a < 224 && a !== 10 && a !== 127 &&
    !(a === 100 && b >= 64 && b <= 127) &&
    !(a === 169 && b === 254) && !(a === 172 && b >= 16 && b <= 31) &&
    !(a === 192 && b === 168) && !(a === 198 && (b === 18 || b === 19));
}

async function resolvePublic(hostname) {
  const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=A`, {
    headers: { accept: 'application/dns-json' }, signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`DNS resolver HTTP ${response.status}`);
  const data = await response.json();
  const addresses = (data.Answer || []).filter(a => a.type === 1).map(a => a.data);
  if (data.Status !== 0 || !addresses.length || addresses.some(ip => !publicIPv4(ip))) {
    throw new Error(`No public A records (DNS status ${data.Status})`);
  }
  return addresses;
}

function probe(rawUrl, addresses, options = {}) {
  return new Promise(resolve => {
    const started = Date.now();
    const url = new URL(rawUrl);
    let connection = {};
    // Force a public DNS answer, bypassing local hosts/MagicDNS. TLS validation stays enabled.
    const req = https.request(url, {
      method: options.method || 'GET',
      lookup: (_host, options, callback) => options?.all
        ? callback(null, [{ address: addresses[0], family: 4 }])
        : callback(null, addresses[0], 4),
      headers: { 'User-Agent': 'PortfolioDemoAudit/1.0', accept: '*/*', ...options.headers },
    }, response => {
      const socket = response.socket;
      const cert = socket.getPeerCertificate();
      connection = { remoteAddress: socket.remoteAddress, tlsAuthorized: socket.authorized,
        tlsProtocol: socket.getProtocol(), certificate: { subject: cert.subject?.CN,
          issuer: cert.issuer?.CN, validFrom: cert.valid_from, validTo: cert.valid_to } };
      let bytes = 0;
      response.on('data', chunk => {
        bytes += chunk.length;
        if (bytes > 4 * 1024 * 1024) req.destroy(new Error('Response exceeds 4 MiB audit limit'));
      });
      response.on('end', () => resolve({
        url: rawUrl, method: options.method || 'GET', status: response.statusCode, bytes, elapsedMs: Date.now() - started,
        publicDns: addresses, ...connection,
        headers: Object.fromEntries(['content-type', 'location', 'content-security-policy',
          'strict-transport-security', 'access-control-allow-origin', 'access-control-allow-credentials',
          'access-control-allow-methods', 'access-control-allow-headers', 'vary',
          'x-content-type-options', 'referrer-policy', 'cache-control'].filter(k => response.headers[k])
          .map(k => [k, response.headers[k]])),
      }));
      response.on('error', error => req.destroy(error));
    });
    req.on('socket', socket => socket.once('secureConnect', () => {
      const cert = socket.getPeerCertificate();
      connection = { remoteAddress: socket.remoteAddress, tlsAuthorized: socket.authorized,
        tlsProtocol: socket.getProtocol(), certificate: { subject: cert.subject?.CN,
          issuer: cert.issuer?.CN, validFrom: cert.valid_from, validTo: cert.valid_to } };
    }));
    const deadline = setTimeout(() => req.destroy(new Error('Audit timeout after 20 seconds')), 20000);
    req.once('close', () => clearTimeout(deadline));
    req.once('error', error => resolve({ url: rawUrl, publicDns: addresses, ...connection, error: error.message }));
    req.end();
  });
}

const dns = new Map();
const results = [];
// Sequential: keep request volume small on the homelab.
for (const target of targets) {
  const host = new URL(target).hostname;
  try {
    if (!dns.has(host)) dns.set(host, await resolvePublic(host));
    results.push(await probe(target, dns.get(host)));
  } catch (error) { results.push({ url: target, error: error.message }); }
}
const corsPreflight = [];
for (const target of [
  'https://luxonis.tail6ad453.ts.net:8443/taskmesh/public/v1/jobs',
  'https://luxonis.tail6ad453.ts.net:8443/support/api/chat',
  'https://luxonis.tail6ad453.ts.net:8443/api/private/captures',
  'https://luxonis.tail6ad453.ts.net:8443/sentinelhub/api/workspaces',
]) {
  try {
    corsPreflight.push(await probe(target, dns.get(new URL(target).hostname), { method: 'OPTIONS', headers: {
      Origin: 'https://adam-sapiecha.github.io', 'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type',
    } }));
  } catch (error) { corsPreflight.push({ url: target, error: error.message }); }
}
console.log(JSON.stringify({ checkedAt: new Date().toISOString(),
  vantagePoint: 'The machine running this command; independent network must be confirmed by the operator.',
  limitation: 'DNS/TLS/HTTP and cross-origin preflight only. No browser operations, restart, idle or isolation test. Missing cross-origin permission is expected for same-origin apps.',
  results, corsPreflight }, null, 2));
if (results.some(r => r.error || r.status < 200 || r.status >= 400)) process.exitCode = 1;

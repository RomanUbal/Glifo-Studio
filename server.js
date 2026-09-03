// Servidor Node.js nativo para Glifo Studio
// Uso:  node server.js   (o)   npm run serve
// Sin dependencias externas: usa solo modulos nativos de Node 18+.

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const PUBLIC_DIR = path.resolve(__dirname, 'public');
const ENTRY_FILE = 'glifo.html';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.htm':  'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.mjs':  'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.txt':  'text/plain; charset=utf-8',
  '.map':  'application/json; charset=utf-8',
};

// Comprueba que la carpeta public exista al arrancar.
if (!fs.existsSync(PUBLIC_DIR) || !fs.statSync(PUBLIC_DIR).isDirectory()) {
  console.error(`\n[Glifo] No se encontro la carpeta "public" en: ${PUBLIC_DIR}`);
  console.error('Asegurate de ejecutar "node server.js" desde la raiz del proyecto.\n');
  process.exit(1);
}
if (!fs.existsSync(path.join(PUBLIC_DIR, ENTRY_FILE))) {
  console.error(`\n[Glifo] No se encontro "${ENTRY_FILE}" dentro de ${PUBLIC_DIR}.\n`);
  process.exit(1);
}

function resolveSafe(urlPath) {
  // Decodifica y normaliza, evita path traversal.
  let decoded;
  try { decoded = decodeURIComponent(urlPath); }
  catch { decoded = urlPath; }
  const cleaned = decoded.split('?')[0].split('#')[0];
  const joined = path.join(PUBLIC_DIR, cleaned);
  const resolved = path.resolve(joined);
  if (!resolved.startsWith(PUBLIC_DIR)) return null;
  return resolved;
}

function tryFile(filePath) {
  try {
    const stat = fs.statSync(filePath);
    if (stat.isFile()) return { filePath, stat };
    if (stat.isDirectory()) {
      const indexPath = path.join(filePath, 'index.html');
      if (fs.existsSync(indexPath)) {
        const s = fs.statSync(indexPath);
        if (s.isFile()) return { filePath: indexPath, stat: s };
      }
    }
  } catch {}
  return null;
}

function listPublicFiles() {
  try {
    return fs.readdirSync(PUBLIC_DIR)
      .filter((f) => !f.startsWith('.'))
      .sort();
  } catch {
    return [];
  }
}

function send404(res, urlPath) {
  const files = listPublicFiles();
  const links = files.map((f) => `<li><a href="/${f}">/${f}</a></li>`).join('');
  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>404 - Glifo Studio</title>
<style>
  :root { color-scheme: dark; }
  body { font: 14px/1.6 system-ui, -apple-system, Segoe UI, sans-serif; background:#0a0a0a; color:#e5e5e5; margin:0; padding:48px; }
  .wrap { max-width: 560px; margin: 0 auto; }
  h1 { font-size: 22px; margin: 0 0 8px; letter-spacing:-.01em; }
  code { background:#1a1a1a; padding:2px 6px; border-radius:4px; color:#ff9248; }
  a { color:#ff9248; text-decoration:none; }
  a:hover { text-decoration: underline; }
  ul { padding-left: 18px; }
  .card { background:#141414; border:1px solid #262626; border-radius:10px; padding:18px 22px; margin-top:18px; }
  .muted { color:#888; font-size:13px; }
</style></head><body><div class="wrap">
  <h1>Pagina no encontrada</h1>
  <p class="muted">La ruta <code>${urlPath}</code> no existe. Probaste con <a href="/">la pagina principal</a>?</p>
  <div class="card">
    <strong>Archivos disponibles en /public</strong>
    <ul>${links || '<li class="muted">(vacia)</li>'}</ul>
  </div>
</div></body></html>`;
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

const server = http.createServer((req, res) => {
  // Usa la WHATWG URL API (no la deprecada url.parse).
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let urlPath = reqUrl.pathname || '/';

  // Raiz -> archivo de entrada.
  if (urlPath === '/' || urlPath === '') urlPath = '/' + ENTRY_FILE;

  let filePath = resolveSafe(urlPath);
  if (!filePath) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  // Resuelve: tal cual -> con .html -> con /index.html
  let hit = tryFile(filePath);
  if (!hit) {
    const withHtml = resolveSafe(urlPath + '.html');
    if (withHtml) hit = tryFile(withHtml);
  }
  if (!hit) {
    send404(res, urlPath);
    return;
  }

  const ext = path.extname(hit.filePath).toLowerCase();
  const mime = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': mime,
    'Content-Length': hit.stat.size,
    'Cache-Control': 'public, max-age=0, must-revalidate',
    'X-Powered-By': 'Glifo Studio',
  });

  const stream = fs.createReadStream(hit.filePath);
  stream.on('error', (err) => {
    console.error('[Glifo] Error leyendo archivo:', err.message);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    }
    res.end();
  });
  stream.pipe(res);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[Glifo] El puerto ${PORT} ya esta en uso.`);
    console.error(`Probra con otro puerto:  PORT=4000 node server.js\n`);
  } else {
    console.error('[Glifo] Error del servidor:', err.message);
  }
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  const orange = (s) => `\x1b[38;5;208m${s}\x1b[0m`;
  const bold = (s) => `\x1b[1m${s}\x1b[0m`;
  const dim = (s) => `\x1b[2m${s}\x1b[0m`;

  console.log('');
  console.log('  ' + orange('+----------------------------------------------+'));
  console.log('  ' + orange('|') + '   ' + bold('Glifo Studio') + '  -  Editor visual de diseno   ' + orange('|'));
  console.log('  ' + orange('+----------------------------------------------+'));
  console.log('');
  console.log(`  Servidor activo:  ${bold('http://localhost:' + PORT)}`);
  console.log(`  Carpeta servida:  ${dim(PUBLIC_DIR)}`);
  console.log(`  Entrada:          ${dim('/' + ENTRY_FILE)}`);
  console.log('');
  console.log(`  ${dim('Pulsa Ctrl+C para detener.')}`);
  console.log('');
});

function shutdown(signal) {
  console.log(`\n[Glifo] Senal ${signal} recibida. Cerrando...`);
  server.close(() => process.exit(0));
  // Cierre forzoso si tarda demasiado.
  setTimeout(() => process.exit(0), 2000).unref();
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

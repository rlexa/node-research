import { createServer, get as get_http } from 'http';
import { get as get_https } from 'https';
import * as HttpsProxyAgent from 'https-proxy-agent';
import { parse } from 'url';
import { toContentTypeView } from './content-type-view';
import { closeServerPromise } from './server.util';
import { registerShutdown } from './shutdown-logic';

const ROUTE_MAP = <{ [key: string]: string }>{
  bso: 'http://twix16-237v.linux.rz.db.de:65525',
  webbtc: 'https://webbtc.com',
}

function nodeGet(url: string) {
  return new Promise((ack, nak) => {
    const isHttps = url.startsWith('https://');
    const proxy = !isHttps ? null : process.env.HTTPS_PROXY || process.env.HTTP_PROXY || null;
    const agent = !proxy ? null : new HttpsProxyAgent.default({ ...parse(proxy), secureProxy: true });
    (url.startsWith('https://') ? get_https : get_http)
      ({ ...parse(url), agent }, response => {
        let stream = '';
        response.on('data', _ => stream += _);
        response.on('end', () => ack(stream));
      }).on('error', nak);
  });
}

async function forwardGet(fromUrl: string, fromApi: string, toApi: string) {
  let ret: any = null;
  const url = toApi + fromUrl.substr(fromUrl.indexOf(fromApi) + fromApi.length);
  try {
    ret = await nodeGet(url);
  } catch (ex) {
    ret = { ex: ex.toString(), url };
  }
  return ret;
}

const server = createServer((req, resp) => {
  const contentType = req.headers['content-type'] || 'text/html';
  const query = parse(req.url, true);
  const pick = query.path.split('/')[1];

  resp.setHeader('access-control-allow-origin', '*');
  resp.setHeader('content-type', contentType);
  resp.statusCode = 200;

  if (req.method === 'GET' && pick in ROUTE_MAP) {
    forwardGet(req.url, pick, ROUTE_MAP[pick]).then(val => {
      resp.write(toContentTypeView('application/json', val));
      resp.end();
    });
  } else {
    resp.write(toContentTypeView(contentType, { routes: ROUTE_MAP }));
    resp.end();
  }
});

const HOST = process.env.HOST || null;
const PORT = +process.env.PORT || 8080;
console.log(`forward server starting on ${(HOST || 'localhost') + ':' + PORT}`);
server.listen(PORT, HOST);

registerShutdown(() => closeServerPromise(server));

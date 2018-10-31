import { createServer } from 'http';
import { parse } from 'url';
import { toContentTypeView } from './content-type-view';
import { closeServerPromise } from './server.util';
import { registerShutdown } from './shutdown-logic';

const ARGV = process.argv
  .filter(_ => _.startsWith('-par:'))
  .map(_ => _.substr('-par:'.length))
  .filter(_ => _.length);

const GREETING = (ARGV.find(_ => _.startsWith('greeting=')) || 'greeting=Hi').split('=')[1];

const QUERY_USER = 'user';
const QUERY_CONTENT_TYPE = 'contentType';

const server = createServer((req, resp) => {
  const params = parse(req.url, true).query;
  const contentType = params[QUERY_CONTENT_TYPE] + '' || req.headers['content-type'] || 'text/plain';

  resp.setHeader('access-control-allow-origin', '*');
  resp.setHeader('content-type', contentType);
  resp.statusCode = 200;
  resp.write(
    toContentTypeView(contentType, {
      _argv: ARGV,
      _contentType: contentType,
      _greetingPrefix: GREETING,
      _urlQueryParamsCurrent: params,
      _urlQueryParamsPossible: [QUERY_CONTENT_TYPE, QUERY_USER],
      greeting: GREETING + ' ' + params[QUERY_USER],
    }));
  resp.end();
});

const HOST = process.env.HOST || null;
const PORT = +process.env.PORT || 8080;
console.log(`greeting server starting on ${(HOST || 'localhost') + ':' + PORT}`);
server.listen(PORT, HOST);

registerShutdown(() => closeServerPromise(server));

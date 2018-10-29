import { createServer } from 'http';
import { parse } from 'url';

const ARGV = process.argv
    .filter(_ => _.startsWith('-par:'))
    .map(_ => _.substr('-par:'.length))
    .filter(_ => _.length);

const GREETING = (ARGV.find(_ => _.startsWith('greeting=')) || 'greeting=Hi').split('=')[1];
const PORT = +(ARGV.find(_ => _.startsWith('port=')) || 'port=8080').split('=')[1];

const QUERY_USER = 'user';

const server = createServer((req, resp) => {
    const query = parse(req.url || '');
    const params = (query.query || '').split('&');
    const paramUserValue = (params.find(_ => _.startsWith(QUERY_USER + '=')) || QUERY_USER + '=').split('=')[1];

    resp.setHeader('content-type', 'application/json');
    resp.statusCode = 200;
    resp.write(JSON.stringify({
        _argv: ARGV,
        _greetingPrefix: GREETING,
        _urlQueryParamsCurrent: params,
        _urlQueryParamsPossible: [QUERY_USER],
        greeting: GREETING + ' ' + paramUserValue,
    }, null, 2));
    resp.end();
});

console.log(`greeting server starting on ${PORT}`);
server.listen(PORT)

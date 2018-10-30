import { Server as ServerHttp } from 'http';
import { Server as ServerHttps } from 'https';

export function closeServerPromise(httpServer: ServerHttp | ServerHttps) {
  return new Promise((resolve, reject) => httpServer.close((err: any) => !err ? resolve() : reject(err)));
}

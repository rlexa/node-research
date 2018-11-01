import { isWeb } from './util';

function arrayToHtmlElement(data: any[]) {
  return data.length > 0 ? `<ol start="0">${data.map(val => `<li>${toHtmlElement(val)}</li>`).join('')}</ol>` : '-';
}

function entriesToHtmlElement(data: any[]) {
  return data.length > 0 ? `<ul>${data.map(([key, val]) => `<li>${key}: ${toHtmlElement(val)}</li>`).join('')}</ul>` : '-';
}

function nonObjectToHtmlElement(data: any) {
  return isWeb(data) ? `<a href="${data.toString()}">${data.toString()}</a>` : `<label>${data.toString()}</label>`;
}

function toHtmlElement(data: any): string {
  return data === undefined ? '<span style="color: red;">undefined</span>' :
    data === null ? '<span style="color: red;">null</span>' :
      typeof data !== 'object' ? nonObjectToHtmlElement(data) :
        Array.isArray(data) ? arrayToHtmlElement(data) :
          data instanceof Date ? data.toISOString() :
            entriesToHtmlElement(Object.entries(data));
}

function toHtmlView(data: any) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8">
  </head>
  <body style="font-family:Roboto,\"Helvetica Neue\",sans-serif;">
    ${toHtmlElement(data)}
  </body>
  </html>`
}

function toJsonView(data: any) {
  return typeof data === 'string' ? data : JSON.stringify(data, null, 2);
}

function toTextView(data: any) {
  return data === undefined || data === null ? '' : data.toString();
}

export function toContentTypeView(contentType: string, data: any) {
  let ret = <string>null;
  switch (contentType) {
    case 'application/json': ret = toJsonView(data); break;
    case 'text/html': ret = toHtmlView(data); break;
    default: ret = toTextView(data); break;
  }
  return ret;
}

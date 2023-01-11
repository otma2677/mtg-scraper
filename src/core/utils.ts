import * as buffer from 'buffer';
import { IncomingMessage } from 'http';

/**
 *
 */
const { join } = require('node:path');
const { get } = require('node:https');

/**
 * Path
 */
export const basePath = () => join(process.cwd());

/**
 * Fast fetch for non 18+ node
 */
export const superFetch = async (url: string): Promise<string> => {
  const currentNodeVersion = Number(process.version.split('.')[0].split('v')[1]);

  if (currentNodeVersion <= 17) {
    return new Promise((resolve, reject) => {
      get(url, (res: IncomingMessage) => {
        if (res.statusCode === undefined) reject('Request did not achieved correctly.');
        if (res.statusCode === 404) reject('Page not found');

        let body = '';
        res.on('data', (data: BinaryData) => body += data.toString());

        res.on('end', () => resolve(body));
      });
    });
  }

  const result = await fetch(url);
  return await result.text();
};

/**
 *
 */

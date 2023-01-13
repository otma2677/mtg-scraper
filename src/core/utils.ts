/**
 * IMPORTS
 */
import { IncomingMessage } from 'node:http';
import { get } from 'node:https';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/**
 * CRYPTO
 */
export const generateUniqueID = (strToHash: string) => {
  const H = createHash('md5');
  const res = H.update(strToHash);
  return res.digest('hex');
};

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

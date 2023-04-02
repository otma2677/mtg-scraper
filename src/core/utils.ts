/**
 * IMPORTS
 */
import { IncomingMessage } from 'node:http';
import { get } from 'node:https';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

/**
 *
 */
export const getDateFromLink = (tournamentLink: string): { month: string, year: string, day: string } => {
  const arrOfSegment = tournamentLink.split('/').at(-1);
  const lastSegmentSplit = arrOfSegment?.split('-');
  const isLeague = lastSegmentSplit?.at(1);

  if (isLeague === 'league') {
    return {
      month: lastSegmentSplit?.at(3) as string,
      year: lastSegmentSplit?.at(2) as string,
      day: lastSegmentSplit?.at(4) as string,
    };
  } else {
    const rawDay = lastSegmentSplit?.at(-1);
    return {
      month: lastSegmentSplit?.at(-2) as string,
      year: lastSegmentSplit?.at(-3) as string,
      day: rawDay?.slice(0, 2) as string
    };
  }
};

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

/**
 * CHECKERS
 */
export const checkURLFormat = (url: string): string => {
  const possibleTypes = [
    'vintage',
    'legacy',
    'modern',
    'pioneer',
    'standard',
    'pauper'
  ] as const;

  const currentType = url.split('/').at(-1)?.split('-')[0];
  const isTypeCorrect = possibleTypes.find(t => t === currentType);

  if (isTypeCorrect) return currentType as string;

  return 'unknown';
};

export const checkURLLevelOfPlay = (url: string): string => {
  const possibleTypes = [
    'league',
    'preliminary',
    'challenge',
    'premier',
    'showcase-challenge',
    'showcase-qualifier',
    'eternal-weekend',
    'super-qualifier',
  ] as const;

  const currentType = url.split('/').at(-1)?.split('-')[1];
  const isTypeExisting = possibleTypes.find(t => t === currentType);

  if (isTypeExisting) return currentType as string;

  if (currentType === 'showcase' || currentType === 'eternal' || currentType === 'super') {
    const secondWord = url.split('/').at(-1)?.split('-')[2];

    return `${currentType}-${secondWord}`;
  }

  return 'unknown';
};

export const checkURLPlatform = (url: string): string => {
  const newURL = new URL(url);

  if (newURL.host === 'mtgo.com')
    return 'mtgo';
  else if (newURL.host === 'www.mtgo.com')
    return 'www.mtgo';
  else
    return 'unknown';
};

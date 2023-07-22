/**
 * IMPORTS
 */
import { IncomingMessage } from 'node:http';
import { get } from 'node:https';
import { request } from 'undici';

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
 * Fast fetch for non 18+ node
 */
export const superFetch = async (url: string): Promise<string> => {
  // const currentNodeVersion = Number(process.version.split('.')[0].split('v')[1]);
  //
  // if (currentNodeVersion <= 17) {
  //   return new Promise((resolve, reject) => {
  //     get(url, (res: IncomingMessage) => {
  //       if (res.statusCode === undefined) reject('Request did not achieved correctly.');
  //       if (res.statusCode === 404) reject('Page not found');
  //
  //       let body = '';
  //       res.on('data', (data: BinaryData) => body += data.toString());
  //
  //       res.on('end', () => resolve(body));
  //     });
  //   });
  // }
  //
  // if (currentNodeVersion >= 18) {
  // }
  //
  // const result = await fetch(url);
  // return await result.text();

  const result = await request(url);

  if (result.statusCode <= 299)
    return result.body.text();

  throw new Error(`Cannot reach website at ${url} with status code ${result.statusCode}.\n${JSON.stringify(result)}`);
};

/**
 * CHECKERS
 */
export type formatType =
  'vintage' |
  'legacy' |
  'modern' |
  'pioneer' |
  'standard' |
  'pauper' |
  'limited';

export const checkFormat = (str: any): str is formatType => {
  return (
    str === 'vintage' ||
    str === 'legacy' ||
    str === 'modern' ||
    str === 'pioneer' ||
    str === 'standard' ||
    str === 'pauper' ||
    str === 'limited'
  );
};

export const checkURLFormat = (url: string): string => {
  const possibleTypes = [
    'vintage',
    'legacy',
    'modern',
    'pioneer',
    'standard',
    'pauper',
    'limited'
  ] as const;

  const currentType = url.split('/').at(-1)?.split('-')[0];
  const isTypeCorrect = possibleTypes.find(t => t === currentType);

  if (isTypeCorrect) return currentType as string;

  return 'unknown';
};

export type levelOfPlayType =
  'league' |
  'preliminary' |
  'challenge' |
  'premier' |
  'showcase-challenge' |
  'showcase-qualifier' |
  'showcase-open' |
  'eternal-weekend' |
  'super-qualifier' |
  'last-chance';

export const checkLevelOfPlay = (str: any): str is levelOfPlayType => {
  return (
    str === 'league' ||
    str === 'preliminary' ||
    str === 'challenge' ||
    str === 'premier' ||
    str === 'showcase-challenge' ||
    str === 'showcase-qualifier' ||
    str === 'showcase-open' ||
    str === 'eternal-weekend' ||
    str === 'super-qualifier' ||
    str === 'last-chance'
  );
};

export const checkURLLevelOfPlay = (url: string): string => {
  const possibleTypes = [
    'league',
    'preliminary',
    'challenge',
    'premier',
    'showcase-challenge',
    'showcase-qualifier',
    'showcase-open',
    'eternal-weekend',
    'super-qualifier',
    'last-chance'
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

export type platformType = 'mtgo';

export const checkPlatform = (str: any): str is platformType => {
  return (
    str === 'mtgo'
  );
};
export const checkURLPlatform = (url: string): string => {
  const newURL = new URL(url);

  if (newURL.host === 'mtgo.com' || newURL.host === 'www.mtgo.com')
    return 'mtgo';
  else
    return 'unknown';
};

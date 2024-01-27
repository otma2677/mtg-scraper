/**
 * IMPORTS
 */
import { request } from 'undici';

/**
 *
 */
export const getIDFromLink = (link: string) => {
  const chunks = link.split('-');
  const lastChunk = chunks.at(-1);

  if (!lastChunk)
    throw new Error(`Cannot generate ID from url ${ link }`);

  return lastChunk.slice(2, lastChunk.length);
};

export const getDateFromLink = (link: string): { timeInMS: number, month: string, year: string, day: string } => {
  const chunks = link.split('/');

  const segment = chunks.at(-1);
  const endSegmentChunks = segment?.split('-');
  const rawDay = endSegmentChunks?.at(-1);

  const y = endSegmentChunks?.at(-3);
  const m = endSegmentChunks?.at(-2);
  const d = rawDay?.slice(0, 2);
  const t = new Date(`${ y }-${ m }-${ d }`);
  const ms = t.getTime();

  if (!y || !m || !d || Number.isNaN(ms))
    throw new Error(`year, month or day cannot be generated based on "${ link }"`);

  return {
    timeInMS: ms,
    year: y,
    month: m,
    day: d
  };

  // if (isLeague === 'league') {
  //   const obj = {
  //     timeInMS: 0,
  //     month: lastSegmentSplit?.at(3) as string,
  //     year: lastSegmentSplit?.at(2) as string,
  //     day: lastSegmentSplit?.at(4) as string,
  //   };
  //
  //   obj.timeInMS = new Date(`${obj.year}-${obj.month}-${obj.day}`).getTime();
  //   return obj;
  // } else {
  //   const rawDay = lastSegmentSplit?.at(-1);
  //   const obj = {
  //     timeInMS: 0,
  //     month: lastSegmentSplit?.at(-2) as string,
  //     year: lastSegmentSplit?.at(-3) as string,
  //     day: rawDay?.slice(0, 2) as string
  //   };
  //
  //   obj.timeInMS = new Date(`${obj.year}-${obj.month}-${obj.day}`).getTime();
  //   return obj;
  // }
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

export const checkURLFormat = (url: string): formatType => {
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

  if (isTypeCorrect) return currentType as formatType;

  throw new Error(`Format does not exists in url ${ url }`);
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

export const checkURLLevelOfPlay = (url: string): levelOfPlayType => {
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

  if (isTypeExisting) return currentType as levelOfPlayType;

  if (currentType === 'showcase' || currentType === 'eternal' || currentType === 'super') {
    const secondWord = url.split('/').at(-1)?.split('-')[2];

    return `${currentType}-${secondWord}` as levelOfPlayType;
  }

  throw new Error(`Level does not exists in URL ${ url }`);
};

export type platformType = 'mtgo';

export const checkPlatform = (str: any): str is platformType => {
  return (
    str === 'mtgo'
  );
};
export const checkURLPlatform = (url: string): platformType => {
  const newURL = new URL(url);

  if (newURL.host === 'mtgo.com' || newURL.host === 'www.mtgo.com')
    return 'mtgo';

  throw new Error(`Platform does not exists in url ${ url }`);
};

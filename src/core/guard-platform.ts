/**
 * EXPORTS
 */
export const guardPlatform = (url: string): string => {
  const possibleTypes = [
    'mtgo'
  ] as const;

  const newURL = new URL(url);

  if (newURL.host === 'mtgo.com')
    return 'mtgo';
  else if (newURL.host === 'magic.gg')
    return 'mtgg';
  else
    return 'unknown';
};

/**
 * EXPORTS
 */
export const guardFormat = (url: string) => {
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

  if (isTypeCorrect) return currentType;

  return 'unknown';
};

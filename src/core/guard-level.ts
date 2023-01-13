/**
 * EXPORTS
 */
export const guardLevelOfPlay = (url: string) => {
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

  if (isTypeExisting) return currentType;

  if (currentType === 'showcase' || currentType === 'eternal' || currentType === 'super') {
    const secondWord = url.split('/').at(-1)?.split('-')[2];

    return `${currentType}-${secondWord}`;
  }

  return 'unknown';
};

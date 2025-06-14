import { Output } from './types';

export const sortOutputs = (outputs: Output[]) => {
  return [...outputs].sort((a, b) => {
    const aCode = a.code || '';
    const bCode = b.code || '';

    const [aLetter, aNum] = aCode.split('.');
    const [bLetter, bNum] = bCode.split('.');

    if (aLetter !== bLetter) {
      return aLetter.localeCompare(bLetter);
    }

    return Number(aNum) - Number(bNum);
  });
};

import { Output } from '@/utils/types';

export const isUnplannedOutput = (output: Output) => {
  return output.code?.startsWith('U') || !output.outcome_measurable_id;
};

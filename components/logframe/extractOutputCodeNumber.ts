/**
 * Extracts the numeric part after the decimal point from an output/outcome code
 * @param code Format example: "1.2" or "2.10"
 * @returns The numeric value after the decimal
 */
export function extractOutputCodeNumber(code: string): number {
  return parseInt(code.split('.')[1]);
}

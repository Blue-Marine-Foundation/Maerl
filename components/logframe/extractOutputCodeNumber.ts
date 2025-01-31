/**
 * Extracts the numeric part after the decimal point from an Output code
 * @param code Format example: "0.1" or "0.2"
 * @returns The numeric value after the decimal
 */
export function extractOutputCodeNumber(code: string): number {
  return parseInt(code.split('.')[1]);
}

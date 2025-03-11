/**
 * Extracts the numeric part after the decimal point from an Output code
 * @param code Format example: "A01" or "A02"
 * @returns The numeric value after the A
 */
export function extractOutputActivityCodeNumber(code: string): number {
  return parseInt(code.split('A')[1]);
}

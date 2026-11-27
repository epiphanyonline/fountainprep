export const MAX_REVIEW_BYTES = 1_500_000;
export const MAX_SYNTHESIS_BYTES = 5_000_000;

export function detectAudioType(bytes: Uint8Array): "audio/wav" | "audio/mpeg" | null {
  if (bytes.length >= 44 &&
      bytes[0] === 82 && bytes[1] === 73 && bytes[2] === 70 && bytes[3] === 70 &&
      bytes[8] === 87 && bytes[9] === 65 && bytes[10] === 86 && bytes[11] === 69) return "audio/wav";
  if (bytes.length >= 128 && ((bytes[0] === 73 && bytes[1] === 68 && bytes[2] === 51) ||
      (bytes[0] === 255 && (bytes[1] & 224) === 224))) return "audio/mpeg";
  return null;
}

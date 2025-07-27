export const sanitizeInputForURL = (term: string, maxChars: number): string => {
  return encodeURIComponent(term.trim().slice(0, maxChars));
};

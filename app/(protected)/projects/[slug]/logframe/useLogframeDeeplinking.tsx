import { useEffect } from 'react';

// Helper functions
const isValidHash = (hash: string) => {
  const validHashPattern = /^#(output|outcome)-\d+$/;
  return hash && validHashPattern.test(hash);
};

const extractHashParts = (hash: string) => {
  const [, type, id] = hash.match(/^#(output|outcome)-(\d+)$/) || [];
  return type && id ? { type, id } : null;
};

const scrollToElement = (selector: string) => {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    return true;
  }
  return false;
};

export const useLogframeDeeplinking = () => {
  useEffect(() => {
    const handleDeepLink = (attempts = 0) => {
      const hash = window.location.hash;

      if (!isValidHash(hash)) return;

      const parts = extractHashParts(hash);
      if (!parts) return;

      const safeSelector = `#${parts.type}-${parts.id}`;
      const scrollSuccessful = scrollToElement(safeSelector);

      // Retry with a maximum of 3 attempts
      if (!scrollSuccessful && attempts < 3) {
        setTimeout(() => handleDeepLink(attempts + 1), 200 * (attempts + 1));
      }
    };

    setTimeout(() => handleDeepLink(), 100);
  }, []);
};

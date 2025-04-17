import isMobile from "is-mobile";

export const intro = isMobile()
  ? { index: 0, from: 0.0, to: 0.2 }
  : { index: 0, from: 0.0, to: 0.1 };
export const cvThreshold = isMobile()
  ? { index: 1, from: intro.to, to: intro.to + 0.1 }
  : { index: 1, from: intro.to, to: 0.3 };
export const projectsTreshold = { index: 2, from: cvThreshold.to, to: 0.99 }; // Projects gets 60%
export const moreTreshold = { index: 3, from: projectsTreshold.to, to: 1.0 };

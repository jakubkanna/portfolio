export const introThreshold = { index: 0, from: 0.0, to: 0.1 };
export const cvThreshold = { index: 1, from: introThreshold.to, to: 0.2 };
export const projectsTreshold = { index: 2, from: cvThreshold.to, to: 0.9 };
export const moreTreshold = { index: 3, from: projectsTreshold.to, to: 1.0 };

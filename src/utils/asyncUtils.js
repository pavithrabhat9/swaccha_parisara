/** Resolves after `ms` milliseconds. Used by the mock services to simulate network latency. */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


/** Read env at runtime so Vercel bundlers do not inline missing build-time values. */
export function env(name) {
  return process.env[name];
}

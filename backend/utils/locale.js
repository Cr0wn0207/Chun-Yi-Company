const SUPPORTED = new Set(['ko', 'en', 'ja', 'zh', 'de', 'es', 'fr', 'pt', 'vi', 'th']);

export function getLocaleFromRequest(req) {
  const raw = req.headers['accept-language'] || 'ko';
  const code = raw.split(',')[0].split('-')[0].toLowerCase();
  return SUPPORTED.has(code) ? code : 'ko';
}

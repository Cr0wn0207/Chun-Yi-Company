export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://chun-yi-team.vercel.app';

export const OG_IMAGE_PATH = '/og-image.png?v=5';

export function getOgImageUrl(origin = SITE_URL) {
  const base = origin.replace(/\/$/, '');
  return `${base}${OG_IMAGE_PATH}`;
}

export const HOME_OG = {
  title: 'IT Solutions Built for Real Business Growth | Chun Yi Team',
  description:
    'Chun Yi Team (CYTeam) delivers digital transformation, AI, cloud, system development, IT consulting, and customer experience—from our home in Shiki, Saitama, Japan. We pair hands-on engineering with long-term partnership to help teams grow. Explore our services and contact us today.',
};

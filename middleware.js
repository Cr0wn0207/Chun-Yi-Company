const CRAWLER_UA =
  /Slackbot|Slack-ImgProxy|Slackbot-LinkExpanding|facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Discordbot|WhatsApp|TelegramBot/i;

const UNFURL_VERSION = '5';

export default function middleware(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';

  if (!CRAWLER_UA.test(userAgent)) {
    return;
  }

  if (url.pathname !== '/' || url.searchParams.has('v')) {
    return;
  }

  url.searchParams.set('v', UNFURL_VERSION);
  return Response.redirect(url.toString(), 302);
}

export const config = {
  matcher: '/',
};

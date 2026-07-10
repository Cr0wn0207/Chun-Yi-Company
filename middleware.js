const CRAWLER_UA =
  /Slackbot|Slack-ImgProxy|Slackbot-LinkExpanding|facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Discordbot|WhatsApp|TelegramBot/i;

export default function middleware(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';

  if (!CRAWLER_UA.test(userAgent)) {
    return;
  }

  if (url.pathname !== '/' || url.search) {
    return;
  }

  url.pathname = '/og-unfurl.html';
  return Response.redirect(url.toString(), 302);
}

export const config = {
  matcher: '/',
};

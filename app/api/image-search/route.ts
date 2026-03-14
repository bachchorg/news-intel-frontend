import { NextRequest, NextResponse } from 'next/server';

const BRAVE_API_KEY = process.env.BRAVE_API_KEY;

// Domains to exclude from results
const EXCLUDED_DOMAINS = [
  'gettyimages.com',
  'gettyimages.co.uk',
  'gettyimages.ca',
  'gettyimages.com.au',
  'afp.com',
  'afpforum.com',
  'apimages.com',
  'apnews.com',
  'ap.org',
];

interface BraveImageResult {
  title: string;
  url: string;
  source: string;
  page_fetched: string;
  thumbnail: {
    src: string;
    height: number;
    width: number;
  };
  properties: {
    url: string;
    height: number;
    width: number;
    format: string;
  };
}

interface BraveImageResponse {
  query: { original: string };
  results?: BraveImageResult[];
}

export async function GET(request: NextRequest) {
  if (!BRAVE_API_KEY) {
    return NextResponse.json(
      { error: 'Brave API key not configured. Set BRAVE_API_KEY in .env.local' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  const url = new URL('https://api.search.brave.com/res/v1/images/search');
  url.searchParams.set('q', query);
  url.searchParams.set('count', '100');
  url.searchParams.set('safesearch', 'off');

  try {
    const res = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': BRAVE_API_KEY,
      },
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error('Brave API error:', errBody);
      return NextResponse.json({ error: 'Brave API request failed', details: errBody }, { status: res.status });
    }

    const data: BraveImageResponse = await res.json();

    // Filter out results from excluded domains
    const filtered = (data.results ?? []).filter((item) => {
      const source = item.source.toLowerCase();
      const imageUrl = item.properties?.url?.toLowerCase() ?? '';
      return !EXCLUDED_DOMAINS.some((ex) => source.includes(ex) || imageUrl.includes(ex));
    });

    return NextResponse.json({
      totalResults: String(filtered.length),
      items: filtered.map((item) => ({
        title: item.title,
        link: item.properties?.url ?? item.url,
        displayLink: item.source,
        snippet: '',
        contextLink: item.page_fetched,
        thumbnailLink: item.thumbnail?.src,
        width: item.properties?.width,
        height: item.properties?.height,
        thumbnailWidth: item.thumbnail?.width,
        thumbnailHeight: item.thumbnail?.height,
      })),
    });
  } catch (err) {
    console.error('Image search error:', err);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

interface TikTokVideo {
  aweme_info: {
    desc: string;
    aweme_id: string;
    author: {
      nickname: string;
      unique_id: string;
    };
    statistics: {
      play_count: number;
      digg_count: number;
      comment_count: number;
      share_count: number;
    };
    video: {
      play_addr: {
        url_list: string[];
      };
      cover: {
        url_list: string[];
      };
      duration: number;
    };
  };
}

interface SearchResponse {
  cursor: number;
  search_item_list: TikTokVideo[];
}

export function getTikTokUrl(awemeId: string): string {
  return `https://www.tiktok.com/@/video/${awemeId}`;
}

export async function searchTikTokVideos(query: string, apiKey: string, cursor?: number, datePosted?: string): Promise<SearchResponse> {
  const baseUrl = 'https://api.scrapecreators.com/v1/tiktok/search/keyword';
  const params = new URLSearchParams({
    query,
    ...(cursor && { cursor: cursor.toString() }),
    ...(datePosted && { date_posted: datePosted }),
  });

  const fullUrl = `${baseUrl}?${params}`;
  console.log('Making request to:', fullUrl);

  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: SearchResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching TikTok videos:', error);
    throw error;
  }
} 
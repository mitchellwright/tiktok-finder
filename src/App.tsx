import { useState } from 'react';
import { Search, TrendingUp, Loader2, ExternalLink } from 'lucide-react';
import { generateKeywords } from './lib/gemini';
import { searchTikTokVideos, getTikTokUrl } from './lib/scrapeCreators';
import { useToast } from './hooks/use-toast';
import { formatCount } from './lib/utils';
import './App.css';

// Mock data for TikTok videos
const mockTikTokVideos = [
  {
    id: 1,
    title: "This Website Will Change Your Life!",
    views: 2300000,
    creator: "@techinfluencer",
    thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&auto=format&fit=crop&q=60",
    likes: 156000,
    duration: "0:58"
  },
  {
    id: 2,
    title: "Hidden Features You Didn't Know About",
    views: 1800000,
    creator: "@webexplorer",
    thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&auto=format&fit=crop&q=60",
    likes: 92000,
    duration: "1:24"
  },
  {
    id: 3,
    title: "Mind-Blowing Website Secrets Revealed",
    views: 950000,
    creator: "@digitaltrends",
    thumbnail: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&auto=format&fit=crop&q=60",
    likes: 78000,
    duration: "2:15"
  },
];

function App() {
  const [url, setUrl] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const generatedKeywords = await generateKeywords(url);
      setKeywords(generatedKeywords);
      
      if (generatedKeywords.length > 0) {
        const apiKey = import.meta.env.VITE_SCRAPECREATORS_API_KEY || '';
        const searchResults = await searchTikTokVideos(generatedKeywords[0], apiKey);
        setVideos(searchResults.search_item_list);
      }
      
      setShowResults(true);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch TikTok videos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-6xl font-black mb-4 text-black transform -rotate-2">
            TikTok Video Explorer
          </h1>
          <p className="text-xl text-gray-700 transform rotate-1">
            Find viral TikToks about any website
          </p>
        </div>

        <form 
          onSubmit={handleSubmit}
          className="bg-black p-8 rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] 
            border-4 border-black mb-12 transform hover:translate-x-1 hover:translate-y-1 
            transition-transform"
        >
          <div className="flex gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL..."
              className="flex-1 px-6 py-4 text-lg bg-white border-4 border-black 
                rounded focus:outline-none focus:ring-4 focus:ring-yellow-400 
                placeholder:text-gray-500"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-4 bg-yellow-400 text-black font-bold text-lg 
                border-4 border-black rounded hover:bg-yellow-300 
                active:translate-x-1 active:translate-y-1 transition-transform
                flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <Search size={24} />
              )}
              Search
            </button>
          </div>
        </form>

        {showResults && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="text-red-500" size={32} />
              <h2 className="text-3xl font-bold text-black">
                Viral TikToks
              </h2>
            </div>

            {keywords.length > 0 && (
              <div className="mb-8 bg-white p-6 rounded-lg border-4 border-black 
                shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]">
                <h3 className="text-xl font-bold mb-3">Generated Keywords:</h3>
                <div className="flex gap-3">
                  {keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full 
                        font-semibold border-2 border-purple-800"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-6">
              {videos.map((video) => (
                <div
                  key={video.aweme_info.aweme_id}
                  className="bg-white p-6 rounded-lg border-4 border-black 
                    shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] 
                    transform hover:translate-x-1 hover:translate-y-1 
                    transition-transform"
                >
                  <div className="flex gap-6">
                    <div className="relative w-64 h-48 flex-shrink-0">
                      <a
                        href={getTikTokUrl(video.aweme_info.aweme_id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full"
                      >
                        <img
                          src={video.aweme_info.video.cover.url_list[0]}
                          alt={video.aweme_info.desc}
                          className="w-full h-full object-cover rounded border-2 border-black hover:opacity-90 transition-opacity"
                        />
                        <span className="absolute bottom-2 right-2 bg-black text-white 
                          px-2 py-1 text-sm rounded">
                          {Math.floor(video.aweme_info.video.duration / 1000)}s
                        </span>
                      </a>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{video.aweme_info.desc}</h3>
                      <p className="text-gray-600 mb-4">{video.aweme_info.author.unique_id}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full 
                          font-semibold">
                          {formatCount(video.aweme_info.statistics.play_count)} views
                        </span>
                        <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full 
                          font-semibold">
                          {formatCount(video.aweme_info.statistics.digg_count)} likes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
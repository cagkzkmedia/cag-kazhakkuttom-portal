// services/youtubeService.js
export const getYouTubeVideos = async (channelId, apiKey) => {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=6`;
  
  const response = await fetch(url);
  const data = await response.json();
  return data.items.map(item => ({
    id: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.medium.url,
    publishedAt: item.snippet.publishedAt
  }));
};

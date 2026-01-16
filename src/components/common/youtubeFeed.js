// components/YouTubeFeed.js
import React, { useEffect, useState } from 'react';
import './YouTubeFeed.css';
import { getYouTubeVideos } from '../../services/youtubeService';

const YouTubeFeed = ({ channelId, apiKey }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await getYouTubeVideos(channelId, apiKey);
        setVideos(data);
      } catch (error) {
        console.error('Error fetching YouTube videos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadVideos();
  }, [channelId, apiKey]);

  if (loading) return <p>Loading YouTube feed...</p>;

  return (
    <div className="youtube-feed">
      <h2>🎥 Latest Videos</h2>
      <div className="video-grid">
        {videos.map(video => (
          <div key={video.id} className="video-card">
            <a 
              href={`https://www.youtube.com/watch?v=${video.id}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <img src={video.thumbnail} alt={video.title} />
              <h4>{video.title}</h4>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubeFeed;

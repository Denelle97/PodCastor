import React, { useEffect, useState } from 'react';
import './Styles/AudioPlayer.css'; 

const AudioPlayer = ({ currentEpisode }) => {
  // State for audio controls
  const [audioSrc, setAudioSrc] = useState('');

  // Update audio source when current episode changes
  useEffect(() => {
    if (currentEpisode && currentEpisode.file) {
      setAudioSrc(currentEpisode.file);
    }
  }, [currentEpisode]);

  if (!currentEpisode || !audioSrc) {
    return <p>No audio available for this episode.</p>;
  }

  return (
    <div className="audio-player-container">
      <div className="audio-info">
        <p className="episode-title">{currentEpisode.title}</p>
        <p className="episode-description">{currentEpisode.description}</p>
      </div>

      {/* Audio player controls */}
      <audio controls>
        <source src={audioSrc} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
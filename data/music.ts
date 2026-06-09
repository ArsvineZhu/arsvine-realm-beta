import type { MusicTrack } from '../types';

// ============================================================
// Music Playlist — Replace with your own songs!
// Place audio files in public/music/ (mp3/m4a/flac/wav/ogg, all
// supported via the browser's native HTML5 <audio>), or use
// external URLs. Audio files are gitignored by default.
// ============================================================
export const musicPlaylist: MusicTrack[] = [

  {
    title: "JANE DOE",
    artist: '米津玄師, 宇多田ヒカル',
    src: "/music/JANE DOE.m4a",
  },
  {
    title: "Don't Be So Serious",
    artist: 'Low Roar',
    src: "/music/Don't Be So Serious.m4a",
  },
  {
    title: "NEVER (feat. Evil Neuro)",
    artist: 'Neuro-sama, Evil Neuro',
    src: "/music/NEVER (feat. Evil Neuro).m4a",
  }
];

import type { LifeItem } from '../types';

// ============================================================
// Games — Replace with your own favorites!
// ============================================================
export const gameData: LifeItem[] = [
  {
    id: 'example-game',
    title: 'Your Favorite Game',
    description: 'A short tagline about why this game matters to you.',
    tech: ['Genre', 'Platform'],
    link: '#',
    imageUrl: 'https://placehold.co/800x450/0d0d0d/b2f2bb?text=Game',
    articleContent: 'Write about your experience with this game. What made it special? What memories does it hold?',
    galleryImages: [
      { src: 'https://placehold.co/800x450/0d0d0d/b2f2bb?text=Screenshot+1' },
      { src: 'https://placehold.co/800x450/0d0d0d/b2f2bb?text=Screenshot+2' },
    ],
  },
];

// ============================================================
// Travel — Replace with your own journeys!
// ============================================================
export const travelData: LifeItem[] = [
  {
    id: 'example-city',
    title: 'A City You Love',
    description: 'Where you found something unexpected.',
    tech: ['Travel'],
    link: '#',
    imageUrl: 'https://placehold.co/800x450/0d0d0d/b2f2bb?text=Travel',
    articleContent: 'Share a travel story. The best ones are personal and honest.',
    galleryImages: [
      { src: 'https://placehold.co/800x450/0d0d0d/b2f2bb?text=Photo+1' },
      { src: 'https://placehold.co/800x450/0d0d0d/b2f2bb?text=Photo+2' },
    ],
  },
];

// ============================================================
// Other Interests — Replace with your own!
// ============================================================
export const otherData: LifeItem[] = [
  {
    id: 'example-hobby',
    title: 'A Hobby',
    description: 'Something you do outside of coding.',
    imageUrl: 'https://placehold.co/800x450/0d0d0d/b2f2bb?text=Hobby',
    tech: [],
    articleContent: 'Share what you do when you are not coding.',
    galleryImages: [
      { src: 'https://placehold.co/800x450/0d0d0d/b2f2bb?text=Hobby+1' },
    ],
  },
];

// ============================================================
// "Also Play These" — 在 Game Tab 折叠区显示的"附加涉猎"清单。
// 用纯字符串数组维护即可。
// ============================================================
export const alsoPlayGames: string[] = [
  'The Binding of Isaac: Rebirth',
  'Terraria',
  'Stardew Valley',
  'Warframe',
  'Deep Rock Galactic',
  'Slay the Spire',
  'Stellaris',
  'RimWorld',
];

// ============================================================
// Art Tab 占位文案 —— 你还没准备好写艺术分享时的临时介绍。
// ============================================================
export const artPlaceholderText =
  '艺术是个好东西，音乐、绘画、设计还是电影我都喜欢，可回想起来能做的能说的却很少，或许我可以晚点再写...';

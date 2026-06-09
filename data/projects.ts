import type { Project } from '../types';

// ============================================================
// Web / Frontend Projects — Replace with your own!
// ============================================================
export const webProjects: Project[] = [
  {
    id: 1,
    title: 'Portfolio Website',
    description: 'A HUD-themed personal portfolio built with Next.js',
    role: 'Design & Development',
    year: '2025',
    status: 'shipped',
    tech: ['UI/UX', 'Full Stack', 'DevOps'],
    highlights: [
      'Sci-fi HUD aesthetic',
      '42 custom CSS animations',
    ],
    link: '#',
    liveUrl: 'https://example.com',
    imageUrl: 'https://placehold.co/800x450/0d0d0d/b2f2bb?text=Project+1',
    galleryImages: [
      { src: 'https://placehold.co/800x450/0d0d0d/b2f2bb?text=Screenshot+1' },
      { src: 'https://placehold.co/800x450/0d0d0d/b2f2bb?text=Screenshot+2' },
    ],
    articleContent: `This is your portfolio website. Replace this text with a description of your project.

You can include links, markdown-style formatting, and multiple paragraphs to describe your work.`,
  },
  {
    id: 2,
    title: 'Example Project',
    description: 'A sample project to demonstrate the template structure',
    role: 'Frontend Developer',
    year: '2025',
    status: 'shipped',
    tech: ['React', 'TypeScript'],
    highlights: [
      'Responsive design',
      'Dark mode support',
    ],
    link: '#',
    liveUrl: 'https://example.com',
    imageUrl: 'https://placehold.co/800x450/0d0d0d/b2f2bb?text=Project+2',
    galleryImages: [
      { src: 'https://placehold.co/800x450/0d0d0d/b2f2bb?text=Gallery+1' },
    ],
    articleContent: `Describe what makes this project special.

Add screenshots, links, and technical details.`,
  },
];

// ============================================================
// Game / Creative Projects — Replace with your own!
// ============================================================
export const gameProjects: Project[] = [];

// ============================================================
// Early / Learning Projects
// ============================================================
export const earlyProjects: Project[] = [
  {
    id: 3,
    title: 'Learning Project',
    description: 'A project from your early learning journey',
    role: 'Student',
    year: '2023',
    status: 'archived',
    tech: ['HTML', 'CSS'],
    link: '#',
    imageUrl: 'https://placehold.co/800x450/0d0d0d/b2f2bb?text=Early+Project',
    galleryImages: [
      { src: 'https://placehold.co/800x450/0d0d0d/b2f2bb?text=Learning' },
    ],
    articleContent: `Share your learning journey here.`,
  },
];

export const learnProjects = earlyProjects;
export const workProjects = [...webProjects, ...gameProjects];

// ============================================================
// 详情页正文里需要被识别为"可复制"的关键词。
// 当 articleContent 文本中出现下列任何 pattern 字符串时，会被
// 自动渲染为"点击复制"按钮（保留 Markdown 链接 [text](url) 的
// 解析能力），无需手写额外 Markdown。
//
// 把你的服务器 IP / QQ 群号 / Discord 邀请码 / 邮箱别名等加在这里。
// 数组为空则只保留 Markdown 链接解析能力。
// ============================================================
export interface CopyableToken {
  /** 要匹配的字符串（按完整字面量匹配，特殊字符会自动正则转义） */
  pattern: string;
  /** 鼠标悬浮提示，可选 */
  label?: string;
}

export const copyableTokens: CopyableToken[] = [
  { pattern: 'play.foacraft.com', label: 'Minecraft 服务器地址' },
  { pattern: '481423636', label: 'QQ 群号' },
];

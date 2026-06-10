import type { ExperienceItem } from '../types';

// ============================================================
// Timeline — Replace with your own education & work history!
// ============================================================
export const experienceData: ExperienceItem[] = [
  {
    id: 'highschool',
    type: 'education',
    duration: '2019 - 2025',
    title: '高中时期',
    location: '宿迁市第一高级中学',
    details: [
      '宿迁市第一高级中学',
    ],
    alignment: 'right',
    galleryImages: [
      { src: 'https://placehold.co/800x450/0d0d0d/b2f2bb?text=High+School' },
    ],
  },
  {
    id: 'university',
    type: 'education',
    duration: '2025 - 至今',
    title: '大学时光',
    location: '江苏大学',
    details: [
      '江苏大学',
      '计算机科学与技术',
    ],
    alignment: 'left',
    galleryImages: [
      { src: 'https://placehold.co/800x450/0d0d0d/b2f2bb?text=University' },
    ],
  },
  {
    id: 'internship',
    type: 'work',
    duration: '??? - ???',
    title: '实习经历',
    location: '罗德岛',
    details: [
      '罗德岛制药',
      '工程部'
    ],
    alignment: 'left',
    galleryImages: [
      { src: 'https://placehold.co/800x450/0d0d0d/b2f2bb?text=Rhodes+Island' },
    ],
  },
];

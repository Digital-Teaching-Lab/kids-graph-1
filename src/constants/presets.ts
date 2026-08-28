import { PresetTopic } from '../types';

export const PRESET_TOPICS: PresetTopic[] = [
  {
    title: '우리 반이 가장 좋아하는 과일은?',
    category: '음식 & 과일',
    options: [
      { title: '딸기', emoji: '🍓', colorKey: 'strawberry' },
      { title: '바나나', emoji: '🍌', colorKey: 'banana' },
      { title: '사과', emoji: '🍏', colorKey: 'apple' },
      { title: '포도', emoji: '🍇', colorKey: 'grape' },
    ],
  },
  {
    title: '친구가 되는 멋진 방법은?',
    category: '인성 & 생활',
    options: [
      { title: '같이 놀이하기', emoji: '🤹', colorKey: 'strawberry' },
      { title: '다정하게 인사하기', emoji: '👋', colorKey: 'banana' },
      { title: '친구 이야기 들어주기', emoji: '👂', colorKey: 'apple' },
      { title: '장난감 양보하기', emoji: '🎁', colorKey: 'sky' },
    ],
  },
  {
    title: '우리가 좋아하는 동물 친구는?',
    category: '동물',
    options: [
      { title: '귀여운 강아지', emoji: '🐶', colorKey: 'orange' },
      { title: '새침한 고양이', emoji: '🐱', colorKey: 'banana' },
      { title: '깡총 토끼', emoji: '🐰', colorKey: 'strawberry' },
      { title: '뒤뚱 펭귄', emoji: '🐧', colorKey: 'sky' },
    ],
  },
  {
    title: '오늘 자유놀이 시간에 하고 싶은 놀이는?',
    category: '놀이 & 활동',
    options: [
      { title: '블록 쌓기', emoji: '🧱', colorKey: 'orange' },
      { title: '그림 그리기', emoji: '🎨', colorKey: 'apple' },
      { title: '역할 놀이', emoji: '👑', colorKey: 'grape' },
      { title: '신나는 동화책', emoji: '📚', colorKey: 'sky' },
    ],
  },
  {
    title: '내가 가장 좋아하는 계절은?',
    category: '자연 & 계절',
    options: [
      { title: '꽃 피는 봄', emoji: '🌸', colorKey: 'strawberry' },
      { title: '시원한 여름', emoji: '🍉', colorKey: 'apple' },
      { title: '알록달록 가을', emoji: '🍁', colorKey: 'orange' },
      { title: '눈 내리는 겨울', emoji: '⛄', colorKey: 'sky' },
    ],
  },
  {
    title: '오늘 먹고 싶은 오후 간식은?',
    category: '간식',
    options: [
      { title: '달콤한 와플', emoji: '🧇', colorKey: 'banana' },
      { title: '신선한 우유', emoji: '🥛', colorKey: 'sky' },
      { title: '고소한 빵', emoji: '🥐', colorKey: 'orange' },
      { title: '새콤 요거트', emoji: '🍨', colorKey: 'strawberry' },
    ],
  },
];

export const POPULAR_EMOJIS = [
  // Fruits & Food
  '🍓', '🍌', '🍏', '🍇', '🍉', '🍊', '🍑', '🍒', '🍍', '🥕', '🌽', '🍞', '🥐', '🧇', '🥞', '🥛', '🍦', '🍰', '🍪',
  // Animals
  '🐶', '🐱', '🐰', '🐼', '🐨', '🦁', '🐯', '🐻', '🦊', '🐵', '🐸', '🐧', '🐥', '🦄', '🐬', '🐙', '🦋', '🐝',
  // Activities & Items
  '🤹', '👋', '👂', '🎁', '🎨', '🧱', '👑', '📚', '⚽', '🚗', '✈️', '🚀', '⭐', '🌈', '🌸', '🍁', '⛄', '☀️', '❤️', '👍',
  // Feelings & Expressions
  '😊', '😍', '🤩', '😆', '🥰', '🥳', '😎', '🤗', '💪', '✨'
];

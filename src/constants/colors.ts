export interface PastelColor {
  key: string;
  name: string;
  hex: string;
  barHex: string;
  bgLight: string;
  bgSoft: string;
  bgCard: string;
  border: string;
  borderStrong: string;
  text: string;
  textDark: string;
  badgeBg: string;
  ring: string;
  cardBorderClass: string;
}

export const PASTEL_COLORS: Record<string, PastelColor> = {
  strawberry: {
    key: 'strawberry',
    name: '딸기 핑크',
    hex: '#FFB7B2',
    barHex: '#FFB7B2',
    bgLight: 'bg-[#FFF0F0]',
    bgSoft: 'bg-[#FFE2E0]',
    bgCard: 'bg-white',
    border: 'border-[#FFD0CD]',
    borderStrong: 'border-[#FFB7B2]',
    text: 'text-[#FF6B6B]',
    textDark: 'text-[#333333]',
    badgeBg: 'bg-[#FF7B7B]',
    ring: 'focus:ring-[#FFB7B2]',
    cardBorderClass: 'border-[#FFB7B2]',
  },
  apple: {
    key: 'apple',
    name: '초록 사과',
    hex: '#BFFFD0',
    barHex: '#BFFFD0',
    bgLight: 'bg-[#F2FFF6]',
    bgSoft: 'bg-[#E0FFE9]',
    bgCard: 'bg-white',
    border: 'border-[#CEF8DA]',
    borderStrong: 'border-[#BFFFD0]',
    text: 'text-[#10B981]',
    textDark: 'text-[#333333]',
    badgeBg: 'bg-[#34D399]',
    ring: 'focus:ring-[#BFFFD0]',
    cardBorderClass: 'border-[#BFFFD0]',
  },
  sky: {
    key: 'sky',
    name: '하늘 블루',
    hex: '#CFEAFF',
    barHex: '#CFEAFF',
    bgLight: 'bg-[#F4F9FF]',
    bgSoft: 'bg-[#E4F2FF]',
    bgCard: 'bg-white',
    border: 'border-[#D9EFFF]',
    borderStrong: 'border-[#CFEAFF]',
    text: 'text-[#38BDF8]',
    textDark: 'text-[#333333]',
    badgeBg: 'bg-[#60A5FA]',
    ring: 'focus:ring-[#CFEAFF]',
    cardBorderClass: 'border-[#CFEAFF]',
  },
  banana: {
    key: 'banana',
    name: '바나나 옐로우',
    hex: '#FFF5B1',
    barHex: '#FFF5B1',
    bgLight: 'bg-[#FFFDEE]',
    bgSoft: 'bg-[#FFF9CC]',
    bgCard: 'bg-white',
    border: 'border-[#FFF099]',
    borderStrong: 'border-[#FFF5B1]',
    text: 'text-[#D97706]',
    textDark: 'text-[#333333]',
    badgeBg: 'bg-[#FBBF24]',
    ring: 'focus:ring-[#FFF5B1]',
    cardBorderClass: 'border-[#FFF5B1]',
  },
  grape: {
    key: 'grape',
    name: '포도 보라',
    hex: '#E8D7FF',
    barHex: '#E8D7FF',
    bgLight: 'bg-[#FAF5FF]',
    bgSoft: 'bg-[#F3E8FF]',
    bgCard: 'bg-white',
    border: 'border-[#E2CEFF]',
    borderStrong: 'border-[#E8D7FF]',
    text: 'text-[#9333EA]',
    textDark: 'text-[#333333]',
    badgeBg: 'bg-[#C084FC]',
    ring: 'focus:ring-[#E8D7FF]',
    cardBorderClass: 'border-[#E8D7FF]',
  },
  orange: {
    key: 'orange',
    name: '당근 주황',
    hex: '#FFD1B3',
    barHex: '#FFD1B3',
    bgLight: 'bg-[#FFF7F2]',
    bgSoft: 'bg-[#FFE8DC]',
    bgCard: 'bg-white',
    border: 'border-[#FFD9C2]',
    borderStrong: 'border-[#FFD1B3]',
    text: 'text-[#EA580C]',
    textDark: 'text-[#333333]',
    badgeBg: 'bg-[#FB923C]',
    ring: 'focus:ring-[#FFD1B3]',
    cardBorderClass: 'border-[#FFD1B3]',
  },
  mint: {
    key: 'mint',
    name: '민트 민트',
    hex: '#B9F5E5',
    barHex: '#B9F5E5',
    bgLight: 'bg-[#F0FDF9]',
    bgSoft: 'bg-[#D3F9EF]',
    bgCard: 'bg-white',
    border: 'border-[#B4F0E0]',
    borderStrong: 'border-[#B9F5E5]',
    text: 'text-[#0D9488]',
    textDark: 'text-[#333333]',
    badgeBg: 'bg-[#2DD4BF]',
    ring: 'focus:ring-[#B9F5E5]',
    cardBorderClass: 'border-[#B9F5E5]',
  },
  cotton: {
    key: 'cotton',
    name: '솜사탕 인디고',
    hex: '#D5D9FF',
    barHex: '#D5D9FF',
    bgLight: 'bg-[#F5F6FF]',
    bgSoft: 'bg-[#E5E8FF]',
    bgCard: 'bg-white',
    border: 'border-[#CCD1FF]',
    borderStrong: 'border-[#D5D9FF]',
    text: 'text-[#4F46E5]',
    textDark: 'text-[#333333]',
    badgeBg: 'bg-[#818CF8]',
    ring: 'focus:ring-[#D5D9FF]',
    cardBorderClass: 'border-[#D5D9FF]',
  },
};

export const COLOR_KEYS = Object.keys(PASTEL_COLORS);

export function getColor(key: string): PastelColor {
  return PASTEL_COLORS[key] || PASTEL_COLORS.strawberry;
}

export function getColorByIndex(index: number): PastelColor {
  const keys = COLOR_KEYS;
  const key = keys[index % keys.length];
  return PASTEL_COLORS[key];
}

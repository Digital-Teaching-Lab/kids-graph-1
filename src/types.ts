export interface VoteOption {
  id: string;
  title: string;
  emoji: string;
  colorKey: string;
  votes: number;
}

export type ScreenType = 'setup' | 'voting' | 'results';

export interface VoteData {
  topic: string;
  options: VoteOption[];
  currentScreen: ScreenType;
  maxVotesPerPerson: number; // 1, 2, 3, or 0 (unlimited)
  participantCount?: number;
  soundEnabled: boolean;
}

export interface PresetTopic {
  title: string;
  category: string;
  options: {
    title: string;
    emoji: string;
    colorKey: string;
  }[];
}

import React from 'react';
import { ScreenType } from '../types';
import { Volume2, VolumeX, Maximize, Minimize, Settings2, Sparkles, BarChart3, Vote, CheckCircle2, RotateCcw } from 'lucide-react';
import { playTapSound } from '../utils/audio';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  totalVotes: number;
  participantCount: number;
  onOpenResetModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  soundEnabled,
  onToggleSound,
  isFullscreen,
  onToggleFullscreen,
  totalVotes,
  participantCount,
  onOpenResetModal,
}) => {
  const steps = [
    { id: 'setup', label: '1. 만들기', icon: Settings2 },
    { id: 'voting', label: '2. 투표하기', icon: Vote },
    { id: 'results', label: '3. 결과보기', icon: BarChart3 },
  ];

  const displayCount = participantCount > 0 ? participantCount : totalVotes;

  return (
    <header className="w-full bg-white border-b border-[#EAEAEA] sticky top-0 z-40 card-vibrant-shadow px-3 sm:px-6 py-2.5 sm:py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer" onClick={() => onNavigate('setup')}>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FFB7B2] flex items-center justify-center text-white shadow-xs border border-[#FFA5A0]">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#333333] tracking-tight" style={{ fontFamily: "'OmuDaye', sans-serif" }}>
                우리 반 그래프 투표
              </h1>
            </div>
            <p className="text-xs text-[#777777] font-medium hidden md:block">
              아이들이 직접 터치하고 눈으로 보는 실시간 그래프
            </p>
          </div>
        </div>

        {/* Center: Stage Navigation Stepper (Big, clear buttons) */}
        <nav className="flex items-center bg-[#F3F4F6] p-1 sm:p-1.5 rounded-2xl border border-[#E5E7EB]">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentScreen === step.id;
            return (
              <button
                key={step.id}
                onClick={() => {
                  playTapSound(soundEnabled);
                  onNavigate(step.id as ScreenType);
                }}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-white text-[#333333] shadow-sm ring-1 ring-[#FFB7B2] scale-102'
                    : 'text-[#666666] hover:text-[#333333] hover:bg-white/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF7B7B]' : 'text-[#888888]'}`} />
                <span>{step.label}</span>
                {step.id === 'voting' && displayCount > 0 && (
                  <span className="ml-0.5 bg-[#FF7B7B] text-white text-[10px] sm:text-xs font-black px-1.5 py-0.2 rounded-full">
                    {participantCount > 0 ? `${participantCount}명` : `${totalVotes}표`}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Classroom Tools (Sound, Fullscreen, Reset) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              playTapSound(!soundEnabled);
            }}
            title={soundEnabled ? '효과음 켜짐' : '효과음 꺼짐'}
            className={`p-2 sm:p-2.5 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-[#FFEBEA] border-[#FFD5D2] text-[#FF6B6B]'
                : 'bg-[#F3F4F6] border-[#E5E7EB] text-[#9CA3AF]'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Fullscreen Toggle for Smartboard */}
          <button
            onClick={() => {
              playTapSound(soundEnabled);
              onToggleFullscreen();
            }}
            title="전자칠판 전체화면"
            className="p-2 sm:p-2.5 rounded-xl bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] text-[#555555] transition-all shadow-2xs"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>

          {/* Reset Votes Quick Button */}
          {totalVotes > 0 && (
            <button
              onClick={() => {
                playTapSound(soundEnabled);
                onOpenResetModal();
              }}
              title="모든 투표 초기화"
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#FFF0F0] hover:bg-[#FFE4E4] border border-[#FFD0CD] text-[#FF6B6B] text-xs sm:text-sm font-bold transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">초기화</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

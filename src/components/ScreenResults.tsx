import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { VoteOption, ScreenType } from '../types';
import { BarChart } from './charts/BarChart';
import { getColor } from '../constants/colors';
import { playCelebrationSound, playTapSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  PlusCircle,
  Vote,
  Trophy,
  Users,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

interface ScreenResultsProps {
  topic: string;
  options: VoteOption[];
  participantCount: number;
  onNavigate: (screen: ScreenType) => void;
  onResetVotes: () => void;
  onResetAll: () => void;
  soundEnabled: boolean;
}

export const ScreenResults: React.FC<ScreenResultsProps> = ({
  topic,
  options,
  participantCount,
  onNavigate,
  onResetVotes,
  onResetAll,
  soundEnabled,
}) => {
  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);
  const displayParticipants = participantCount > 0 ? participantCount : totalVotes;

  // Find winner(s)
  const maxVotes = Math.max(...options.map((o) => o.votes), 0);
  const winners = options.filter((o) => o.votes === maxVotes && maxVotes > 0);

  // Trigger celebration on mount
  useEffect(() => {
    playCelebrationSound(soundEnabled);

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF7B95', '#FBBF24', '#10B981', '#38BDF8', '#A855F7'],
      });
    } catch {}
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex flex-col gap-3 sm:gap-4 items-center">
      {/* Top Streamlined Results Header (Compact to ensure Graph fits in 1 screen) */}
      <section className="w-full bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 card-vibrant-shadow border border-[#EAEAEA] flex flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#FFF5B1] text-[#D97706] border border-[#FDE68A] flex items-center justify-center shadow-2xs shrink-0">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] sm:text-xs font-black text-[#FF6B6B] bg-[#FFEBEA] px-2 py-0.5 rounded-full border border-[#FFD5D2]">
                투표 결과
              </span>
              {winners.length > 0 && (
                <span className="text-[11px] sm:text-xs font-black text-[#D97706] bg-[#FFFBEB] px-2 py-0.5 rounded-full border border-[#FDE68A] flex items-center gap-1">
                  <span>👑 1위:</span>
                  <span className="font-extrabold truncate max-w-[150px] sm:max-w-[250px]">
                    {winners.map((w) => `${w.emoji ? w.emoji + ' ' : ''}${w.title}`).join(', ')}
                  </span>
                  <span>({maxVotes}표)</span>
                </span>
              )}
            </div>
            <h2
              className="text-base sm:text-lg md:text-xl font-black text-[#333333] mt-0.5 truncate"
              style={{ fontFamily: "'OmuDaye', sans-serif" }}
            >
              {topic}
            </h2>
          </div>
        </div>

        {/* Right: Participants & Total Votes */}
        <div className="flex items-center gap-2 sm:gap-3 bg-[#F9FAFB] px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border border-[#E5E7EB] shrink-0">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF7B7B]" />
            <span className="text-xs font-bold text-[#666666] hidden sm:inline">참여</span>
            <span className="text-base sm:text-xl font-black text-[#FF7B7B]">{displayParticipants}</span>
            <span className="text-xs font-bold text-[#666666]">명</span>
          </div>

          <div className="h-4 w-[1px] bg-[#E5E7EB]"></div>

          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-[#777777] hidden sm:inline">총</span>
            <span className="text-base sm:text-xl font-black text-[#333333]">{totalVotes}</span>
            <span className="text-xs font-bold text-[#777777]">표</span>
          </div>
        </div>
      </section>

      {/* Main Bar Graph Display (Positioned on the initial screen view) */}
      <section className="w-full">
        <BarChart options={options} totalVotes={totalVotes} participantCount={displayParticipants} />
      </section>

      {/* Downward Scroll Hint Indicator */}
      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#888888] py-1 select-none animate-bounce">
        <ChevronDown className="w-4 h-4 text-[#FF7B7B]" />
        <span>아래로 스크롤하여 상세 득표 순위와 메뉴를 확인하세요</span>
        <ChevronDown className="w-4 h-4 text-[#FF7B7B]" />
      </div>

      {/* Item Summary Cards Grid (Scrollable Section below graph) */}
      <section className="w-full bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 card-vibrant-shadow border border-[#EAEAEA] mt-1">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm sm:text-base font-black text-[#333333] flex items-center gap-2">
            <span>🏆</span>
            <span>각 항목의 최종 득표수 (1위 순서대로)</span>
          </h3>
          <span className="text-xs font-bold text-[#FF6B6B] bg-[#FFEBEA] px-2.5 py-0.5 rounded-full border border-[#FFD5D2]">
            누적 순위
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {(() => {
            const distinctVotes = Array.from(
              new Set<number>(options.map((o) => o.votes).filter((v) => v > 0))
            ).sort((a: number, b: number) => b - a);

            const sortedOptions = [...options].sort((a, b) => b.votes - a.votes);

            return sortedOptions.map((opt) => {
              const color = getColor(opt.colorKey);
              const rank = opt.votes > 0 ? distinctVotes.indexOf(opt.votes) + 1 : null;

              let rankBadge = null;
              if (rank === 1) {
                rankBadge = { label: '1등', emoji: '🥇', bg: 'bg-[#FFF5B1]', text: 'text-[#D97706]', border: 'border-[#FDE68A]' };
              } else if (rank === 2) {
                rankBadge = { label: '2등', emoji: '🥈', bg: 'bg-[#E0F2FE]', text: 'text-[#0284C7]', border: 'border-[#BAE6FD]' };
              } else if (rank === 3) {
                rankBadge = { label: '3등', emoji: '🥉', bg: 'bg-[#FFEDD5]', text: 'text-[#C2410C]', border: 'border-[#FED7AA]' };
              } else if (rank) {
                rankBadge = { label: `${rank}등`, emoji: '✨', bg: 'bg-white/80', text: 'text-[#555555]', border: 'border-[#E5E7EB]' };
              }

              return (
                <div
                  key={opt.id}
                  className={`p-3 sm:p-3.5 rounded-2xl border-2 flex flex-col items-center text-center relative transition-all hover:scale-[1.02] ${color.bgLight} ${color.border}`}
                >
                  {/* Top Rank Badge */}
                  {rankBadge ? (
                    <span
                      className={`mb-1.5 font-black text-[11px] sm:text-xs px-2 py-0.5 rounded-full border shadow-2xs flex items-center gap-1 ${rankBadge.bg} ${rankBadge.text} ${rankBadge.border}`}
                    >
                      <span>{rankBadge.emoji}</span>
                      <span>{rankBadge.label}</span>
                    </span>
                  ) : (
                    <span className="mb-1.5 font-bold text-[11px] text-[#999999] bg-white/60 px-2 py-0.5 rounded-full border border-[#EEEEEE]">
                      0표
                    </span>
                  )}

                  {opt.emoji && (
                    <span className="text-2xl sm:text-3xl mb-1 select-none">{opt.emoji}</span>
                  )}
                  <span
                    className="text-xs sm:text-sm font-black text-[#333333] w-full mb-1 break-keep leading-tight"
                    style={{ wordBreak: 'keep-all', fontFamily: "'OmuDaye', sans-serif" }}
                  >
                    {opt.title}
                  </span>
                  <div className="flex items-baseline gap-1 bg-white/90 px-3 py-0.5 rounded-xl border border-black/5 shadow-2xs mt-0.5">
                    <span className="text-xl sm:text-2xl font-black text-[#333333]">
                      {opt.votes}
                    </span>
                    <span className="text-xs font-bold text-[#666666]">표</span>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </section>

      {/* Bottom Action Buttons (다시 투표하기, 처음부터 새로 만들기, 초기화) */}
      <section className="w-full flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 pt-1 pb-6">
        {/* Revote with same topic/options */}
        <button
          type="button"
          onClick={() => {
            playTapSound(soundEnabled);
            onNavigate('voting');
          }}
          className="px-6 py-3 bg-[#FF7B7B] hover:bg-[#FF6565] text-white font-black text-sm sm:text-base rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
          style={{ fontFamily: "'OmuDaye', sans-serif" }}
        >
          <Vote className="w-4 h-4 stroke-[2.5]" />
          <span>계속 이어서 투표하기</span>
        </button>

        {/* Reset vote counts to 0 and revote */}
        <button
          type="button"
          onClick={() => {
            playTapSound(soundEnabled);
            onResetVotes();
          }}
          className="px-5 py-3 bg-[#CFEAFF] hover:bg-[#BAE2FF] text-[#0284C7] font-black text-sm sm:text-base rounded-full shadow-2xs transition-all active:scale-95 flex items-center gap-1.5 border border-[#BCE0FD]"
          style={{ fontFamily: "'OmuDaye', sans-serif" }}
        >
          <RotateCcw className="w-4 h-4 stroke-[2.5]" />
          <span>표만 비우고 다시 투표</span>
        </button>

        {/* Start Fresh Setup */}
        <button
          type="button"
          onClick={() => {
            playTapSound(soundEnabled);
            onResetAll();
          }}
          className="px-5 py-3 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#444444] font-black text-sm sm:text-base rounded-full shadow-2xs transition-all active:scale-95 flex items-center gap-1.5 border border-[#E5E7EB]"
          style={{ fontFamily: "'OmuDaye', sans-serif" }}
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>처음부터 새로 만들기</span>
        </button>
      </section>
    </div>
  );
};

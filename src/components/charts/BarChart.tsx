import React from 'react';
import { motion } from 'motion/react';
import { VoteOption } from '../../types';
import { getColor } from '../../constants/colors';

interface BarChartProps {
  options: VoteOption[];
  totalVotes: number;
  participantCount?: number;
  interactive?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({ options, totalVotes, participantCount = 0 }) => {
  const maxVotes = Math.max(...options.map((o) => o.votes), 0);

  // chartMax provides natural headroom (+1 or +2) above maxVotes so labels/badges above the highest bar never overflow or collide
  const chartMax = Math.max(5, maxVotes === 0 ? 5 : maxVotes + (maxVotes >= 6 ? 2 : 1));

  const displayParticipants = participantCount > 0 ? participantCount : totalVotes;

  // Distinct sorted vote counts > 0 for ranking
  const distinctVotes = Array.from(
    new Set<number>(options.map((o) => o.votes).filter((v) => v > 0))
  ).sort((a: number, b: number) => b - a);

  const getRankInfo = (votes: number) => {
    if (votes <= 0) return null;
    const rank = distinctVotes.indexOf(votes) + 1;
    if (rank === 1) {
      return {
        rank: 1,
        label: '1등!',
        emoji: '🥇',
        badgeClass: 'bg-[#FFF5B1] text-[#D97706] border-[#FDE68A] text-[11px] sm:text-xs py-0.5 px-1.5 sm:px-2 shadow-xs',
      };
    }
    if (rank === 2) {
      return {
        rank: 2,
        label: '2등!',
        emoji: '🥈',
        badgeClass: 'bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD] text-[10px] sm:text-[11px] py-0.5 px-1.5 shadow-2xs',
      };
    }
    if (rank === 3) {
      return {
        rank: 3,
        label: '3등!',
        emoji: '🥉',
        badgeClass: 'bg-[#FFEDD5] text-[#C2410C] border-[#FED7AA] text-[10px] sm:text-[11px] py-0.5 px-1.5 shadow-2xs',
      };
    }
    return null;
  };

  // Generate every discrete integer step from chartMax down to 0
  const gridLevels = Array.from({ length: chartMax + 1 }, (_, i) => chartMax - i);

  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 card-vibrant-shadow border border-[#EAEAEA] flex flex-col items-center">
      {/* Chart Header */}
      <div className="w-full flex items-center justify-between mb-2 sm:mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-[#FF7B7B]"></span>
          <span
            className="text-base sm:text-lg md:text-xl font-black text-[#333333]"
            style={{ fontFamily: "'OmuDaye', sans-serif" }}
          >
            막대그래프 (누가 더 많을까?)
          </span>
        </div>
        <span className="text-xs font-bold text-[#555555] bg-[#F3F4F6] px-2.5 py-0.5 rounded-full border border-[#E5E7EB]">
          (단위: 표)
        </span>
      </div>

      {/* Main Chart Box */}
      <div className="w-full flex flex-col">
        {/* Plotting Graph Grid Area */}
        <div className="relative w-full h-[200px] sm:h-[240px] md:h-[280px] flex">
          {/* Left Y-Axis Numbers */}
          <div className="w-6 sm:w-8 md:w-9 h-full relative shrink-0 select-none">
            {gridLevels.map((val) => {
              const topPercent = ((chartMax - val) / chartMax) * 100;
              return (
                <div
                  key={val}
                  className="absolute right-1.5 font-black text-[11px] sm:text-xs md:text-sm text-[#555555] -translate-y-1/2 flex items-center justify-end"
                  style={{ top: `${topPercent}%` }}
                >
                  {val}
                </div>
              );
            })}
          </div>

          {/* Chart Plot Area (Horizontal grid lines + Bars) */}
          <div className="flex-1 h-full relative border-l-2 border-[#D1D5DB]">
            {/* Horizontal Grid Lines for every single level (0 to chartMax) */}
            {gridLevels.map((val) => {
              const topPercent = ((chartMax - val) / chartMax) * 100;
              const isBaseLine = val === 0;
              return (
                <div
                  key={val}
                  className={`absolute inset-x-0 pointer-events-none ${
                    isBaseLine
                      ? 'border-b-2 border-[#374151] z-20'
                      : 'border-b border-[#E5E7EB] border-dashed z-0'
                  }`}
                  style={{ top: `${topPercent}%` }}
                />
              );
            })}

            {/* Vertical Bars Container */}
            <div className="absolute inset-0 z-10 flex items-end justify-around gap-1.5 sm:gap-3 md:gap-4 px-1 sm:px-3">
              {options.map((opt) => {
                const color = getColor(opt.colorKey);
                const rankInfo = getRankInfo(opt.votes);
                const heightPercent = chartMax > 0 ? (opt.votes / chartMax) * 100 : 0;

                return (
                  <div
                    key={opt.id}
                    className="flex-1 max-w-[100px] h-full flex flex-col justify-end items-center relative group"
                  >
                    {/* Floating Label (Rank Badge + Vote Count) */}
                    <div
                      className="absolute z-20 flex flex-col items-center pointer-events-none transition-all"
                      style={{
                        bottom: `calc(${heightPercent}% + 3px)`,
                      }}
                    >
                      {/* 1등, 2등, 3등 Badge */}
                      {rankInfo && (
                        <motion.div
                          initial={{ scale: 0, y: 4 }}
                          animate={{ scale: 1, y: 0 }}
                          transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                          className={`mb-0.5 flex items-center justify-center ${
                            rankInfo.rank === 1 ? 'animate-bounce' : ''
                          }`}
                        >
                          <span
                            className={`font-black rounded-full flex items-center gap-0.5 border whitespace-nowrap ${rankInfo.badgeClass}`}
                          >
                            <span>{rankInfo.emoji}</span>
                            <span>{rankInfo.label}</span>
                          </span>
                        </motion.div>
                      )}

                      {/* Vote Count Label on top of this bar */}
                      <span
                        className={`text-[11px] sm:text-xs md:text-sm font-black px-1.5 sm:px-2 py-0.2 rounded-md shadow-2xs whitespace-nowrap ${
                          opt.votes > 0
                            ? 'bg-white text-[#111111] border border-[#374151]/30'
                            : 'text-[#AAAAAA] bg-[#F9FAFB] border border-[#E5E7EB]'
                        }`}
                        style={{ fontFamily: "'OmuDaye', sans-serif" }}
                      >
                        {opt.votes}표
                      </span>
                    </div>

                    {/* Solid Colored Bar */}
                    {opt.votes > 0 && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ type: 'spring', stiffness: 140, damping: 16 }}
                        className="w-full relative shadow-xs"
                        style={{
                          backgroundColor: color.hex,
                          borderTopLeftRadius: '8px',
                          borderTopRightRadius: '8px',
                        }}
                      >
                        {/* Subtle internal grid lines aligned with Y-axis */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-t-[8px]">
                          {Array.from({ length: opt.votes }).map((_, stepIdx) => {
                            if (stepIdx === 0) return null;
                            const lineBottomPercent = (stepIdx / opt.votes) * 100;
                            return (
                              <div
                                key={stepIdx}
                                className="absolute inset-x-0 border-t border-black/10"
                                style={{ bottom: `${lineBottomPercent}%` }}
                              />
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom: Item Labels Box (Square Box with Emoji + Text Inside, separated below the line) */}
        <div className="w-full flex items-stretch justify-around gap-1.5 sm:gap-3 md:gap-4 pl-6 sm:pl-8 md:pl-9 mt-2 pt-1">
          {options.map((opt) => {
            const color = getColor(opt.colorKey);

            return (
              <div
                key={opt.id}
                className="flex-1 max-w-[100px] flex flex-col items-center"
              >
                {/* Colored Rounded Card Box containing BOTH Emoji and Title inside */}
                <div
                  className={`w-full h-full min-h-[58px] sm:min-h-[68px] md:min-h-[76px] rounded-xl sm:rounded-2xl ${color.bgLight} ${color.border} border-2 p-1.5 sm:p-2 flex flex-col items-center justify-center text-center shadow-2xs transition-all hover:scale-102`}
                >
                  {/* Emoji (only rendered if present) */}
                  {opt.emoji && (
                    <div className="flex items-center justify-center mb-0.5 select-none">
                      <span className="text-xl sm:text-2xl md:text-3xl filter drop-shadow-2xs leading-none">
                        {opt.emoji}
                      </span>
                    </div>
                  )}

                  {/* Title Text */}
                  <span
                    className="text-[11px] sm:text-xs md:text-sm font-black text-[#333333] leading-tight break-keep text-center w-full"
                    style={{ wordBreak: 'keep-all', fontFamily: "'OmuDaye', sans-serif" }}
                  >
                    {opt.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Helper text for teachers & kids */}
      <div className="mt-2.5 pt-2 border-t border-[#EEEEEE] w-full flex flex-row items-center justify-between gap-2 text-[11px] sm:text-xs text-[#777777]">
        <span className="flex items-center gap-1 font-medium truncate">
          💡 <span className="font-bold text-[#333333]">눈금과 막대 높이</span>를 비교해보세요!
        </span>
        <div className="flex items-center gap-1.5 font-bold shrink-0">
          <span className="text-[#FF7B7B]">
            참여: {displayParticipants}명
          </span>
          <span className="text-[#999999]">|</span>
          <span className="text-[#333333]">
            총: {totalVotes}표
          </span>
        </div>
      </div>
    </div>
  );
};

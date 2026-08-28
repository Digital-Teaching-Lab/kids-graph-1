import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VoteOption } from '../types';
import { getColor } from '../constants/colors';
import { playVoteSound, playTapSound, playCelebrationSound } from '../utils/audio';
import {
  CheckCircle2,
  Sparkles,
  Users,
  Check,
} from 'lucide-react';

interface ScreenVotingProps {
  topic: string;
  options: VoteOption[];
  setOptions: React.Dispatch<React.SetStateAction<VoteOption[]>>;
  maxVotesPerPerson: number;
  participantCount: number;
  setParticipantCount: React.Dispatch<React.SetStateAction<number>>;
  onFinishVoting: () => void;
  soundEnabled: boolean;
}

export const ScreenVoting: React.FC<ScreenVotingProps> = ({
  topic,
  options,
  setOptions,
  maxVotesPerPerson,
  participantCount,
  setParticipantCount,
  onFinishVoting,
  soundEnabled,
}) => {
  // For multi-vote per child (when maxVotesPerPerson > 1)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Tracking recent clicked option ID for gentle sparkle feedback
  const [activeFeedbackId, setActiveFeedbackId] = useState<string | null>(null);
  const [showBatchSuccess, setShowBatchSuccess] = useState(false);

  // Total votes count
  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);

  const isMultiVoteMode = maxVotesPerPerson > 1;

  // Multi/Single select toggle handler
  const handleToggleSelect = (id: string) => {
    playTapSound(soundEnabled);

    if (selectedIds.includes(id)) {
      // Unselect
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    } else {
      // Select
      if (maxVotesPerPerson === 1) {
        setSelectedIds([id]);
      } else if (selectedIds.length < maxVotesPerPerson) {
        setSelectedIds((prev) => [...prev, id]);
      } else {
        // Replace oldest
        setSelectedIds((prev) => [...prev.slice(1), id]);
      }
    }
  };

  // Main Card Click Router
  const handleCardClick = (id: string) => {
    handleToggleSelect(id);
  };

  // Submit votes for current child (strictly require all maxVotesPerPerson to be chosen)
  const isSelectionComplete = selectedIds.length === maxVotesPerPerson;

  const handleSubmitVote = () => {
    if (!isSelectionComplete) return;

    playCelebrationSound(soundEnabled);
    setShowBatchSuccess(true);

    setOptions((prev) =>
      prev.map((opt) =>
        selectedIds.includes(opt.id) ? { ...opt, votes: opt.votes + 1 } : opt
      )
    );
    setParticipantCount((prev) => prev + 1);

    setTimeout(() => {
      setSelectedIds([]);
      setShowBatchSuccess(false);
    }, 900);
  };

  // Dynamic Grid layout for perfect 1-page fit
  const getGridClasses = () => {
    switch (options.length) {
      case 2:
        return 'grid-cols-2 max-w-3xl';
      case 3:
        return 'grid-cols-3 max-w-4xl';
      case 4:
        return 'grid-cols-2 sm:grid-cols-4 max-w-6xl';
      case 5:
      case 6:
        return 'grid-cols-3 sm:grid-cols-3 max-w-5xl';
      case 7:
      case 8:
      default:
        return 'grid-cols-2 sm:grid-cols-4 max-w-6xl';
    }
  };

  const actualParticipants = participantCount;

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex flex-col gap-2.5 sm:gap-3.5 items-center">
      {/* Top Question Banner (Compact & Streamlined) */}
      <section className="w-full bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 card-vibrant-shadow border border-[#EAEAEA] flex flex-row items-center justify-between gap-3">
        {/* Left: Question title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] sm:text-xs font-black text-[#FF6B6B] bg-[#FFEBEA] px-2 py-0.5 rounded-full border border-[#FFD5D2]">
                투표 진행 중
              </span>
              <span className="text-[11px] sm:text-xs font-black text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-full border border-[#BAE6FD]">
                1인당 {maxVotesPerPerson}개 선택
              </span>
            </div>
            <h2
              className="text-lg sm:text-xl md:text-2xl font-black text-[#333333] mt-0.5 leading-tight truncate"
              style={{ fontFamily: "'OmuDaye', sans-serif" }}
            >
              {topic}
            </h2>
          </div>
        </div>

        {/* Right: Live Participants Indicator */}
        <div className="flex items-center gap-1.5 bg-[#F9FAFB] px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border border-[#E5E7EB] shrink-0">
          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF7B7B]" />
          <span className="text-xs font-bold text-[#666666] hidden sm:inline">참여 어린이</span>
          <span className="text-base sm:text-xl font-black text-[#FF7B7B]">{actualParticipants}</span>
          <span className="text-xs font-bold text-[#666666]">명</span>
        </div>
      </section>

      {/* Active Child Selection Status Bar (Always visible for next child workflow) */}
      <motion.section
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-4xl p-2.5 sm:p-3 rounded-2xl border-2 shadow-2xs flex flex-row items-center justify-between gap-3 transition-colors ${
          selectedIds.length === maxVotesPerPerson
            ? 'bg-[#EBF7EE] border-[#86EFAC]'
            : 'bg-[#FFFBEB] border-[#FDE68A]'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-2xs border border-black/5 text-lg shrink-0">
            {selectedIds.length === maxVotesPerPerson ? '🎉' : '👉'}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black text-[#666666]">
              선택: {selectedIds.length}/{maxVotesPerPerson}개
            </span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: maxVotesPerPerson }).map((_, i) => (
                <span
                  key={i}
                  className={`text-base transition-transform ${
                    i < selectedIds.length ? 'scale-110' : 'opacity-30'
                  }`}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Child Complete Button */}
        <div className="flex items-center gap-1.5">
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-[#777777] border border-[#E5E7EB] text-xs font-bold transition-all"
            >
              다시
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmitVote}
            disabled={!isSelectionComplete}
            className={`px-4 py-1.5 sm:py-2 rounded-full font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 shadow-sm ${
              isSelectionComplete
                ? 'bg-[#10B981] hover:bg-[#059669] text-white shadow-xs animate-pulse'
                : 'bg-[#D1D5DB] text-[#6B7280] cursor-not-allowed opacity-60'
            }`}
            style={{ fontFamily: "'OmuDaye', sans-serif" }}
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>
              {isSelectionComplete
                ? `${maxVotesPerPerson}개 완료 (다음 친구)`
                : selectedIds.length === 0
                ? `${maxVotesPerPerson}개 골라주세요`
                : `${maxVotesPerPerson - selectedIds.length}개 더 골라주세요`}
            </span>
          </button>
        </div>
      </motion.section>

      {/* Main Voting Cards Grid (Designed to fit 1 screen perfectly) */}
      <section className={`w-full grid ${getGridClasses()} gap-2.5 sm:gap-3.5 md:gap-4 justify-center`}>
        {options.map((opt) => {
          const color = getColor(opt.colorKey);
          const isSelected = selectedIds.includes(opt.id);
          const isFeedbackActive = activeFeedbackId === opt.id;

          return (
            <motion.div
              key={opt.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleCardClick(opt.id)}
              className={`relative select-none cursor-pointer bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 border-3 sm:border-4 ${
                isSelected
                  ? 'border-[#10B981] ring-3 ring-[#86EFAC] shadow-md scale-102 bg-[#F0FDF4]'
                  : color.cardBorderClass
              } flex flex-col items-center justify-between text-center transition-all duration-150 card-vibrant-shadow hover:shadow-md active:shadow-xs overflow-hidden min-h-[140px] sm:min-h-[170px] md:min-h-[190px] ${
                isFeedbackActive ? 'ring-3 ring-[#FFB7B2] scale-102' : ''
              }`}
            >
              {/* Selected check badge */}
              <div className="absolute top-2.5 right-2.5 z-20">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#10B981] text-white shadow-xs scale-110'
                      : 'bg-[#F3F4F6] text-[#BBBBBB] border border-[#E5E7EB]'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 stroke-[3] ${isSelected ? 'opacity-100' : 'opacity-40'}`} />
                </div>
              </div>

              {/* Center: Emoji & Title (Pure item display without vote counts) */}
              <div className="flex flex-col items-center justify-center gap-2 my-auto z-10 w-full py-1">
                {opt.emoji && (
                  <motion.div
                    animate={
                      isFeedbackActive || isSelected
                        ? { scale: [1, 1.2, 1], rotate: [0, -6, 6, 0] }
                        : {}
                    }
                    transition={{ duration: 0.35 }}
                    className="text-5xl sm:text-6xl md:text-7xl filter drop-shadow-2xs select-none"
                  >
                    {opt.emoji}
                  </motion.div>
                )}
                <h3
                  className={`${
                    opt.emoji
                      ? 'text-base sm:text-lg md:text-xl'
                      : 'text-lg sm:text-xl md:text-2xl py-2'
                  } font-black text-[#333333] leading-snug tracking-tight text-center break-keep w-full`}
                  style={{ fontFamily: "'OmuDaye', sans-serif", wordBreak: 'keep-all' }}
                >
                  {opt.title}
                </h3>
              </div>

              {/* Gentle Floating Feedback Animation: "투표 완료! ✨" */}
              <AnimatePresence>
                {isFeedbackActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none bg-white/50 backdrop-blur-2xs"
                  >
                    <div className="bg-[#FF7B7B] text-white px-3.5 py-1.5 rounded-xl shadow-md border border-white flex items-center gap-1.5 font-black text-sm sm:text-base">
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>투표 완료!</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </section>

      {/* Success Banner for Multi-vote batch submission */}
      <AnimatePresence>
        {showBatchSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/20 backdrop-blur-xs"
          >
            <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-[#10B981] flex flex-col items-center text-center gap-2">
              <span className="text-5xl animate-bounce">🎉</span>
              <h3 className="text-xl sm:text-2xl font-black text-[#333333]" style={{ fontFamily: "'OmuDaye', sans-serif" }}>
                투표가 잘 들어갔어요!
              </h3>
              <p className="text-sm font-bold text-[#10B981]">다음 친구 나와주세요~ ⭐️</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Finish Voting Bar (Compact & Directly visible without scrolling) */}
      <section className="w-full max-w-4xl flex flex-row items-center justify-between gap-3 p-3 sm:p-3.5 bg-white rounded-2xl border border-[#EAEAEA] card-vibrant-shadow">
        <div className="flex items-center gap-1.5 text-[#555555] text-xs sm:text-sm font-bold truncate">
          <span>👉</span>
          <span className="truncate">
            각자 {maxVotesPerPerson}개 선택 후 [{maxVotesPerPerson}개 완료]를 터치해주세요!
          </span>
        </div>

        {/* Finish Voting Button */}
        <button
          type="button"
          onClick={() => {
            playTapSound(soundEnabled);
            onFinishVoting();
          }}
          className="px-5 sm:px-7 py-2.5 sm:py-3 bg-[#FF7B7B] hover:bg-[#FF6565] text-white font-black text-sm sm:text-base rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
          style={{ fontFamily: "'OmuDaye', sans-serif" }}
        >
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          <span>투표 종료 & 결과 보기</span>
        </button>
      </section>
    </div>
  );
};

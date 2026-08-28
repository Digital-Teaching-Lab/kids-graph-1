import React, { useState } from 'react';
import { motion } from 'motion/react';
import { VoteOption, PresetTopic } from '../types';
import { PASTEL_COLORS, COLOR_KEYS, getColor, getColorByIndex } from '../constants/colors';
import { PRESET_TOPICS } from '../constants/presets';
import { EmojiPickerModal } from './EmojiPickerModal';
import { playTapSound } from '../utils/audio';
import {
  Plus,
  Trash2,
  Play,
  Sparkles,
  Smile,
  Palette,
  Lightbulb,
  Check,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';

interface ScreenSetupProps {
  topic: string;
  setTopic: (topic: string) => void;
  options: VoteOption[];
  setOptions: React.Dispatch<React.SetStateAction<VoteOption[]>>;
  maxVotesPerPerson: number;
  setMaxVotesPerPerson: (num: number) => void;
  onStartVoting: () => void;
  soundEnabled: boolean;
}

export const ScreenSetup: React.FC<ScreenSetupProps> = ({
  topic,
  setTopic,
  options,
  setOptions,
  maxVotesPerPerson,
  setMaxVotesPerPerson,
  onStartVoting,
  soundEnabled,
}) => {
  const [editingEmojiIndex, setEditingEmojiIndex] = useState<number | null>(null);
  const [showPresets, setShowPresets] = useState(false);

  // Add a new item (min 2, max 8)
  const handleAddOption = () => {
    if (options.length >= 8) return;
    playTapSound(soundEnabled);

    const nextIndex = options.length;
    const defaultColorKey = COLOR_KEYS[nextIndex % COLOR_KEYS.length];
    const defaultEmojis = ['⭐', '🎈', '💖', '🍭', '🚀', '🌺', '🍀', '🎵'];

    const newOption: VoteOption = {
      id: `opt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: `선택지 ${nextIndex + 1}`,
      emoji: defaultEmojis[nextIndex % defaultEmojis.length],
      colorKey: defaultColorKey,
      votes: 0,
    };

    setOptions([...options, newOption]);
  };

  // Reset all options to 2 clean initial blank items
  const handleResetOptions = () => {
    playTapSound(soundEnabled);
    setOptions([
      {
        id: `opt-${Date.now()}-1`,
        title: '',
        emoji: '',
        colorKey: COLOR_KEYS[0],
        votes: 0,
      },
      {
        id: `opt-${Date.now()}-2`,
        title: '',
        emoji: '',
        colorKey: COLOR_KEYS[1],
        votes: 0,
      },
    ]);
  };

  // Remove an option
  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    playTapSound(soundEnabled);
    const newOpts = [...options];
    newOpts.splice(index, 1);
    setOptions(newOpts);
  };

  // Update option title
  const handleTitleChange = (index: number, title: string) => {
    const newOpts = [...options];
    newOpts[index].title = title;
    setOptions(newOpts);
  };

  // Update option color
  const handleColorChange = (index: number, colorKey: string) => {
    playTapSound(soundEnabled);
    const newOpts = [...options];
    newOpts[index].colorKey = colorKey;
    setOptions(newOpts);
  };

  // Select Preset Topic
  const handleSelectPreset = (preset: PresetTopic) => {
    playTapSound(soundEnabled);
    setTopic(preset.title);
    const newOptions: VoteOption[] = preset.options.map((item, i) => ({
      id: `opt-preset-${i}-${Date.now()}`,
      title: item.title,
      emoji: item.emoji,
      colorKey: item.colorKey,
      votes: 0,
    }));
    setOptions(newOptions);
    setShowPresets(false);
  };

  // Validation
  const canStart = topic.trim().length > 0 && options.length >= 2 && options.every((o) => o.title.trim().length > 0);

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
      {/* Top Banner / Topic Setting Card */}
      <section className="bg-white rounded-[28px] p-5 sm:p-7 card-vibrant-shadow border border-[#EAEAEA]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#FFEBEA] text-[#FF6B6B] font-black flex items-center justify-center text-sm border border-[#FFD5D2]">
              1
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#333333]" style={{ fontFamily: "'OmuDaye', sans-serif" }}>
              투표 주제 정하기
            </h2>
          </div>

          {/* Preset Topics Recommendation Button */}
          <button
            type="button"
            onClick={() => {
              playTapSound(soundEnabled);
              setShowPresets(!showPresets);
            }}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#F3F4F6] hover:bg-[#FFEBEA] text-[#555555] hover:text-[#FF6B6B] rounded-full font-bold text-sm transition-all border border-[#E5E7EB] self-start md:self-auto"
          >
            <Lightbulb className="w-4 h-4 text-[#FF7B7B]" />
            <span>추천 질문 목록 ({PRESET_TOPICS.length}개)</span>
          </button>
        </div>

        {/* Preset Topics Dropdown / Drawer */}
        {showPresets && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-5 p-4 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5"
          >
            {PRESET_TOPICS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="text-left p-3.5 bg-white hover:bg-[#FFEBEA]/50 rounded-xl border border-[#E5E7EB] hover:border-[#FFB7B2] transition-all shadow-2xs group flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#FF6B6B] bg-[#FFEBEA] px-2 py-0.5 rounded-md">
                    {preset.category}
                  </span>
                  <span className="text-xs text-[#999999] group-hover:text-[#FF6B6B]">선택 ➔</span>
                </div>
                <span className="text-sm font-bold text-[#333333] leading-snug">
                  {preset.title}
                </span>
                <div className="flex gap-1 mt-1 text-base">
                  {preset.options.map((o, i) => (
                    <span key={i} title={o.title}>
                      {o.emoji}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {/* Topic Input Box */}
        <div className="relative flex items-center">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="예: 친구가 되는 멋진 방법은? / 우리 반이 가장 좋아하는 과일은?"
            className="w-full px-5 py-4 text-lg sm:text-xl md:text-2xl font-black text-[#333333] bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#FFB7B2]/30 focus:border-[#FFB7B2] transition-all placeholder:text-[#999999]"
          />
        </div>
      </section>

      {/* Options Setup Section */}
      <section className="bg-white rounded-[28px] p-5 sm:p-7 card-vibrant-shadow border border-[#EAEAEA]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#FFEBEA] text-[#FF6B6B] font-black flex items-center justify-center text-sm border border-[#FFD5D2]">
              2
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#333333]" style={{ fontFamily: "'OmuDaye', sans-serif" }}>
                투표할 항목 만들기
              </h2>
              <p className="text-xs sm:text-sm text-[#777777] font-medium">
                최소 2개에서 최대 8개까지 설정할 수 있어요 (현재 {options.length}개)
              </p>
            </div>
          </div>

          {/* Action Buttons: Reset & Add */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleResetOptions}
              title="모든 항목을 초기 상태(2개 빈칸)로 비웁니다"
              className="flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#F3F4F6] hover:bg-[#FFEBEA] text-[#666666] hover:text-[#FF6B6B] border border-[#E5E7EB] hover:border-[#FFB7B2] font-black rounded-full text-xs sm:text-sm transition-all active:scale-95 shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              <span>항목 초기화</span>
            </button>

            <button
              type="button"
              onClick={handleAddOption}
              disabled={options.length >= 8}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#FFB7B2] hover:bg-[#FFA5A0] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black rounded-full text-xs sm:text-base shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
              <span>+ 항목 추가하기</span>
            </button>
          </div>
        </div>

        {/* Options List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((opt, index) => {
            const color = getColor(opt.colorKey);
            return (
              <div
                key={opt.id}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all shadow-2xs ${color.bgLight} ${color.border}`}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-black text-[#666666] px-2.5 py-0.5 bg-white rounded-lg border border-[#E5E7EB]">
                    항목 {index + 1}
                  </span>

                  {/* Right Actions: Delete */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      disabled={options.length <= 2}
                      title={options.length <= 2 ? '최소 2개 항목이 필요해요' : '항목 삭제'}
                      className="p-1.5 rounded-lg bg-white hover:bg-rose-100 disabled:opacity-30 disabled:hover:bg-white text-rose-500 border border-[#E5E7EB] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Emoji + Title Input */}
                <div className="flex items-center gap-2.5 mb-3">
                  {/* Emoji Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      playTapSound(soundEnabled);
                      setEditingEmojiIndex(index);
                    }}
                    title={opt.emoji ? "이모지 변경하기" : "이모지 추가하기"}
                    className="w-14 h-14 shrink-0 rounded-2xl bg-white border-2 border-[#E5E7EB] hover:border-[#FFB7B2] flex flex-col items-center justify-center text-3xl shadow-xs transition-transform hover:scale-105 active:scale-95 overflow-hidden"
                  >
                    {opt.emoji ? (
                      opt.emoji
                    ) : (
                      <span className="text-[11px] font-bold text-[#888888] flex flex-col items-center">
                        <span className="text-base leading-none mb-0.5">🖼️</span>
                        <span>없음</span>
                      </span>
                    )}
                  </button>

                  {/* Title Input */}
                  <input
                    type="text"
                    value={opt.title}
                    onChange={(e) => handleTitleChange(index, e.target.value)}
                    placeholder="항목 이름을 입력하세요"
                    className="flex-1 px-4 py-3 text-base sm:text-lg font-bold text-[#333333] bg-white border-2 border-[#E5E7EB] focus:border-[#FFB7B2] rounded-xl focus:outline-none shadow-2xs"
                  />
                </div>

                {/* Color Selector Pills */}
                <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-black/5">
                  <span className="text-[11px] font-bold text-[#777777] mr-1 flex items-center gap-0.5">
                    <Palette className="w-3.5 h-3.5" /> 색상:
                  </span>
                  {COLOR_KEYS.map((key) => {
                    const c = PASTEL_COLORS[key];
                    const isSelected = opt.colorKey === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleColorChange(index, key)}
                        title={c.name}
                        className={`w-6 h-6 rounded-full border-2 transition-transform ${
                          isSelected ? 'scale-120 border-[#333333] ring-2 ring-[#FFB7B2]' : 'border-white hover:scale-110'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Max Votes Per Child Setting */}
      <section className="bg-white rounded-[28px] p-5 sm:p-7 card-vibrant-shadow border border-[#EAEAEA]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#FFEBEA] text-[#FF6B6B] font-black flex items-center justify-center text-sm border border-[#FFD5D2]">
              3
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#333333]" style={{ fontFamily: "'OmuDaye', sans-serif" }}>
                한 친구당 투표 개수 (1인당 선택수)
              </h2>
              <p className="text-xs sm:text-sm text-[#777777] font-medium">
                한 아이가 몇 개까지 항목을 고를 수 있는지 정해주세요
              </p>
            </div>
          </div>
        </div>

        {/* Vote count selection pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { count: 1, label: '1개 선택', desc: '기본 (1명당 1개)', emoji: '☝️' },
            { count: 2, label: '2개 선택', desc: '2가지씩 고르기', emoji: '✌️' },
            { count: 3, label: '3개 선택', desc: '3가지씩 고르기', emoji: '🤟' },
            { count: 0, label: '자유 터치', desc: '제한 없이 콕콕', emoji: '✨' },
          ].map((item) => {
            const isSelected = maxVotesPerPerson === item.count;
            return (
              <button
                key={item.count}
                type="button"
                onClick={() => {
                  playTapSound(soundEnabled);
                  setMaxVotesPerPerson(item.count);
                }}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFEBEA] border-[#FF7B7B] shadow-sm scale-102 ring-2 ring-[#FFB7B2]/40'
                    : 'bg-[#F9FAFB] border-[#E5E7EB] hover:bg-white hover:border-[#FFB7B2]/60'
                }`}
              >
                <span className="text-2xl sm:text-3xl mb-1 select-none">{item.emoji}</span>
                <span className={`text-base sm:text-lg font-black ${isSelected ? 'text-[#FF6B6B]' : 'text-[#333333]'}`}>
                  {item.label}
                </span>
                <span className="text-xs text-[#777777] mt-0.5">{item.desc}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Bottom Floating/Fixed Action: Start Voting */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            playTapSound(soundEnabled);
            onStartVoting();
          }}
          disabled={!canStart}
          className="w-full sm:w-auto min-w-[280px] sm:min-w-[360px] py-4 sm:py-5 px-8 bg-[#FF7B7B] hover:bg-[#FF6565] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xl sm:text-2xl rounded-full shadow-md hover:shadow-lg transition-all transform active:scale-98 flex items-center justify-center gap-3"
          style={{ fontFamily: "'OmuDaye', sans-serif" }}
        >
          <Play className="w-7 h-7 fill-white text-white" />
          <span>투표 시작하기!</span>
        </button>

        {!canStart && (
          <p className="text-xs sm:text-sm font-semibold text-rose-600 flex items-center gap-1">
            <HelpCircle className="w-4 h-4" />
            주제와 2개 이상의 모든 항목 이름을 입력해주세요.
          </p>
        )}
      </div>

      {/* Emoji Picker Modal */}
      {editingEmojiIndex !== null && (
        <EmojiPickerModal
          isOpen={editingEmojiIndex !== null}
          onClose={() => setEditingEmojiIndex(null)}
          currentEmoji={options[editingEmojiIndex]?.emoji || '⭐'}
          onSelect={(emoji) => {
            if (editingEmojiIndex !== null) {
              const newOpts = [...options];
              newOpts[editingEmojiIndex].emoji = emoji;
              setOptions(newOpts);
            }
          }}
        />
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { POPULAR_EMOJIS } from '../constants/presets';
import { X, Sparkles } from 'lucide-react';

interface EmojiPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
  currentEmoji: string;
}

export const EmojiPickerModal: React.FC<EmojiPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentEmoji,
}) => {
  const [customInput, setCustomInput] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onSelect(customInput.trim());
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-[28px] p-6 w-full max-w-md card-vibrant-shadow border border-[#EAEAEA]"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF7B7B]" />
              <h3 className="text-lg sm:text-xl font-bold text-[#333333]">아이콘(이모지) 고르기</h3>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#666666] flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Top Actions: No Emoji Option & Presets */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => {
                onSelect('');
                onClose();
              }}
              className={`px-4 py-2 text-sm font-bold rounded-xl border-2 transition-all flex items-center gap-1.5 ${
                !currentEmoji
                  ? 'bg-[#FFEBEA] text-[#FF6B6B] border-[#FFB7B2] ring-2 ring-[#FFB7B2]'
                  : 'bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[#666666] border-[#E5E7EB]'
              }`}
            >
              <span>🚫</span>
              <span>이모지 사용 안 함 (없음)</span>
            </button>
            <span className="text-xs text-[#888888]">아래에서 선택하거나 직접 입력</span>
          </div>

          {/* Popular Emojis Grid */}
          <div className="grid grid-cols-6 gap-2.5 max-h-64 overflow-y-auto p-3 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB] mb-4">
            {POPULAR_EMOJIS.map((em, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onSelect(em);
                  onClose();
                }}
                className={`w-11 h-11 text-2xl flex items-center justify-center rounded-xl transition-all hover:scale-120 active:scale-95 ${
                  currentEmoji === em
                    ? 'bg-[#FFEBEA] ring-2 ring-[#FFB7B2] shadow-xs'
                    : 'bg-white hover:bg-[#FFEBEA]/50 shadow-2xs border border-[#E5E7EB]'
                }`}
              >
                {em}
              </button>
            ))}
          </div>

          {/* Custom Input */}
          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="직접 이모지나 글자 입력 (예: 🐱, 🍎)"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 px-4 py-2.5 text-base border-2 border-[#E5E7EB] rounded-full focus:outline-none focus:border-[#FFB7B2] font-medium"
              maxLength={4}
            />
            <button
              type="submit"
              disabled={!customInput.trim()}
              className="px-5 py-2.5 bg-[#FF7B7B] hover:bg-[#FF6565] disabled:opacity-40 text-white font-bold rounded-full transition-all shadow-xs"
            >
              선택
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

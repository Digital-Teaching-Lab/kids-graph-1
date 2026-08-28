import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, X, AlertTriangle } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = '모든 투표를 초기화할까요?',
  description = '지금까지 모인 모든 친구들의 투표 숫자가 0으로 돌아갑니다.',
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-[28px] p-6 sm:p-8 w-full max-w-md card-vibrant-shadow border border-[#EAEAEA] text-center"
        >
          <div className="w-16 h-16 bg-[#FFEBEA] text-[#FF6B6B] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#FFD5D2]">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-[#333333] mb-2" style={{ fontFamily: "'OmuDaye', sans-serif" }}>
            {title}
          </h3>
          <p className="text-sm sm:text-base text-[#666666] mb-6 leading-relaxed">
            {description}
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="flex-1 px-5 py-3.5 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#555555] font-bold text-base transition-colors border border-[#E5E7EB]"
            >
              취소
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-5 py-3.5 rounded-full bg-[#FF6B6B] hover:bg-[#FF5252] text-white font-bold text-base shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-5 h-5" />
              초기화하기
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

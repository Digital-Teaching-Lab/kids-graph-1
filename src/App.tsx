/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VoteOption, ScreenType } from './types';
import { PRESET_TOPICS } from './constants/presets';
import { Header } from './components/Header';
import { ScreenSetup } from './components/ScreenSetup';
import { ScreenVoting } from './components/ScreenVoting';
import { ScreenResults } from './components/ScreenResults';
import { ResetConfirmModal } from './components/ResetConfirmModal';

const STORAGE_KEY = 'our_class_graph_vote_v1';

export default function App() {
  // Initial state setup with default fruit poll
  const defaultPreset = PRESET_TOPICS[0];

  const [topic, setTopic] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.topic) return parsed.topic;
      }
    } catch {}
    return defaultPreset.title;
  });

  const [options, setOptions] = useState<VoteOption[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.options) && parsed.options.length >= 2) {
          return parsed.options;
        }
      }
    } catch {}
    return defaultPreset.options.map((opt, i) => ({
      id: `opt-init-${i}`,
      title: opt.title,
      emoji: opt.emoji,
      colorKey: opt.colorKey,
      votes: 0,
    }));
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentScreen) return parsed.currentScreen;
      }
    } catch {}
    return 'setup';
  });

  const [maxVotesPerPerson, setMaxVotesPerPerson] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.maxVotesPerPerson === 'number') return parsed.maxVotesPerPerson;
      }
    } catch {}
    return 1;
  });

  const [participantCount, setParticipantCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.participantCount === 'number') return parsed.participantCount;
      }
    } catch {}
    return 0;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      const dataToSave = {
        topic,
        options,
        currentScreen,
        maxVotesPerPerson,
        participantCount,
        soundEnabled,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {}
  }, [topic, options, currentScreen, maxVotesPerPerson, participantCount, soundEnabled]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        }).catch(() => {});
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Total calculated votes
  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);

  // Reset just votes to 0
  const handleResetVotesOnly = () => {
    setOptions((prev) => prev.map((opt) => ({ ...opt, votes: 0 })));
    setParticipantCount(0);
  };

  // Reset entire session to fresh setup
  const handleResetAllToNew = () => {
    const freshPreset = PRESET_TOPICS[1];
    setTopic(freshPreset.title);
    setOptions(
      freshPreset.options.map((opt, i) => ({
        id: `opt-fresh-${i}-${Date.now()}`,
        title: opt.title,
        emoji: opt.emoji,
        colorKey: opt.colorKey,
        votes: 0,
      }))
    );
    setParticipantCount(0);
    setCurrentScreen('setup');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-[#444444] flex flex-col font-sans selection:bg-[#FFB7B2]/40">
      {/* Header Bar */}
      <Header
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        totalVotes={totalVotes}
        participantCount={participantCount}
        onOpenResetModal={() => setIsResetModalOpen(true)}
      />

      {/* Main Content Area with Page Transitions */}
      <main className="flex-1 flex flex-col justify-start">
        <AnimatePresence mode="wait">
          {currentScreen === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <ScreenSetup
                topic={topic}
                setTopic={setTopic}
                options={options}
                setOptions={setOptions}
                maxVotesPerPerson={maxVotesPerPerson}
                setMaxVotesPerPerson={setMaxVotesPerPerson}
                onStartVoting={() => setCurrentScreen('voting')}
                soundEnabled={soundEnabled}
              />
            </motion.div>
          )}

          {currentScreen === 'voting' && (
            <motion.div
              key="voting"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <ScreenVoting
                topic={topic}
                options={options}
                setOptions={setOptions}
                maxVotesPerPerson={maxVotesPerPerson}
                participantCount={participantCount}
                setParticipantCount={setParticipantCount}
                onFinishVoting={() => setCurrentScreen('results')}
                soundEnabled={soundEnabled}
              />
            </motion.div>
          )}

          {currentScreen === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <ScreenResults
                topic={topic}
                options={options}
                participantCount={participantCount}
                onNavigate={setCurrentScreen}
                onResetVotes={handleResetVotesOnly}
                onResetAll={handleResetAllToNew}
                soundEnabled={soundEnabled}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetVotesOnly}
      />
    </div>
  );
}

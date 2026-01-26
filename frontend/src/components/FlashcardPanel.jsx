import React, { useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

const FlipCard = ({ front, back, index }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    // Different gradient combinations for each card
    const gradients = [
        'from-purple-500/20 via-pink-500/20 to-red-500/20',
        'from-blue-500/20 via-cyan-500/20 to-teal-500/20',
        'from-orange-500/20 via-yellow-500/20 to-amber-500/20',
        'from-green-500/20 via-emerald-500/20 to-lime-500/20',
        'from-indigo-500/20 via-purple-500/20 to-pink-500/20',
    ];

    const borderGradients = [
        'from-purple-400/50 to-pink-400/50',
        'from-blue-400/50 to-cyan-400/50',
        'from-orange-400/50 to-yellow-400/50',
        'from-green-400/50 to-emerald-400/50',
        'from-indigo-400/50 to-purple-400/50',
    ];

    const accentColors = [
        'text-purple-400',
        'text-blue-400',
        'text-orange-400',
        'text-green-400',
        'text-indigo-400',
    ];

    const gradient = gradients[index % gradients.length];
    const borderGradient = borderGradients[index % borderGradients.length];
    const accentColor = accentColors[index % accentColors.length];

    return (
        <div
            className="perspective-1000 h-64 cursor-pointer group"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

                {/* Front */}
                <div className={`absolute w-full h-full backface-hidden backdrop-blur-md bg-gradient-to-br ${gradient} border-2 border-transparent bg-clip-padding rounded-2xl p-6 flex flex-col justify-between shadow-lg group-hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${borderGradient} opacity-50 -z-10 blur-sm`}></div>

                    <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                            <Sparkles className={`w-4 h-4 ${accentColor}`} />
                            <span className={`text-xs font-mono ${accentColor} uppercase tracking-widest`}>
                                Card {index + 1}
                            </span>
                        </div>
                        <RotateCcw className={`w-4 h-4 ${accentColor} opacity-50 group-hover:rotate-180 transition-transform duration-500`} />
                    </div>

                    <div className="flex-1 flex items-center justify-center px-4">
                        <p className="text-slate-800 dark:text-white font-bold text-xl text-center leading-relaxed">
                            {front}
                        </p>
                    </div>

                    <div className="text-center">
                        <p className={`text-xs ${accentColor} font-medium`}>
                            Click to reveal answer
                        </p>
                    </div>
                </div>

                {/* Back */}
                <div className={`absolute w-full h-full backface-hidden rotate-y-180 backdrop-blur-md bg-gradient-to-br ${gradient} border-2 border-transparent bg-clip-padding rounded-2xl p-6 flex flex-col justify-center items-center shadow-lg text-center`}>
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${borderGradient} opacity-50 -z-10 blur-sm`}></div>

                    <div className={`mb-4 p-3 rounded-full bg-white/10 ${accentColor}`}>
                        <Sparkles className="w-6 h-6" />
                    </div>

                    <p className="text-slate-800 dark:text-white font-semibold text-lg leading-relaxed px-4">
                        {back}
                    </p>

                    <div className="mt-6">
                        <p className={`text-xs ${accentColor} font-medium`}>
                            Click to flip back
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

const FlashcardPanel = ({ flashcards }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'single'

    return (
        <div className="space-y-6">
            {/* View Mode Toggle */}
            <div className="flex justify-center space-x-4">
                <button
                    onClick={() => setViewMode('grid')}
                    className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${viewMode === 'grid'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                            : 'bg-white/10 text-slate-400 hover:bg-white/20'
                        }`}
                >
                    Grid View
                </button>
                <button
                    onClick={() => setViewMode('single')}
                    className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${viewMode === 'single'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                            : 'bg-white/10 text-slate-400 hover:bg-white/20'
                        }`}
                >
                    Focus Mode
                </button>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                    {flashcards.map((card, idx) => (
                        <FlipCard key={idx} front={card.front} back={card.back} index={idx} />
                    ))}
                </div>
            )}

            {/* Single Card Focus Mode */}
            {viewMode === 'single' && (
                <div className="space-y-6 animate-fade-in-up">
                    <div className="flex justify-center">
                        <div className="w-full max-w-md">
                            <FlipCard
                                front={flashcards[currentIndex].front}
                                back={flashcards[currentIndex].back}
                                index={currentIndex}
                            />
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-center space-x-4">
                        <button
                            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                            disabled={currentIndex === 0}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-semibold transition-all duration-300"
                        >
                            ← Previous
                        </button>

                        <span className="text-slate-600 dark:text-slate-400 font-medium">
                            {currentIndex + 1} / {flashcards.length}
                        </span>

                        <button
                            onClick={() => setCurrentIndex(Math.min(flashcards.length - 1, currentIndex + 1))}
                            disabled={currentIndex === flashcards.length - 1}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-semibold transition-all duration-300"
                        >
                            Next →
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full max-w-md mx-auto">
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                                style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlashcardPanel;

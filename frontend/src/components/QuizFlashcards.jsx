import React, { useState } from 'react';
import { Download, HelpCircle, Layers } from 'lucide-react';

const QuizFlashcards = ({ quiz, flashcards, onDownloadPdf }) => {
    const [activeTab, setActiveTab] = useState('quiz');

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex space-x-2 bg-slate-900/50 p-1 rounded-xl">
                <button
                    onClick={() => setActiveTab('quiz')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'quiz'
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                >
                    <div className="flex items-center justify-center space-x-2">
                        <HelpCircle className="w-4 h-4" />
                        <span>Quiz ({quiz.length})</span>
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('flashcards')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'flashcards'
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                >
                    <div className="flex items-center justify-center space-x-2">
                        <Layers className="w-4 h-4" />
                        <span>Flashcards ({flashcards.length})</span>
                    </div>
                </button>
            </div>

            <div className="min-h-[300px]">
                {activeTab === 'quiz' && (
                    <div className="space-y-4">
                        {quiz.map((q, idx) => (
                            <div key={idx} className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl space-y-3">
                                <div className="flex space-x-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                                        {idx + 1}
                                    </span>
                                    <h3 className="text-slate-200 font-medium">{q.question}</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-9">
                                    {q.options.map((opt, i) => (
                                        <div key={i} className="p-2 rounded-lg bg-slate-900/50 border border-slate-800 text-sm text-slate-400 hover:border-blue-500/30 transition-colors cursor-pointer">
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'flashcards' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {flashcards.map((card, idx) => (
                            <FlipCard key={idx} front={card.front} back={card.back} index={idx} />
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={onDownloadPdf}
                className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-purple-500/25 transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-3"
            >
                <Download className="w-6 h-6" />
                <span>Download Full PDF Report</span>
            </button>
        </div>
    );
};

const FlipCard = ({ front, back, index }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className="perspective-1000 h-48 cursor-pointer group"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

                {/* Front */}
                <div className="absolute w-full h-full backface-hidden bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col justify-between shadow-lg group-hover:border-purple-500/50 transition-colors">
                    <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">Flashcard {index + 1}</span>
                    <p className="text-slate-200 font-medium text-center">{front}</p>
                    <p className="text-xs text-slate-500 text-center">Click to reveal</p>
                </div>

                {/* Back */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-purple-900/50 to-slate-900 border border-purple-500/30 rounded-xl p-6 flex flex-col justify-center items-center shadow-lg text-center">
                    <p className="text-white font-medium">{back}</p>
                </div>

            </div>
        </div>
    );
};

export default QuizFlashcards;

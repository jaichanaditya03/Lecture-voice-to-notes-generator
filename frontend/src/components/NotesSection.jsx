import React from 'react';
import { Sparkles, BrainCircuit } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const NotesSection = ({ notes, onGenerateQuiz, isGeneratingQuiz }) => {
    return (
        <div className="space-y-4 animate-fade-in-up">
            <div className="flex items-center space-x-2 text-slate-200 mb-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-semibold">AI Summary & Notes</h2>
            </div>

            <textarea
                readOnly
                value={notes}
                className="w-full h-96 bg-slate-900/50 border border-slate-700 rounded-xl p-6 text-slate-300 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none resize-none custom-scrollbar leading-relaxed font-serif"
                placeholder="Generated notes will appear here..."
            />

            <button
                onClick={onGenerateQuiz}
                disabled={isGeneratingQuiz || !notes}
                className={`w-full py-3 rounded-xl font-semibold text-base shadow-lg transition-all duration-300 flex items-center justify-center space-x-2
          ${isGeneratingQuiz || !notes
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white hover:shadow-emerald-500/25'
                    }
        `}
            >
                {isGeneratingQuiz ? (
                    <>
                        <LoadingSpinner size={20} />
                        <span>Creating Learning Materials...</span>
                    </>
                ) : (
                    <>
                        <BrainCircuit className="w-5 h-5" />
                        <span>Generate Quiz & Flashcards</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default NotesSection;

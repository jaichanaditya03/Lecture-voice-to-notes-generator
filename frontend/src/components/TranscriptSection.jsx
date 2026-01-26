import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const TranscriptSection = ({ transcript, onGenerateNotes, isGeneratingNotes }) => {
    return (
        <div className="space-y-4 animate-fade-in-up">
            <div className="flex items-center space-x-2 text-slate-200 mb-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold">Transcript</h2>
            </div>

            <div className="relative">
                <textarea
                    readOnly
                    value={transcript}
                    className="w-full h-64 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-300 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none resize-none custom-scrollbar leading-relaxed"
                    placeholder="Transcript will appear here..."
                />
                <div className="absolute bottom-4 right-4 text-xs text-slate-500 bg-slate-900/80 px-2 py-1 rounded">
                    {transcript.length} characters
                </div>
            </div>

            <button
                onClick={onGenerateNotes}
                disabled={isGeneratingNotes || !transcript}
                className={`w-full py-3 rounded-xl font-semibold text-base shadow-lg transition-all duration-300 flex items-center justify-center space-x-2
          ${isGeneratingNotes || !transcript
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 hover:border-slate-500'
                    }
        `}
            >
                {isGeneratingNotes ? (
                    <>
                        <LoadingSpinner size={20} />
                        <span>Analyzing & Generating Notes...</span>
                    </>
                ) : (
                    <>
                        <span>Generate Notes</span>
                        <ArrowRight className="w-4 h-4" />
                    </>
                )}
            </button>
        </div>
    );
};

export default TranscriptSection;

import React from 'react';
import { FileText } from 'lucide-react';

const TranscriptBox = ({ transcript, setTranscript }) => {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-lg shadow-blue-500/30">
                    <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Transcript</h2>
            </div>

            <div className="relative backdrop-blur-md bg-white/10 dark:bg-white/10 border border-white/20 dark:border-white/20 rounded-2xl p-6 shadow-xl">
                <textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    className="w-full h-64 bg-transparent text-slate-700 dark:text-slate-300 font-mono text-sm leading-relaxed focus:outline-none resize-none custom-scrollbar"
                    placeholder="Your transcript will appear here... (You can edit this text)"
                />
                <div className="absolute bottom-4 right-6 text-xs text-slate-500 dark:text-slate-500 bg-white/50 dark:bg-slate-900/50 px-3 py-1 rounded-full backdrop-blur-sm">
                    {transcript.length} characters
                </div>
            </div>
        </div>
    );
};

export default TranscriptBox;

import React from 'react';
import { Sparkles } from 'lucide-react';

const NotesBox = ({ notes }) => {
    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg shadow-lg shadow-pink-500/30">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">AI Summary & Notes</h2>
            </div>

            <div className="backdrop-blur-md bg-white/10 dark:bg-white/10 border border-white/20 dark:border-white/20 rounded-2xl p-6 shadow-xl">
                <div className="prose prose-invert max-w-none">
                    <textarea
                        readOnly
                        value={notes}
                        className="w-full h-96 bg-transparent text-slate-700 dark:text-slate-300 leading-relaxed focus:outline-none resize-none custom-scrollbar"
                        placeholder="AI-generated notes will appear here..."
                    />
                </div>
            </div>
        </div>
    );
};

export default NotesBox;

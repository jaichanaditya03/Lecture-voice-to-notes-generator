import React from 'react';
import { Mic } from 'lucide-react';

const Header = () => {
    return (
        <header className="text-center mb-10 space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-2">
                <div className="p-3 bg-blue-500/10 rounded-full ring-1 ring-blue-500/50 backdrop-blur-md">
                    <Mic className="w-8 h-8 text-blue-400" />
                </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
                    Lecture Voice-to-Notes
                </span>{' '}
                <span className="text-slate-200">Generator</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Transform your audio lectures into concise notes, quizzes, and flashcards instantly with AI.
            </p>
        </header>
    );
};

export default Header;

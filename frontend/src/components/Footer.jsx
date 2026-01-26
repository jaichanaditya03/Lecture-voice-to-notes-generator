import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="mt-20 py-8 border-t border-white/10 dark:border-white/10">
            <div className="container mx-auto px-6 text-center space-y-3">
                <div className="flex items-center justify-center space-x-2 text-slate-600 dark:text-slate-400">
                    <span>Built with</span>
                    <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                    <span>using</span>
                    <span className="font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        FastAPI + React + AI
                    </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                    Lecture AI Generator. Transform your learning experience.
                </p>
            </div>
        </footer>
    );
};

export default Footer;

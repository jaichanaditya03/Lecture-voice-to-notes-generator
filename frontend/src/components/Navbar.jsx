import React, { useEffect } from 'react';
import { Mic } from 'lucide-react';

const Navbar = () => {
    // Force dark mode on mount
    useEffect(() => {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }, []);

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 dark:bg-slate-900/80 border-b border-white/20 dark:border-white/10">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-lg shadow-purple-500/30">
                            <Mic className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                            Notes AI Generator
                        </h1>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

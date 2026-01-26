import React, { useState } from 'react';
import { Upload, FileAudio } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const AudioUploader = ({ onFileSelect, onTranscribe, isTranscribing, selectedFile }) => {
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="relative group cursor-pointer">
                <input
                    type="file"
                    accept=".mp3,.wav,.m4a"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                    disabled={isTranscribing}
                />
                <div className={`
          border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300
          ${selectedFile
                        ? 'border-emerald-500/50 bg-emerald-500/5'
                        : 'border-slate-600 hover:border-blue-400 hover:bg-slate-800/50'
                    }
        `}>
                    <div className="flex flex-col items-center space-y-4">
                        <div className={`p-4 rounded-full transition-colors ${selectedFile ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400 group-hover:bg-blue-500/20 group-hover:text-blue-400'}`}>
                            {selectedFile ? <FileAudio className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                        </div>
                        <div>
                            <p className="text-lg font-medium text-slate-200">
                                {selectedFile ? selectedFile.name : 'Drop your audio file here'}
                            </p>
                            <p className="text-sm text-slate-400 mt-1">
                                {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : 'Support for .mp3, .wav'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={onTranscribe}
                disabled={!selectedFile || isTranscribing}
                className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 flex items-center justify-center space-x-2
          ${!selectedFile || isTranscribing
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white hover:shadow-cyan-500/25 active:scale-[0.98]'
                    }
        `}
            >
                {isTranscribing ? (
                    <>
                        <LoadingSpinner size={24} />
                        <span>Transcribing Audio...</span>
                    </>
                ) : (
                    <span>Convert Speech to Text</span>
                )}
            </button>
        </div>
    );
};

export default AudioUploader;

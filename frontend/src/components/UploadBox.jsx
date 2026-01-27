import React, { useState } from 'react';
import { Upload, FileAudio, X, Mic, Square, Link as LinkIcon } from 'lucide-react';
import Button from './Button';
import { toast } from 'react-hot-toast';
import api from '../api/axios';

const UploadBox = ({ onFileSelect, onTranscribe, isTranscribing, selectedFile, onTranscriptReceived }) => {
    const [uploadMode, setUploadMode] = useState('file'); // 'file', 'system-audio', 'link'
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [linkUrl, setLinkUrl] = useState('');
    const [isFetchingLink, setIsFetchingLink] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
            setRecordedBlob(null);
        }
    };

    const clearFile = () => {
        onFileSelect(null);
        setRecordedBlob(null);
    };

    const handleFetchLink = async () => {
        if (!linkUrl) {
            toast.error('Please enter a valid URL');
            return;
        }

        setIsFetchingLink(true);
        const toastId = toast.loading('Fetching and transcribing link... (This may take a while)');

        try {
            const response = await api.post('/fetch-audio', { url: linkUrl });
            if (response.data.transcript) {
                // Success
                toast.dismiss(toastId);
                onTranscriptReceived(response.data.transcript);
            } else {
                throw new Error('No transcript returned');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to process link. Please check the URL.', { id: toastId });
        } finally {
            setIsFetchingLink(false);
        }
    };

    const startSystemAudioRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    sampleRate: 44100
                }
            });

            const audioStream = new MediaStream(stream.getAudioTracks());
            const recorder = new MediaRecorder(audioStream, {
                mimeType: 'audio/webm'
            });

            const chunks = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                const file = new File([blob], 'system-audio-recording.webm', { type: 'audio/webm' });
                setRecordedBlob(file);
                onFileSelect(file);
                stream.getTracks().forEach(track => track.stop());
                toast.success('System audio recorded!');
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
            toast.success('Recording system audio...');

        } catch (error) {
            console.error('Error accessing system audio:', error);
            toast.error('Could not access system audio.');
        }
    };

    const stopSystemAudioRecording = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Mode Selector */}
            <div className="grid grid-cols-3 gap-3 p-2 bg-white/10 dark:bg-slate-900/30 rounded-2xl backdrop-blur-md">
                <button
                    onClick={() => setUploadMode('file')}
                    className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${uploadMode === 'file'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-white/10'
                        }`}
                >
                    <Upload className="w-4 h-4" />
                    <span>Upload File</span>
                </button>

                <button
                    onClick={() => setUploadMode('system-audio')}
                    className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${uploadMode === 'system-audio'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-white/10'
                        }`}
                >
                    <Mic className="w-4 h-4" />
                    <span>Record Audio</span>
                </button>

                <button
                    onClick={() => setUploadMode('link')}
                    className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${uploadMode === 'link'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-white/10'
                        }`}
                >
                    <LinkIcon className="w-4 h-4" />
                    <span>From Link</span>
                </button>
            </div>

            {/* File Upload Mode */}
            {uploadMode === 'file' && (
                <div className="relative group">
                    {!selectedFile && (
                        <input
                            type="file"
                            accept=".mp3,.wav,.m4a,.webm"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                            disabled={isTranscribing}
                        />
                    )}

                    <div className={`
                        backdrop-blur-md bg-white/5 dark:bg-white/5 
                        border-2 border-dashed rounded-3xl p-12 text-center
                        transition-all duration-300
                        ${selectedFile
                            ? 'border-emerald-400/50 bg-emerald-500/10 shadow-lg shadow-emerald-500/20'
                            : 'border-white/20 hover:border-purple-400/50 hover:bg-white/10'
                        }
                    `}>
                        <div className="flex flex-col items-center space-y-4">
                            <div className={`
                                p-6 rounded-full transition-all duration-300
                                ${selectedFile
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30'
                                }
                            `}>
                                {selectedFile ? (
                                    <FileAudio className="w-12 h-12" />
                                ) : (
                                    <Upload className="w-12 h-12" />
                                )}
                            </div>

                            {selectedFile ? (
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2 bg-white/10 dark:bg-slate-800/50 px-4 py-2 rounded-full">
                                        <FileAudio className="w-4 h-4 text-emerald-400" />
                                        <span className="text-slate-200 dark:text-white font-medium">{selectedFile.name}</span>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                clearFile();
                                            }}
                                            className="ml-2 p-1 hover:bg-red-500/20 rounded-full transition-colors relative z-20"
                                        >
                                            <X className="w-4 h-4 text-red-400" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-slate-400">
                                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                        Drop your audio file here
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        or click to browse • Supports .mp3, .wav, .m4a, .webm
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* System Audio Recording Mode */}
            {uploadMode === 'system-audio' && (
                <div className="space-y-4">
                    <div className="backdrop-blur-md bg-white/5 dark:bg-white/5 border-2 border-white/20 rounded-3xl p-8">
                        <div className="flex flex-col items-center space-y-4">
                            <div className={`
                                p-6 rounded-full transition-all duration-300
                                ${isRecording
                                    ? 'bg-red-500/20 text-red-400 animate-pulse'
                                    : 'bg-emerald-500/20 text-emerald-400'
                                }
                            `}>
                                {isRecording ? (
                                    <Square className="w-12 h-12" />
                                ) : (
                                    <Mic className="w-12 h-12" />
                                )}
                            </div>

                            <div className="text-center space-y-2">
                                <p className="text-xl font-semibold text-slate-700 dark:text-slate-200">
                                    {isRecording ? 'Recording System Audio...' : 'Record Audio from Your Screen'}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
                                    {isRecording
                                        ? 'Play your video/audio and click Stop when finished'
                                        : 'Click Start to capture audio from YouTube, Zoom, or any app'
                                    }
                                </p>
                            </div>

                            {recordedBlob && !isRecording && (
                                <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-400/30 px-4 py-2 rounded-full">
                                    <FileAudio className="w-4 h-4 text-emerald-400" />
                                    <span className="text-emerald-300 font-medium">{recordedBlob.name}</span>
                                    <span className="text-emerald-400 text-sm">
                                        ({(recordedBlob.size / (1024 * 1024)).toFixed(2)} MB)
                                    </span>
                                </div>
                            )}

                            <div className="flex space-x-3 w-full">
                                {!isRecording ? (
                                    <Button
                                        onClick={startSystemAudioRecording}
                                        variant="success"
                                        fullWidth
                                    >
                                        Start Recording
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={stopSystemAudioRecording}
                                        variant="outline"
                                        fullWidth
                                    >
                                        Stop Recording
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Link Mode */}
            {uploadMode === 'link' && (
                <div className="space-y-4">
                    <div className="backdrop-blur-md bg-white/5 dark:bg-white/5 border-2 border-white/20 rounded-3xl p-8">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="p-6 rounded-full bg-orange-500/20 text-orange-400">
                                <LinkIcon className="w-12 h-12" />
                            </div>

                            <div className="text-center space-y-2 w-full max-w-md">
                                <p className="text-xl font-semibold text-slate-700 dark:text-slate-200">
                                    Process from Link
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                    Paste a YouTube or media URL below
                                </p>

                                <input
                                    type="text"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="https://youtube.com/watch?v=..."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                />

                                <Button
                                    onClick={handleFetchLink}
                                    loading={isFetchingLink}
                                    disabled={isFetchingLink || !linkUrl}
                                    variant="primary"
                                    fullWidth
                                    className="mt-4"
                                >
                                    Fetch & Transcribe Link
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Convert Button (shown for file/recording modes when ready) */}
            {uploadMode !== 'link' && (selectedFile || recordedBlob) && (
                <Button
                    onClick={onTranscribe}
                    disabled={isTranscribing}
                    loading={isTranscribing}
                    variant="primary"
                    fullWidth
                >
                    Convert Speech to Text
                </Button>
            )}
        </div>
    );
};

export default UploadBox;

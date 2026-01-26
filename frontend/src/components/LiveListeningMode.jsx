import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Play } from 'lucide-react';
import Button from './Button';
import { toast } from 'react-hot-toast';

const LiveListeningMode = ({ onRecordingComplete, disabled }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const [audioLevel, setAudioLevel] = useState(0);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Setup MediaRecorder
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const audioFile = new File([audioBlob], 'live-recording.wav', { type: 'audio/wav' });
                onRecordingComplete(audioFile);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());

                toast.success('Recording saved! Ready to transcribe.');
            };

            // Setup audio visualization
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            analyserRef.current = audioContextRef.current.createAnalyser();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            source.connect(analyserRef.current);
            analyserRef.current.fftSize = 256;

            // Start recording
            mediaRecorder.start(100); // Collect data every 100ms
            setIsRecording(true);
            setDuration(0);

            // Start timer
            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);

            // Start visualization
            visualize();

            toast.success('Recording started!');
        } catch (error) {
            console.error('Error accessing microphone:', error);
            toast.error('Could not access microphone. Please check permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }

            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }

            if (audioContextRef.current) {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }

            setAudioLevel(0);
            toast.loading('Processing recording...', { duration: 1000 });
        }
    };

    const visualize = () => {
        if (!analyserRef.current) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
            analyserRef.current.getByteFrequencyData(dataArray);

            // Calculate average volume
            const average = dataArray.reduce((a, b) => a + b) / bufferLength;
            setAudioLevel(average / 255); // Normalize to 0-1
        };

        draw();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="backdrop-blur-md bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-3xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg shadow-purple-500/30">
                    <Mic className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Live Listening Mode</h3>
            </div>

            <div className="space-y-6">
                {/* Microphone Visualizer */}
                <div className="flex items-center justify-center space-x-2 h-24">
                    <div className={`
            p-8 rounded-full transition-all duration-300
            ${isRecording
                            ? 'bg-gradient-to-br from-red-500 to-pink-500 shadow-2xl shadow-red-500/50 animate-pulse'
                            : 'bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/30'
                        }
          `}>
                        <Mic className={`w-12 h-12 text-white ${isRecording ? 'animate-pulse' : ''}`} />
                    </div>

                    {/* Waveform Equalizer */}
                    {isRecording && (
                        <div className="flex items-center space-x-1 ml-8">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-2 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full transition-all duration-100"
                                    style={{
                                        height: `${20 + audioLevel * 60 * (1 + Math.sin(Date.now() / 100 + i) * 0.5)}px`,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Timer */}
                {isRecording && (
                    <div className="text-center">
                        <div className="inline-flex items-center space-x-2 bg-red-500/20 border border-red-400/30 px-6 py-3 rounded-full">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-2xl font-mono font-bold text-slate-800 dark:text-white">
                                {formatTime(duration)}
                            </span>
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className="grid grid-cols-2 gap-4">
                    <Button
                        onClick={startRecording}
                        disabled={isRecording || disabled}
                        variant="success"
                        icon={Play}
                    >
                        Start Listening
                    </Button>

                    <Button
                        onClick={stopRecording}
                        disabled={!isRecording}
                        variant="outline"
                        icon={Square}
                    >
                        Stop Listening
                    </Button>
                </div>

                <p className="text-sm text-center text-slate-600 dark:text-slate-400">
                    {isRecording
                        ? '🎙️ Recording in progress... Speak clearly into your microphone'
                        : '🎤 Click "Start Listening" to begin recording your lecture'
                    }
                </p>
            </div>
        </div>
    );
};

export default LiveListeningMode;

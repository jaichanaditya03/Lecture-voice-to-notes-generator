import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Download, ArrowRight, ArrowLeft, Home } from 'lucide-react';
import Navbar from './components/Navbar';
import UploadBox from './components/UploadBox';
import TranscriptBox from './components/TranscriptBox';
import NotesBox from './components/NotesBox';
import QuizPanel from './components/QuizPanel';
import FlashcardPanel from './components/FlashcardPanel';
import Button from './components/Button';
import api from './api/axios';
import { generatePDF } from './utils/pdfGenerator';
import AnimatedBackground from './components/AnimatedBackground';

function App() {
  // Current step in the workflow
  const [currentStep, setCurrentStep] = useState(1);

  // State for data
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [notes, setNotes] = useState('');
  const [quiz, setQuiz] = useState([]);
  const [flashcards, setFlashcards] = useState([]);

  // State for UI/Loading flow
  const [loadingStep, setLoadingStep] = useState(null);

  // Handlers
  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setTranscript('');
    setNotes('');
    setQuiz([]);
    setFlashcards([]);
    setCurrentStep(1);
  };

  const handleTranscribe = async () => {
    if (!file) return;
    setLoadingStep('transcribing');
    const toastId = toast.loading('Transcribing audio...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/transcribe', formData);
      setTranscript(response.data.transcript);
      toast.success('Audio transcribed successfully!', { id: toastId });
      setCurrentStep(2); // Move to transcript step
    } catch (error) {
      console.error(error);

      // Check if it's a timeout error
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        toast.error('Transcription is taking longer than expected. The file might be too large or the server is busy. Please try again or use a smaller file.', {
          id: toastId,
          duration: 6000
        });
      } else {
        toast.error(`Failed to transcribe audio: ${error.response?.data?.error || error.message}`, { id: toastId });
      }

      // MOCK DATA FOR DEMO
      if (import.meta.env.DEV) {
        setTimeout(() => {
          setTranscript("This is a simulated transcript of a lecture about Artificial Intelligence. AI is transforming the world through machine learning, neural networks, and deep learning algorithms. Key concepts include supervised learning, unsupervised learning, and reinforcement learning.");
          setCurrentStep(2);
          setLoadingStep(null);
          toast.dismiss(toastId);
        }, 1500);
        return;
      }
    } finally {
      setLoadingStep(null);
    }
  };

  const handleGenerateNotes = async () => {
    setLoadingStep('notes');
    const toastId = toast.loading('Generating summary...');
    try {
      const response = await api.post('/summarize', { transcript });
      setNotes(response.data.summary);
      toast.success('Notes generated successfully!', { id: toastId });
      setCurrentStep(3); // Move to notes step
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate notes.', { id: toastId });
      // MOCK DATA
      if (import.meta.env.DEV) {
        setTimeout(() => {
          setNotes("# Lecture Notes: AI Overview\n\n## Key Concepts\n- **Artificial Intelligence**: The simulation of human intelligence by machines\n- **Machine Learning**: Algorithms that improve through experience\n- **Neural Networks**: Computing systems inspired by biological neural networks\n- **Deep Learning**: ML techniques using multiple layers\n\n## Learning Types\n1. Supervised Learning\n2. Unsupervised Learning\n3. Reinforcement Learning");
          setCurrentStep(3);
          setLoadingStep(null);
          toast.dismiss(toastId);
        }, 1500);
        return;
      }
    } finally {
      setLoadingStep(null);
    }
  };

  const handleGenerateQuiz = async () => {
    setLoadingStep('quiz');
    const toastId = toast.loading('Creating quiz & flashcards...');
    try {
      const response = await api.post('/quiz', { notes, transcript });
      setQuiz(response.data.quiz);
      setFlashcards(response.data.flashcards);
      toast.success('Quiz and Flashcards ready!', { id: toastId });
      setCurrentStep(4); // Move to quiz step
    } catch (error) {
      console.error(error);
      toast.error('Error creating quiz.', { id: toastId });
      // MOCK DATA
      if (import.meta.env.DEV) {
        setTimeout(() => {
          setQuiz([
            { question: "What is Artificial Intelligence?", options: ["Simulation of human intelligence", "A programming language", "A database system", "An operating system"], answer: "Simulation of human intelligence" },
            { question: "Which learning type uses labeled data?", options: ["Unsupervised Learning", "Supervised Learning", "Reinforcement Learning", "Transfer Learning"], answer: "Supervised Learning" },
            { question: "What are Neural Networks inspired by?", options: ["Computer circuits", "Biological neural networks", "Mathematical equations", "Cloud computing"], answer: "Biological neural networks" },
            { question: "What is Deep Learning?", options: ["Surface-level analysis", "ML with multiple layers", "Basic programming", "Data storage"], answer: "ML with multiple layers" },
            { question: "Which is NOT a learning type?", options: ["Supervised", "Unsupervised", "Reinforcement", "Distributed"], answer: "Distributed" },
          ]);
          setFlashcards([
            { front: "What is AI?", back: "Artificial Intelligence - simulation of human intelligence by machines" },
            { front: "What is ML?", back: "Machine Learning - algorithms that improve through experience" },
            { front: "Neural Networks", back: "Computing systems inspired by biological neural networks" },
            { front: "Deep Learning", back: "ML techniques using multiple layers of neural networks" },
            { front: "Supervised Learning", back: "Learning from labeled training data" },
          ]);
          setCurrentStep(4);
          setLoadingStep(null);
          toast.dismiss(toastId);
        }, 1500);
        return;
      }
    } finally {
      setLoadingStep(null);
    }
  };

  const handleDownloadPdf = async () => {
    // Prompt user for filename
    const defaultName = `lecture_notes_${new Date().toLocaleDateString().replace(/\//g, '-')}`;
    const fileName = prompt('Enter a name for your PDF:', defaultName);

    // If user cancels, don't download
    if (fileName === null) {
      return;
    }

    // Use default if empty
    const finalFileName = fileName.trim() || defaultName;

    setLoadingStep('pdf');
    const toastId = toast.loading('Generating PDF...');
    try {
      generatePDF(transcript, notes, quiz, flashcards, finalFileName);
      toast.success('PDF Downloaded!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Download failed.', { id: toastId });
    } finally {
      setLoadingStep(null);
    }
  };

  const [activeTab, setActiveTab] = useState('quiz');

  // Step indicator
  const steps = [
    { number: 1, title: 'Upload', completed: currentStep > 1 },
    { number: 2, title: 'Transcript', completed: currentStep > 2 },
    { number: 3, title: 'Notes', completed: currentStep > 3 },
    { number: 4, title: 'Quiz', completed: currentStep > 4 },
  ];

  const handleTranscriptReceived = (text) => {
    setTranscript(text);
    toast.dismiss(); // Dismiss loading toast if any
    toast.success('Transcript loaded successfully!');
    setCurrentStep(2);
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.9)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <AnimatedBackground />

      <Navbar />

      <div className="container mx-auto px-6 py-12 max-w-5xl">

        {/* Progress Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300
                    ${currentStep === step.number
                      ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50 scale-110'
                      : step.completed
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/20 dark:bg-slate-800/50 text-slate-400'
                    }
                  `}>
                    {step.completed ? '✓' : step.number}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${currentStep === step.number ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-slate-500'
                    }`}>
                    {step.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${step.completed ? 'bg-emerald-500' : 'bg-white/20 dark:bg-slate-800/50'
                    }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content Card */}
        <div className="backdrop-blur-xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-3xl shadow-2xl p-8 md:p-12 min-h-[500px]">

          {/* Step 1: Upload */}
          {currentStep === 1 && (
            <div className="animate-fade-in-up">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4 text-center">
                Upload Your Lecture Audio
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-center mb-8">
                Upload an audio file, record live, or paste a link to get started
              </p>
              <UploadBox
                selectedFile={file}
                onFileSelect={handleFileSelect}
                onTranscribe={handleTranscribe}
                isTranscribing={loadingStep === 'transcribing'}
                onTranscriptReceived={handleTranscriptReceived}
              />
            </div>
          )}

          {/* Step 2: Transcript */}
          {currentStep === 2 && (
            <div className="animate-fade-in-up">
              <TranscriptBox
                transcript={transcript}
                setTranscript={setTranscript}
                onGenerateNotes={handleGenerateNotes}
                isGeneratingNotes={loadingStep === 'notes'}
              />
              <div className="flex justify-between mt-8">
                <Button onClick={() => setCurrentStep(1)} variant="outline" icon={ArrowLeft}>
                  Back
                </Button>
                <Button onClick={handleGenerateNotes} loading={loadingStep === 'notes'} icon={ArrowRight}>
                  Generate Notes
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Notes */}
          {currentStep === 3 && (
            <div className="animate-fade-in-up">
              <NotesBox notes={notes} onGenerateQuiz={handleGenerateQuiz} isGeneratingQuiz={loadingStep === 'quiz'} />
              <div className="flex justify-between mt-8">
                <Button onClick={() => setCurrentStep(2)} variant="outline" icon={ArrowLeft}>
                  Back
                </Button>
                <Button onClick={handleGenerateQuiz} loading={loadingStep === 'quiz'} icon={ArrowRight}>
                  Generate Quiz
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Quiz & Flashcards */}
          {currentStep === 4 && (
            <div className="animate-fade-in-up space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
                  Test Your Knowledge
                </h2>
                <Button onClick={() => setCurrentStep(1)} variant="outline" icon={Home}>
                  Start Over
                </Button>
              </div>

              {/* Tab Selector */}
              <div className="flex space-x-2 bg-white/20 dark:bg-slate-900/30 p-2 rounded-2xl backdrop-blur-md">
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'quiz'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/20 dark:hover:bg-slate-800/50'
                    }`}
                >
                  Quiz ({quiz.length})
                </button>
                <button
                  onClick={() => setActiveTab('flashcards')}
                  className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'flashcards'
                    ? 'bg-gradient-to-r from-pink-600 to-orange-600 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/20 dark:hover:bg-slate-800/50'
                    }`}
                >
                  Flashcards ({flashcards.length})
                </button>
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                {activeTab === 'quiz' && <QuizPanel quiz={quiz} />}
                {activeTab === 'flashcards' && <FlashcardPanel flashcards={flashcards} />}
              </div>

              {/* Download Button */}
              <div className="flex justify-between">
                <Button onClick={() => setCurrentStep(3)} variant="outline" icon={ArrowLeft}>
                  Back to Notes
                </Button>
                <Button onClick={handleDownloadPdf} variant="success" icon={Download}>
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

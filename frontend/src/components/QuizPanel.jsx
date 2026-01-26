import React, { useState } from 'react';
import { CheckCircle2, Circle, XCircle } from 'lucide-react';

const QuizPanel = ({ quiz }) => {
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState({});

    const handleOptionClick = (questionIndex, option) => {
        // Don't allow changing answer after submission
        if (showResults[questionIndex]) return;

        setSelectedAnswers(prev => ({
            ...prev,
            [questionIndex]: option
        }));
    };

    const handleSubmitAnswer = (questionIndex) => {
        if (!selectedAnswers[questionIndex]) return;

        setShowResults(prev => ({
            ...prev,
            [questionIndex]: true
        }));
    };

    const resetQuestion = (questionIndex) => {
        setSelectedAnswers(prev => {
            const newAnswers = { ...prev };
            delete newAnswers[questionIndex];
            return newAnswers;
        });
        setShowResults(prev => {
            const newResults = { ...prev };
            delete newResults[questionIndex];
            return newResults;
        });
    };

    return (
        <div className="space-y-4">
            {quiz.map((q, idx) => {
                const userAnswer = selectedAnswers[idx];
                const isSubmitted = showResults[idx];
                const isCorrect = isSubmitted && userAnswer === q.answer;
                const isWrong = isSubmitted && userAnswer !== q.answer;

                return (
                    <div
                        key={idx}
                        className="backdrop-blur-md bg-white/10 dark:bg-white/10 border border-white/20 dark:border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex space-x-4 mb-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                                {idx + 1}
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex-1">{q.question}</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-12 mb-4">
                            {q.options.map((opt, i) => {
                                const isThisCorrect = opt === q.answer;
                                const isSelected = userAnswer === opt;

                                let optionClass = 'p-3 rounded-xl border transition-all duration-300 cursor-pointer ';

                                if (isSubmitted) {
                                    // After submission, show correct/wrong
                                    if (isThisCorrect) {
                                        optionClass += 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300';
                                    } else if (isSelected && isWrong) {
                                        optionClass += 'bg-red-500/20 border-red-400/50 text-red-300';
                                    } else {
                                        optionClass += 'bg-white/5 dark:bg-slate-800/30 border-white/10 dark:border-slate-700 text-slate-600 dark:text-slate-400 opacity-50';
                                    }
                                } else {
                                    // Before submission
                                    if (isSelected) {
                                        optionClass += 'bg-purple-500/20 border-purple-400/50 text-purple-300 scale-105';
                                    } else {
                                        optionClass += 'bg-white/5 dark:bg-slate-800/30 border-white/10 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-white/10 dark:hover:bg-slate-800/50 hover:border-purple-400/30';
                                    }
                                }

                                return (
                                    <div
                                        key={i}
                                        className={optionClass}
                                        onClick={() => handleOptionClick(idx, opt)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            {isSubmitted ? (
                                                isThisCorrect ? (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                ) : isSelected && isWrong ? (
                                                    <XCircle className="w-4 h-4 text-red-400" />
                                                ) : (
                                                    <Circle className="w-4 h-4" />
                                                )
                                            ) : (
                                                <Circle className={`w-4 h-4 ${isSelected ? 'text-purple-400' : ''}`} />
                                            )}
                                            <span className="text-sm font-medium">{opt}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Action Buttons */}
                        <div className="ml-12 flex space-x-3">
                            {!isSubmitted ? (
                                <button
                                    onClick={() => handleSubmitAnswer(idx)}
                                    disabled={!userAnswer}
                                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-full font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                                >
                                    Submit Answer
                                </button>
                            ) : (
                                <>
                                    <div className={`px-4 py-2 rounded-full font-semibold text-sm ${isCorrect
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50'
                                        : 'bg-red-500/20 text-red-300 border border-red-400/50'
                                        }`}>
                                        {isCorrect ? 'Correct!' : 'Incorrect'}
                                    </div>
                                    <button
                                        onClick={() => resetQuestion(idx)}
                                        className="px-6 py-2 bg-white/10 hover:bg-white/20 text-slate-300 rounded-full font-semibold text-sm transition-all duration-300"
                                    >
                                        Try Again
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default QuizPanel;

import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const Button = ({
    children,
    onClick,
    disabled,
    loading,
    variant = 'primary',
    icon: Icon,
    fullWidth = false
}) => {
    const variants = {
        primary: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/30',
        secondary: 'bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-500 hover:to-orange-500 text-white shadow-lg shadow-pink-500/30',
        success: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/30',
        outline: 'bg-white/5 backdrop-blur-md border-2 border-white/20 hover:bg-white/10 text-slate-200 dark:text-white'
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        px-8 py-4 rounded-full font-semibold text-lg tracking-wide
        transition-all duration-300 transform hover:scale-105
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        flex items-center justify-center space-x-3
        relative overflow-hidden group
      `}
        >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            {loading ? (
                <>
                    <LoadingSpinner size={24} />
                    <span>Processing...</span>
                </>
            ) : (
                <>
                    {Icon && <Icon className="w-6 h-6" />}
                    <span>{children}</span>
                </>
            )}
        </button>
    );
};

export default Button;

import { useEffect } from 'react';

const AnimatedBackground = () => {
    useEffect(() => {
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';

            // Random starting position
            const startX = Math.random() * window.innerWidth;
            const startY = window.innerHeight + 10;

            // Random size (2-4px)
            const size = Math.random() * 2 + 2;

            // Random animation duration (10-20 seconds)
            const duration = Math.random() * 10 + 10;

            // Random horizontal drift
            const drift = (Math.random() - 0.5) * 200;

            // Random color (purple, blue, pink, white)
            const colors = [
                'rgba(139, 92, 246, 0.8)',  // purple
                'rgba(59, 130, 246, 0.8)',   // blue
                'rgba(236, 72, 153, 0.8)',   // pink
                'rgba(255, 255, 255, 0.9)',  // white
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];

            particle.style.cssText = `
        position: fixed;
        left: ${startX}px;
        top: ${startY}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        box-shadow: 0 0 ${size * 2}px ${color};
        animation: floatUp ${duration}s linear forwards;
      `;

            // Add custom animation
            particle.style.setProperty('--drift', `${drift}px`);

            document.body.appendChild(particle);

            // Remove particle after animation
            setTimeout(() => {
                particle.remove();
            }, duration * 1000);
        };

        // Create particles periodically
        const interval = setInterval(createParticle, 200);

        // Create initial batch
        for (let i = 0; i < 20; i++) {
            setTimeout(createParticle, i * 100);
        }

        return () => {
            clearInterval(interval);
        };
    }, []);

    return null;
};

export default AnimatedBackground;

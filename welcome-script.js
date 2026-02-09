// ===== Get Username from Session Storage =====
document.addEventListener('DOMContentLoaded', () => {
    const username = sessionStorage.getItem('username');
    const displayUsername = document.getElementById('displayUsername');

    if (username) {
        displayUsername.textContent = username;
    } else {
        // If no username found, redirect back to login
        window.location.href = 'login.html';
        return;
    }

    // Automatically play welcome voice after a short delay
    setTimeout(() => {
        playWelcomeVoice(username);
        createConfettiCelebration();
    }, 800);

    // Auto-redirect to Bible verse page after 10 seconds
    setTimeout(() => {
        // Add fade out animation before redirect
        const container = document.querySelector('.welcome-container');
        container.style.animation = 'fadeOut 0.8s ease-out';

        setTimeout(() => {
            window.location.href = 'bible-verse.html';
        }, 800);
    }, 10000);
});

// ===== Voice-Over with Custom Audio Support =====
function playWelcomeVoice(username) {
    const voiceButton = document.getElementById('playVoice');

    // Try to play custom recorded audio first
    playCustomAudio(username, voiceButton);
}

// Play custom recorded audio files
function playCustomAudio(username, voiceButton) {
    const audio = new Audio();

    // Try specific username audio first (e.g., audio/welcome-john.mp3)
    audio.src = `audio/welcome-${username.toLowerCase()}.mp3`;

    audio.onloadeddata = () => {
        console.log('✅ Custom audio found! Playing your voice...');
        audio.play();
        voiceButton.classList.add('playing');
        animateMascotSpeaking(true);
    };

    audio.onended = () => {
        voiceButton.classList.remove('playing');
        animateMascotSpeaking(false);
    };

    audio.onerror = () => {
        console.log('⚠️ Custom audio not found, trying generic welcome audio...');
        loadGenericAudio(username, voiceButton);
    };
}

// Load generic welcome audio (fallback)
function loadGenericAudio(username, voiceButton) {
    const audio = new Audio();
    audio.src = 'audio/welcome.mp3'; // Generic welcome audio

    audio.onloadeddata = () => {
        console.log('✅ Playing generic welcome audio...');
        audio.play();
        voiceButton.classList.add('playing');
        animateMascotSpeaking(true);
    };

    audio.onended = () => {
        voiceButton.classList.remove('playing');
        animateMascotSpeaking(false);
    };

    audio.onerror = () => {
        console.log('⚠️ No audio files found, using text-to-speech...');
        playTextToSpeech(username, voiceButton);
    };
}

// Text-to-Speech fallback
function playTextToSpeech(username, voiceButton) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = `Welcome ${username}! welcome kutty pappa!`;
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 1;

        speechSynthesis.getVoices();
        utterance.onvoiceschanged = () => {
            const voices = speechSynthesis.getVoices();
            const preferredVoice = voices.find(voice =>
                // voice.name.includes('Female') ||
                // voice.name.includes('Samantha') ||
                voice.name.includes('welcome-sathyasri') ||
                voice.name.includes('Karen') ||
                voice.lang.startsWith('en')
            );
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }
        };

        utterance.onstart = () => {
            voiceButton.classList.add('playing');
            animateMascotSpeaking(true);
        };

        utterance.onend = () => {
            voiceButton.classList.remove('playing');
            animateMascotSpeaking(false);
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            voiceButton.classList.remove('playing');
            animateMascotSpeaking(false);
        };

        speechSynthesis.speak(utterance);
    } else {
        console.warn('Speech synthesis not supported in this browser');
    }
}

// ===== Mascot Speaking Animation =====
function animateMascotSpeaking(isSpeaking) {
    const mouth = document.querySelector('.mouth');

    if (isSpeaking) {
        mouth.style.animation = 'mouth-talk 0.3s infinite';

        // Add talking animation keyframes
        if (!document.getElementById('mouth-talk-animation')) {
            const style = document.createElement('style');
            style.id = 'mouth-talk-animation';
            style.textContent = `
                @keyframes mouth-talk {
                    0%, 100% {
                        transform: translateX(-50%) scaleY(1);
                        width: 50px;
                    }
                    50% {
                        transform: translateX(-50%) scaleY(0.7);
                        width: 40px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    } else {
        mouth.style.animation = '';
    }
}

// ===== Voice Button Click Handler =====
document.getElementById('playVoice').addEventListener('click', () => {
    const username = sessionStorage.getItem('username');
    if (username) {
        // Stop any ongoing speech or audio
        speechSynthesis.cancel();

        // Stop all audio elements
        document.querySelectorAll('audio').forEach(audio => audio.pause());

        // Play the welcome voice
        playWelcomeVoice(username);
    }
});

// ===== Confetti Celebration =====
function createConfettiCelebration() {
    const overlay = document.getElementById('celebrationOverlay');
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#fee140', '#fa709a'];
    const confettiCount = 60;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -20px;
            left: ${Math.random() * 100}%;
            opacity: 1;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            z-index: 9999;
            pointer-events: none;
        `;

        overlay.appendChild(confetti);

        const duration = 3000 + Math.random() * 2000;
        const rotation = Math.random() * 720 - 360;
        const xOffset = (Math.random() - 0.5) * 300;

        confetti.animate([
            {
                transform: `translateY(0) translateX(0) rotate(0deg)`,
                opacity: 1
            },
            {
                transform: `translateY(${window.innerHeight + 20}px) translateX(${xOffset}px) rotate(${rotation}deg)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        setTimeout(() => confetti.remove(), duration);
    }
}

// ===== Logout Functionality =====
document.getElementById('logoutBtn').addEventListener('click', () => {
    // Clear session storage
    sessionStorage.removeItem('username');

    // Add fade out animation
    const container = document.querySelector('.welcome-container');
    container.style.animation = 'fadeOut 0.5s ease-out';

    // Add fadeOut keyframes
    if (!document.getElementById('fadeOut-animation')) {
        const style = document.createElement('style');
        style.id = 'fadeOut-animation';
        style.textContent = `
            @keyframes fadeOut {
                to {
                    opacity: 0;
                    transform: translateY(30px);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Redirect to login after animation
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 500);
});

// ===== Eye Tracking =====
const pupils = document.querySelectorAll('.pupil');

document.addEventListener('mousemove', (e) => {
    pupils.forEach(pupil => {
        const pupilRect = pupil.parentElement.getBoundingClientRect();
        const pupilCenterX = pupilRect.left + pupilRect.width / 2;
        const pupilCenterY = pupilRect.top + pupilRect.height / 2;

        const deltaX = e.clientX - pupilCenterX;
        const deltaY = e.clientY - pupilCenterY;
        const angle = Math.atan2(deltaY, deltaX);
        const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), 6);

        const moveX = Math.cos(angle) * distance;
        const moveY = Math.sin(angle) * distance;

        pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

console.log('🎉 Welcome page loaded! Voice-over ready!');

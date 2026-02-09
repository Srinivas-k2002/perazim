// ===== Eye Tracking Animation =====
document.addEventListener('DOMContentLoaded', () => {
    const pupils = document.querySelectorAll('.pupil');
    const mascotHead = document.querySelector('.mascot-head');

    // Track mouse movement for pupil following
    document.addEventListener('mousemove', (e) => {
        if (!mascotHead) return;

        const headRect = mascotHead.getBoundingClientRect();
        const headCenterX = headRect.left + headRect.width / 2;
        const headCenterY = headRect.top + headRect.height / 2;

        pupils.forEach(pupil => {
            const pupilRect = pupil.parentElement.getBoundingClientRect();
            const pupilCenterX = pupilRect.left + pupilRect.width / 2;
            const pupilCenterY = pupilRect.top + pupilRect.height / 2;

            const deltaX = e.clientX - pupilCenterX;
            const deltaY = e.clientY - pupilCenterY;
            const angle = Math.atan2(deltaY, deltaX);
            const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), 5);

            const moveX = Math.cos(angle) * distance;
            const moveY = Math.sin(angle) * distance;

            pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });

    // Reset pupil position when mouse leaves
    document.addEventListener('mouseleave', () => {
        pupils.forEach(pupil => {
            pupil.style.transform = 'translate(0, 0)';
        });
    });
});

// ===== Password Toggle =====
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const eyeIcon = togglePassword.querySelector('.eye-icon');

let passwordVisible = false;

togglePassword.addEventListener('click', () => {
    passwordVisible = !passwordVisible;

    if (passwordVisible) {
        passwordInput.type = 'text';
        eyeIcon.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        eyeIcon.textContent = '👁️';
    }

    // Add bounce animation
    eyeIcon.style.animation = 'none';
    setTimeout(() => {
        eyeIcon.style.animation = 'icon-bounce 0.5s ease';
    }, 10);
});

// ===== Form Input Animations =====
const formInputs = document.querySelectorAll('.form-input');

formInputs.forEach(input => {
    // Add floating label effect
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');

        // Animate corresponding label icon
        const formGroup = input.closest('.form-group');
        const labelIcon = formGroup.querySelector('.label-icon');
        if (labelIcon) {
            labelIcon.style.transform = 'scale(1.3) rotate(10deg)';
        }
    });

    input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');

        // Reset label icon
        const formGroup = input.closest('.form-group');
        const labelIcon = formGroup.querySelector('.label-icon');
        if (labelIcon) {
            labelIcon.style.transform = 'scale(1) rotate(0deg)';
        }
    });

    // Add character entry animation
    input.addEventListener('input', (e) => {
        if (e.inputType === 'insertText') {
            input.style.animation = 'none';
            setTimeout(() => {
                input.style.animation = 'input-pulse 0.3s ease';
            }, 10);
        }
    });
});

// Add input pulse animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes input-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.01); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// ===== Form Validation with Animation =====
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const successMessage = document.getElementById('successMessage');
const formWrapper = document.querySelector('.form-wrapper');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Simple validation
    if (!username || !password) {
        shakeForm();
        showError('Please fill in all fields! 🙈');
        return;
    }

    // Validate username length
    if (username.length < 3) {
        shakeInput(usernameInput);
        showError('Username is too short! Try again! 😊');
        return;
    }

    // Validate password length
    if (password.length < 6) {
        shakeInput(passwordInput);
        showError('Password needs at least 6 characters! 🔒');
        return;
    }

    // Show loading animation
    showLoadingState();

    // Simulate API call
    await simulateLogin(username, password);
});

// Shake animation for form
function shakeForm() {
    const loginContainer = document.querySelector('.login-container');
    loginContainer.style.animation = 'shake 0.5s ease';

    setTimeout(() => {
        loginContainer.style.animation = '';
    }, 500);

    // Add shake keyframes
    if (!document.getElementById('shake-animation')) {
        const shakeStyle = document.createElement('style');
        shakeStyle.id = 'shake-animation';
        shakeStyle.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                20%, 40%, 60%, 80% { transform: translateX(10px); }
            }
        `;
        document.head.appendChild(shakeStyle);
    }

    // Make mascot react with funny animation!
    makeMascotReactToError();
}

// Funny mascot reactions when validation fails
function makeMascotReactToError() {
    const mascot = document.querySelector('.mascot');
    const mascotHead = document.querySelector('.mascot-head');
    const eyes = document.querySelectorAll('.eye');
    const mouth = document.querySelector('.mouth');
    const blushes = document.querySelectorAll('.blush');
    const leftArm = document.querySelector('.arm-left');
    const rightArm = document.querySelector('.arm-right');

    if (!mascot) return;

    // Random reactions for variety
    const reactions = [
        headShakeReaction,
        coverEyesReaction,
        sadFaceReaction,
        spinAroundReaction,
        facepalmReaction
    ];

    const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
    randomReaction();

    // Head shake reaction
    function headShakeReaction() {
        mascotHead.style.animation = 'head-shake 0.6s ease';

        // Add keyframes if not exists
        if (!document.getElementById('head-shake-animation')) {
            const style = document.createElement('style');
            style.id = 'head-shake-animation';
            style.textContent = `
                @keyframes head-shake {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-15deg); }
                    75% { transform: rotate(15deg); }
                }
            `;
            document.head.appendChild(style);
        }

        // Eyes look worried
        eyes.forEach(eye => {
            eye.style.transform = 'scaleY(0.7)';
        });

        // Mouth becomes wavy (uncertain)
        mouth.style.borderRadius = '0 0 20px 20px';
        mouth.style.width = '35px';

        // Reset after animation
        setTimeout(() => {
            mascotHead.style.animation = '';
            eyes.forEach(eye => eye.style.transform = '');
            mouth.style.borderRadius = '';
            mouth.style.width = '';
        }, 1500);
    }

    // Cover eyes reaction
    function coverEyesReaction() {
        // Arms move up to cover eyes
        leftArm.style.transition = 'all 0.4s ease';
        rightArm.style.transition = 'all 0.4s ease';
        leftArm.style.transform = 'rotate(-90deg) translateY(-60px)';
        rightArm.style.transform = 'rotate(90deg) translateY(-60px)';

        // Close eyes
        eyes.forEach(eye => {
            eye.style.transform = 'scaleY(0.1)';
            eye.style.transition = 'transform 0.3s ease';
        });

        // Embarrassed blush
        blushes.forEach(blush => {
            blush.style.opacity = '1';
            blush.style.width = '20px';
            blush.style.transition = 'all 0.3s ease';
        });

        // Reset after animation
        setTimeout(() => {
            leftArm.style.transform = '';
            rightArm.style.transform = '';
            eyes.forEach(eye => eye.style.transform = '');
            blushes.forEach(blush => {
                blush.style.opacity = '';
                blush.style.width = '';
            });
        }, 2000);
    }

    // Sad face reaction
    function sadFaceReaction() {
        // Eyes droop
        eyes.forEach(eye => {
            eye.style.transform = 'translateY(5px)';
            eye.style.transition = 'transform 0.4s ease';
        });

        // Mouth turns into sad frown
        mouth.style.transform = 'translateX(-50%) scaleY(-1) translateY(10px)';
        mouth.style.transition = 'all 0.4s ease';
        mouth.style.borderColor = '#f5576c';

        // Head tilts down
        mascotHead.style.transform = 'rotate(10deg)';
        mascotHead.style.transition = 'transform 0.4s ease';

        // Body shrinks slightly (sad posture)
        mascot.style.transform = 'scale(0.95)';
        mascot.style.transition = 'transform 0.4s ease';

        // Reset after animation
        setTimeout(() => {
            eyes.forEach(eye => eye.style.transform = '');
            mouth.style.transform = '';
            mouth.style.borderColor = '';
            mascotHead.style.transform = '';
            mascot.style.transform = '';
        }, 2000);
    }

    // Spin around reaction (dizzy)
    function spinAroundReaction() {
        mascot.style.transition = 'transform 0.8s ease';
        mascot.style.transform = 'rotate(360deg) scale(1.1)';

        // Eyes spin into spirals
        eyes.forEach(eye => {
            eye.style.transform = 'rotate(180deg)';
            eye.style.transition = 'transform 0.8s ease';
        });

        // Mouth becomes 'O' shape
        mouth.style.borderRadius = '50%';
        mouth.style.width = '25px';
        mouth.style.height = '25px';
        mouth.style.transition = 'all 0.3s ease';

        // Add stars around head
        createDizzyStars();

        // Reset after animation
        setTimeout(() => {
            mascot.style.transform = '';
            eyes.forEach(eye => eye.style.transform = '');
            mouth.style.borderRadius = '';
            mouth.style.width = '';
            mouth.style.height = '';
        }, 2000);
    }

    // Facepalm reaction
    function facepalmReaction() {
        // Right arm moves to face
        rightArm.style.transition = 'all 0.5s ease';
        rightArm.style.transform = 'rotate(-45deg) translateX(-30px) translateY(-50px)';
        rightArm.style.zIndex = '10';

        // Head tilts
        mascotHead.style.transform = 'rotate(-10deg)';
        mascotHead.style.transition = 'transform 0.5s ease';

        // Eyes close
        eyes.forEach(eye => {
            eye.style.transform = 'scaleY(0.1)';
            eye.style.transition = 'transform 0.4s ease';
        });

        // Sigh mouth
        mouth.style.width = '45px';
        mouth.style.height = '15px';
        mouth.style.transition = 'all 0.4s ease';

        // Reset after animation
        setTimeout(() => {
            rightArm.style.transform = '';
            rightArm.style.zIndex = '';
            mascotHead.style.transform = '';
            eyes.forEach(eye => eye.style.transform = '');
            mouth.style.width = '';
            mouth.style.height = '';
        }, 2500);
    }

    // Create dizzy stars effect
    function createDizzyStars() {
        const mascotRect = mascot.getBoundingClientRect();

        for (let i = 0; i < 3; i++) {
            const star = document.createElement('div');
            star.textContent = '★';
            star.style.cssText = `
                position: fixed;
                font-size: 20px;
                color: #fee140;
                top: ${mascotRect.top - 20}px;
                left: ${mascotRect.left + mascotRect.width / 2}px;
                z-index: 1000;
                pointer-events: none;
                animation: dizzy-star-${i} 2s ease-out forwards;
            `;
            document.body.appendChild(star);

            // Add unique animation for each star
            const starStyle = document.createElement('style');
            starStyle.textContent = `
                @keyframes dizzy-star-${i} {
                    0% {
                        transform: translate(0, 0) rotate(0deg) scale(0);
                        opacity: 1;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        transform: translate(${(i - 1) * 40}px, -50px) rotate(${i * 120}deg) scale(1.5);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(starStyle);

            setTimeout(() => star.remove(), 2000);
        }
    }
}

// Shake animation for individual input
function shakeInput(input) {
    input.style.animation = 'shake 0.5s ease';
    input.style.borderColor = '#f5576c';

    setTimeout(() => {
        input.style.animation = '';
        input.style.borderColor = '';
    }, 500);
}

// Show error message
function showError(message) {
    // Create error tooltip
    const existingError = document.querySelector('.error-tooltip');
    if (existingError) existingError.remove();

    const errorTooltip = document.createElement('div');
    errorTooltip.className = 'error-tooltip';
    errorTooltip.textContent = message;

    // Style error tooltip
    errorTooltip.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        background: linear-gradient(135deg, #f5576c 0%, #fa709a 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 16px;
        font-weight: 600;
        box-shadow: 0 8px 24px rgba(245, 87, 108, 0.3);
        z-index: 1000;
        animation: error-slide 0.5s ease forwards;
        font-size: 0.95rem;
    `;

    document.body.appendChild(errorTooltip);

    // Add animation
    const errorStyle = document.createElement('style');
    errorStyle.textContent = `
        @keyframes error-slide {
            to {
                transform: translateX(-50%) translateY(0);
            }
        }
    `;
    document.head.appendChild(errorStyle);

    // Remove after 3 seconds
    setTimeout(() => {
        errorTooltip.style.animation = 'error-slide 0.5s ease reverse';
        setTimeout(() => errorTooltip.remove(), 500);
    }, 3000);

    // Make mascot react based on error type
    if (message.includes('fill in all fields')) {
        // Specific reaction for empty fields - mascot points at the form
        pointAtForm();
    } else {
        // Generic sad reaction for other errors
        const mouth = document.querySelector('.mouth');
        if (mouth) {
            mouth.style.transform = 'translateX(-50%) scaleY(-1)';
            setTimeout(() => {
                mouth.style.transform = 'translateX(-50%) scaleY(1)';
            }, 2000);
        }
    }
}

// Mascot points at the form
function pointAtForm() {
    const rightArm = document.querySelector('.arm-right');
    const eyes = document.querySelectorAll('.eye');
    const pupils = document.querySelectorAll('.pupil');

    if (rightArm) {
        rightArm.style.transition = 'all 0.5s ease';
        rightArm.style.transform = 'rotate(-90deg) translateY(-20px)';

        // Eyes look down at the form
        pupils.forEach(pupil => {
            pupil.style.transform = 'translateY(8px)';
            pupil.style.transition = 'transform 0.5s ease';
        });

        // Arm bounces to emphasize pointing
        setTimeout(() => {
            rightArm.style.animation = 'point-bounce 0.5s ease infinite';
        }, 500);

        const pointStyle = document.createElement('style');
        pointStyle.id = 'point-bounce-style';
        if (!document.getElementById('point-bounce-style')) {
            pointStyle.textContent = `
                @keyframes point-bounce {
                    0%, 100% { transform: rotate(-90deg) translateY(-20px); }
                    50% { transform: rotate(-90deg) translateY(-25px); }
                }
            `;
            document.head.appendChild(pointStyle);
        }

        // Reset after 2 seconds
        setTimeout(() => {
            rightArm.style.animation = '';
            rightArm.style.transform = '';
            pupils.forEach(pupil => pupil.style.transform = '');
        }, 2500);
    }
}

// Loading state
function showLoadingState() {
    const loginButton = document.querySelector('.login-button');
    const buttonText = loginButton.querySelector('.button-text');
    const buttonIcon = loginButton.querySelector('.button-icon');

    buttonText.textContent = 'Logging in';
    buttonIcon.textContent = '⏳';
    loginButton.disabled = true;
    loginButton.style.opacity = '0.7';

    // Animate dots
    let dots = 0;
    const dotsInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        buttonText.textContent = 'Logging in' + '.'.repeat(dots);
    }, 300);

    // Store interval for cleanup
    loginButton.dataset.dotsInterval = dotsInterval;
}

// Simulate login
async function simulateLogin(username, password) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // For demo purposes, always succeed
    showSuccess(username);
}

// Show success animation
function showSuccess(username) {
    const loginButton = document.querySelector('.login-button');

    // Clear loading interval
    if (loginButton.dataset.dotsInterval) {
        clearInterval(parseInt(loginButton.dataset.dotsInterval));
    }

    // Update button
    const buttonText = loginButton.querySelector('.button-text');
    const buttonIcon = loginButton.querySelector('.button-icon');
    buttonText.textContent = 'Success';
    buttonIcon.textContent = '✓';
    loginButton.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    loginButton.style.opacity = '1';

    // Make mascot happy
    const mouth = document.querySelector('.mouth');
    const blushes = document.querySelectorAll('.blush');
    if (mouth) {
        mouth.style.width = '55px';
        mouth.style.height = '25px';
    }
    blushes.forEach(blush => {
        blush.style.opacity = '1';
    });

    // Show success message
    setTimeout(() => {
        // Hide form with class for better responsiveness
        formWrapper.classList.add('hidden');

        setTimeout(() => {
            successMessage.classList.add('show');

            // Create confetti
            createConfetti();

            // Store username in session storage for welcome page
            sessionStorage.setItem('username', username);

            // Redirect to welcome page after 2 seconds
            setTimeout(() => {
                console.log('Redirecting to welcome page...');
                window.location.href = 'welcome.html';
            }, 2000);
        }, 400);
    }, 500);
}

// Create confetti effect
function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#fee140', '#fa709a'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}%;
            opacity: 1;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            z-index: 9999;
            pointer-events: none;
        `;

        document.body.appendChild(confetti);

        const duration = 2000 + Math.random() * 1000;
        const rotation = Math.random() * 360;
        const xOffset = (Math.random() - 0.5) * 200;

        confetti.animate([
            {
                transform: `translateY(0) translateX(0) rotate(0deg)`,
                opacity: 1
            },
            {
                transform: `translateY(${window.innerHeight + 10}px) translateX(${xOffset}px) rotate(${rotation}deg)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        setTimeout(() => confetti.remove(), duration);
    }
}

// ===== Social Login Buttons =====
const socialButtons = document.querySelectorAll('.social-button');

socialButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = button.classList.contains('google') ? 'Google' : 'Apple';

        // Add ripple effect
        const ripple = document.createElement('div');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(102, 126, 234, 0.3);
            top: ${y}px;
            left: ${x}px;
            transform: scale(0);
            animation: ripple 0.6s ease;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.appendChild(ripple);

        const rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);

        setTimeout(() => ripple.remove(), 600);

        // Show message
        console.log(`${platform} login clicked - integrate with OAuth here`);
        showError(`${platform} login coming soon! 🚀`);
    });
});

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    // Press Enter anywhere to focus first empty input
    if (e.key === 'Enter' && !e.target.matches('.form-input')) {
        const firstEmptyInput = Array.from(formInputs).find(input => !input.value);
        if (firstEmptyInput) {
            firstEmptyInput.focus();
        }
    }

    // Press Escape to clear form
    if (e.key === 'Escape') {
        formInputs.forEach(input => input.value = '');
        formInputs[0].focus();
    }
});

// ===== Form Auto-fill Detection =====
formInputs.forEach(input => {
    // Detect browser autofill
    const observer = new MutationObserver(() => {
        if (input.matches(':-webkit-autofill')) {
            input.style.animationName = 'autofill-bounce';
        }
    });

    observer.observe(input, {
        attributes: true,
        attributeFilter: ['value']
    });

    // Add autofill animation
    const autofillStyle = document.createElement('style');
    autofillStyle.textContent = `
        @keyframes autofill-bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }
    `;
    document.head.appendChild(autofillStyle);
});

// ===== Mascot Interactions =====
const mascot = document.querySelector('.mascot');

if (mascot) {
    mascot.addEventListener('click', () => {
        mascot.style.animation = 'none';
        setTimeout(() => {
            mascot.style.animation = 'mascot-bounce 0.5s ease-in-out';
        }, 10);

        // Play sound effect (optional - commented out)
        // const audio = new Audio('boing.mp3');
        // audio.play();
    });
}

// ===== Remember Me Functionality =====
const rememberMeCheckbox = document.getElementById('rememberMe');

// Load saved username if exists
if (localStorage.getItem('rememberedUsername')) {
    usernameInput.value = localStorage.getItem('rememberedUsername');
    rememberMeCheckbox.checked = true;
}

// Save username on successful login (would be called in real implementation)
function saveRememberedUsername(username) {
    if (rememberMeCheckbox.checked) {
        localStorage.setItem('rememberedUsername', username);
    } else {
        localStorage.removeItem('rememberedUsername');
    }
}

// ===== Accessibility Enhancements =====
// Add ARIA live region for screen readers
const liveRegion = document.createElement('div');
liveRegion.setAttribute('aria-live', 'polite');
liveRegion.setAttribute('aria-atomic', 'true');
liveRegion.className = 'sr-only';
liveRegion.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
`;
document.body.appendChild(liveRegion);

// Announce form errors to screen readers
function announceToScreenReader(message) {
    liveRegion.textContent = message;
}

// ===== Performance Optimization =====
// Lazy load background animations on slower devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.querySelector('.background-container').style.display = 'none';
}

// ===== Easter Egg =====
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    const loginContainer = document.querySelector('.login-container');
    loginContainer.style.animation = 'rainbow-spin 2s ease-in-out';

    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
        @keyframes rainbow-spin {
            0% { filter: hue-rotate(0deg) brightness(1); transform: rotate(0deg); }
            50% { filter: hue-rotate(360deg) brightness(1.2); transform: rotate(360deg); }
            100% { filter: hue-rotate(0deg) brightness(1); transform: rotate(0deg); }
        }
    `;
    document.head.appendChild(rainbowStyle);

    createConfetti();

    console.log('🎮 Konami Code activated! You found the easter egg!');
}

console.log('🎨 Login page loaded successfully! Try the Konami Code for a surprise! 🎮');

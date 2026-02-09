// ===== Global Variables =====
let currentVerse = null;
let isSpeaking = false;
let currentAudio = null;

// ===== DOM Elements =====
const seeButton = document.getElementById('seeButton');
const seeButtonContainer = document.getElementById('seeButtonContainer');
const verseDisplay = document.getElementById('verseDisplay');
const loadingSpinner = document.getElementById('loadingSpinner');
const verseText = document.getElementById('verseText');
const verseReference = document.getElementById('verseReference');
const verseTranslation = document.getElementById('verseTranslation');
const playVoiceBtn = document.getElementById('playVoiceBtn');
const newVerseBtn = document.getElementById('newVerseBtn');
const shareBtn = document.getElementById('shareBtn');
const backButton = document.getElementById('backButton');
const celebrationOverlay = document.getElementById('celebrationOverlay');

// ===== Initialize Page =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('📖 Bible Verse Page Loaded!');

    // Check if user came from login/welcome
    const username = sessionStorage.getItem('username');
    if (!username) {
        console.warn('No username found, redirecting to login...');
        window.location.href = 'login.html';
        return;
    }

    // Add event listeners
    seeButton.addEventListener('click', fetchBibleVerse);
    playVoiceBtn.addEventListener('click', playTamilVoiceOver);
    newVerseBtn.addEventListener('click', fetchNewVerse);
    shareBtn.addEventListener('click', shareVerse);
    backButton.addEventListener('click', goBackToWelcome);

    // Eye tracking for mascot
    initializeEyeTracking();
});

// ===== Tamil Bible Verses Database =====
const tamilBibleVerses = [
    {
        text: 'தேவன், தம்முடைய ஒரே பேறான குமாரனை விசுவாசிக்கிறவன் எவனோ அவன் கெட்டுப்போகாமல் நித்தியஜீவனை அடையும்படிக்கு, அவரைத் தந்தருளி, இவ்வளவாய் உலகத்தில் அன்பு கூர்ந்தார்.',
        reference: 'யோவான் 3:16',
        translation: 'தமிழ் பரிசுத்த வேதாகமம்',
        book: 'யோவான்',
        chapter: 3,
        verse: 16
    },
    {
        text: 'யேசு அவரை நோக்கி: நானே வழியும், சத்தியமும், ஜீவனுமாயிருக்கிறேன்; என்னாலேயல்லாமல் ஒருவனும் பிதாவினிடத்தில் வருகிறதில்லை.',
        reference: 'யோவான் 14:6',
        translation: 'தமிழ் பரிசுத்த வேதாகமம்',
        book: 'யோவான்',
        chapter: 14,
        verse: 6
    },
    {
        text: 'என்னிடத்தில் வாருங்கள், பாரஞ்சுமக்கிறவர்களே, நான் உங்களை இளைப்பாறப்பண்ணுவேன்.',
        reference: 'மத்தேயு 11:28',
        translation: 'தமிழ் பரிசுத்த வேதாகமம்',
        book: 'மத்தேயு',
        chapter: 11,
        verse: 28
    },
    {
        text: 'கர்த்தரை நோக்கிக் காத்திருப்பவர்கள் புதுப்பெலன் அடைவார்கள்; அவர்கள் கழுகுகளைப்போல் செட்டைகளை அடித்து எழும்புவார்கள்.',
        reference: 'ஏசாயா 40:31',
        translation: 'தமிழ் பரிசுத்த வேதாகமம்',
        book: 'ஏசாயா',
        chapter: 40,
        verse: 31
    },
    {
        text: 'நீங்கள் என்னைத் தேடி, உங்கள் முழு இருதயத்தோடும் என்னைத் தேடினால் என்னைக் கண்டடைவீர்கள்.',
        reference: 'எரேமியா 29:13',
        translation: 'தமிழ் பரிசுத்த வேதாகமம்',
        book: 'எரேமியா',
        chapter: 29,
        verse: 13
    },
    {
        text: 'நான் உன்னை விடாமலும் கைவிடாமலும் இருப்பேன் என்று அவர் சொல்லியிருக்கிறார்.',
        reference: 'எபிரெயர் 13:5',
        translation: 'தமிழ் பரிசுத்த வேதாகமம்',
        book: 'எபிரெயர்',
        chapter: 13,
        verse: 5
    },
    {
        text: 'உங்கள் கவலைகளையெல்லாம் அவர்மேல் வைத்துவிடுங்கள்; அவர் உங்களைக் கவனிக்கிறார்.',
        reference: '1 பேதுரு 5:7',
        translation: 'தமிழ் பரிசுத்த வேதாகமம்',
        book: '1 பேதுரு',
        chapter: 5,
        verse: 7
    },
    {
        text: 'என்னை அழைப்பாயானால் நான் உனக்கு பதில் சொல்லுவேன்; நீ அறியாத மகத்துவமான காரியங்களை உனக்கு அறிவிப்பேன்.',
        reference: 'எரேமியா 33:3',
        translation: 'தமிழ் பரிசுத்த வேதாகமம்',
        book: 'எரேமியா',
        chapter: 33,
        verse: 3
    },
    {
        text: 'கர்த்தர்மேல் நம்பிக்கை வைக்கிறவன் பாக்கியவான்.',
        reference: 'நீதிமொழிகள் 16:20',
        translation: 'தமிழ் பரிசுத்த வேதாகமம்',
        book: 'நீதிமொழிகள்',
        chapter: 16,
        verse: 20
    },
    {
        text: 'நீதிமானுடைய ஜெபம் மிகுந்த பெலனுள்ளதாய் கிரியைசெய்யும்.',
        reference: 'யாக்கோபு 5:16',
        translation: 'தமிழ் பரிசுத்த வேதாகமம்',
        book: 'யாக்கோபு',
        chapter: 5,
        verse: 16
    }
];

// ===== Fetch Bible Verse (Tamil) =====
async function fetchBibleVerse() {
    console.log('🔍 Fetching Tamil Bible verse...');

    // Hide see button, show loading
    seeButtonContainer.classList.add('hidden');
    loadingSpinner.classList.add('active');

    try {
        // Get random Tamil verse from local database
        const randomIndex = Math.floor(Math.random() * tamilBibleVerses.length);
        const verse = tamilBibleVerses[randomIndex];

        console.log('✅ Tamil Bible verse selected:', verse);

        currentVerse = {
            text: verse.text,
            reference: verse.reference,
            translation: verse.translation,
            book: verse.book,
            chapter: verse.chapter,
            verse: verse.verse
        };

        // Wait a bit for effect
        setTimeout(() => {
            displayVerse();
        }, 800);

    } catch (error) {
        console.error('❌ Error fetching Bible verse:', error);

        // Fallback to default Tamil verse
        currentVerse = tamilBibleVerses[0];

        setTimeout(() => {
            displayVerse();
        }, 800);
    }
}

// ===== Display Verse on Screen =====
function displayVerse() {
    // Hide loading
    loadingSpinner.classList.remove('active');

    // Populate verse content
    verseText.textContent = currentVerse.text;
    verseReference.textContent = currentVerse.reference;
    verseTranslation.textContent = `— ${currentVerse.translation}`;

    // Show verse display with animation
    verseDisplay.classList.add('active');

    // Create confetti celebration
    createConfettiCelebration();

    // Automatically play Tamil voice after a short delay
    setTimeout(() => {
        playTamilVoiceOver();
    }, 1000);
}

// ===== Play Tamil Voice-Over with Google TTS =====
async function playTamilVoiceOver() {
    if (isSpeaking) {
        console.log('⏸️ Stopping current speech...');

        // Stop any playing audio
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
        }

        isSpeaking = false;
        playVoiceBtn.classList.remove('playing');
        animateMascotSpeaking(false);
        return;
    }

    if (!currentVerse) {
        console.warn('⚠️ No verse to read');
        return;
    }

    console.log('🔊 Playing Tamil voice-over with Google TTS...');

    try {
        // Prepare Tamil text  
        const tamilText = `இன்றைய பரிசுத்த வேதாகம வசனம். ${currentVerse.reference}. ${currentVerse.text}`;

        // Encode text for URL
        const encodedText = encodeURIComponent(tamilText);

        // Google Translate TTS API URL (Tamil language)
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ta&client=tw-ob&q=${encodedText}`;

        console.log('🎤 Creating Tamil audio...');

        // Create audio element
        currentAudio = new Audio(ttsUrl);

        // Event handlers
        currentAudio.onloadeddata = () => {
            console.log('✅ Tamil audio loaded successfully');
        };

        currentAudio.onplay = () => {
            isSpeaking = true;
            playVoiceBtn.classList.add('playing');
            animateMascotSpeaking(true);
            console.log('🎤 Tamil voice started playing');
        };

        currentAudio.onended = () => {
            isSpeaking = false;
            playVoiceBtn.classList.remove('playing');
            animateMascotSpeaking(false);
            currentAudio = null;
            console.log('✅ Tamil voice finished');
        };

        currentAudio.onerror = (error) => {
            console.error('❌ Tamil audio error:', error);
            isSpeaking = false;
            playVoiceBtn.classList.remove('playing');
            animateMascotSpeaking(false);
            currentAudio = null;
        };

        // Play audio
        await currentAudio.play();

    } catch (error) {
        console.error('❌ Error playing Tamil voice:', error);
        isSpeaking = false;
        playVoiceBtn.classList.remove('playing');
        animateMascotSpeaking(false);
    }
}

// ===== Animate Mascot Speaking =====
function animateMascotSpeaking(isSpeaking) {
    const mouth = document.querySelector('.mouth');

    if (isSpeaking) {
        mouth.style.animation = 'mouth-talk 0.3s infinite';

        // Add talking animation keyframes if not already added
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

// ===== Fetch New Verse =====
function fetchNewVerse() {
    console.log('🔄 Fetching new verse...');

    // Stop any ongoing speech
    if (isSpeaking) {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
        }
        isSpeaking = false;
        playVoiceBtn.classList.remove('playing');
        animateMascotSpeaking(false);
    }

    // Hide current verse, show loading
    verseDisplay.classList.remove('active');
    loadingSpinner.classList.add('active');

    // Fetch new verse
    fetchBibleVerse();
}

// ===== Share Verse =====
function shareVerse() {
    if (!currentVerse) {
        console.warn('⚠️ No verse to share');
        return;
    }

    const shareText = `"${currentVerse.text}"\n\n— ${currentVerse.reference} (${currentVerse.translation})`;

    if (navigator.share) {
        // Use Web Share API if available
        navigator.share({
            title: 'Daily Bible Verse',
            text: shareText,
        })
            .then(() => console.log('✅ Verse shared successfully'))
            .catch((error) => console.log('❌ Error sharing:', error));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText)
            .then(() => {
                alert('📋 Verse copied to clipboard!');
                console.log('✅ Verse copied to clipboard');
            })
            .catch((error) => {
                console.error('❌ Error copying to clipboard:', error);
                alert('Could not copy to clipboard');
            });
    }
}

// ===== Go Back to Welcome Page =====
function goBackToWelcome() {
    console.log('🏠 Going back to welcome page...');

    // Stop any ongoing speech
    if (isSpeaking) {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
        }
    }

    // Add fade out animation
    const container = document.querySelector('.verse-container');
    container.style.animation = 'fadeOut 0.5s ease-out';

    setTimeout(() => {
        window.location.href = 'welcome.html';
    }, 500);
}

// ===== Confetti Celebration =====
function createConfettiCelebration() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#fee140', '#fa709a'];
    const confettiCount = 50;

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

        celebrationOverlay.appendChild(confetti);

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

// ===== Eye Tracking for Mascot =====
function initializeEyeTracking() {
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
}

console.log('🎉 Bible Verse script loaded with Tamil Google TTS! Ready to show God\'s word!');

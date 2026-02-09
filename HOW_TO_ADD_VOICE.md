# How to Add Your Own Voice to the Welcome Page 🎙️

## Option 1: Record Audio Files (Recommended)

### Step 1: Create Audio Folder
1. Create a folder called `audio` in your project:
   ```
   c:\Users\srini\OneDrive\Documents\perazim\audio\
   ```

### Step 2: Record Your Voice
You have two options:

**A) Personalized Greeting (per user):**
- Record: "Welcome [Name]! welcome kutty pappa!"
- Save as: `welcome-john.mp3`, `welcome-mary.mp3`, etc.
- The system will automatically play the right file based on username

**B) Generic Greeting:**
- Record: "Welcome! welcome kutty pappa!"
- Save as: `welcome.mp3`
- This plays for all users

### Step 3: Recording Tips
Use any of these free tools:
- **Windows:** Voice Recorder app (built-in)
- **Online:** https://online-voice-recorder.com/
- **Mobile:** Use your phone's voice recorder, then transfer the file

**Recording Settings:**
- Format: MP3 or WAV
- Keep it under 10 seconds
- Speak clearly and cheerfully!

### Step 4: Save Audio Files
Place your recorded files in the `audio/` folder:
```
perazim/
├── login.html
├── welcome.html
├── audio/
│   ├── welcome.mp3          (generic greeting)
│   ├── welcome-john.mp3     (for user "john")
│   ├── welcome-mary.mp3     (for user "mary")
│   └── ...
```

## Option 2: Text-to-Speech (Current System)
The current system uses browser TTS as a fallback. It automatically:
- Speaks the username dynamically
- Works without any audio files
- Uses the browser's built-in voices

## How the System Works

### Priority Order:
1. **First:** Tries `audio/welcome-{username}.mp3` (personalized)
2. **Second:** Tries `audio/welcome.mp3` (generic)
3. **Third:** Falls back to text-to-speech

### Example:
If user "John" logs in:
1. Looks for `audio/welcome-john.mp3` ✅ Found? Play it!
2. If not found, looks for `audio/welcome.mp3` ✅ Found? Play it!
3. If not found, uses TTS: "Welcome John! welcome kutty pappa!"

## Quick Start

### Minimal Setup (One Generic File):
1. Record yourself saying: "Welcome! welcome kutty pappa!"
2. Save as: `audio/welcome.mp3`
3. Done! It will play for all users

### Advanced Setup (Personalized):
1. For each common user, record: "Welcome [Name]! welcome kutty pappa!"
2. Save with lowercase username: `welcome-john.mp3`
3. Fallback to generic or TTS for unknown names

## Testing

1. **Create the audio folder**
2. **Add your audio files**
3. **Refresh the login page**
4. **Login and hear your voice!** 🎉

If no audio files exist, the system automatically uses text-to-speech (no errors, it just works!).

// Generate a pleasant "ding" sound using Web Audio API
export const playCompletionSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Create oscillator for the fundamental frequency
  const oscillator1 = audioContext.createOscillator();
  const oscillator2 = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  // Connect nodes
  oscillator1.connect(gainNode);
  oscillator2.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Set frequencies for a pleasant C major chord
  oscillator1.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
  oscillator2.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5

  // Set oscillator types
  oscillator1.type = 'sine';
  oscillator2.type = 'sine';

  // Create envelope for smooth sound
  const now = audioContext.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

  // Start and stop
  oscillator1.start(now);
  oscillator2.start(now);
  oscillator1.stop(now + 0.5);
  oscillator2.stop(now + 0.5);
};

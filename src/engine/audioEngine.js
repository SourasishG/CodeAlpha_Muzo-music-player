/**
 * AudioEngine encapsulates a single HTMLAudioElement instance.
 * It provides a safe, provider-agnostic, promise-aware interface for audio playback.
 */
class AudioEngine {
  constructor() {
    this.audio = typeof window !== 'undefined' ? new Audio() : null;
    if (this.audio) {
      this.audio.preload = 'auto';
    }
  }

  /**
   * Loads an audio stream URL cleanly without self-cancelling.
   */
  loadTrack(src) {
    if (!this.audio) return;

    // Clear previous audio if src is null or empty
    if (!src) {
      this.pause();
      this.audio.removeAttribute('src');
      return;
    }

    // Only assign if the source has actually changed
    if (this.audio.src !== src) {
      this.pause();
      this.audio.src = src;
      // In modern browsers, setting src automatically initiates loading.
      // Calling this.audio.load() here is unnecessary and cancels in-flight requests.
    }
  }

  /**
   * Starts playback safely, catching browser autoplay and format rejections.
   */
  async play() {
    if (!this.audio || !this.audio.src) return false;

    try {
      await this.audio.play();
      return true;
    } catch (error) {
      // Benign errors: AbortError (quick skipping) or format issues
      if (error.name !== 'AbortError') {
        console.warn('Playback notice:', error.message);
      }
      return false;
    }
  }

  /**
   * Pauses playback.
   */
  pause() {
    if (!this.audio) return;
    this.audio.pause();
  }

  /**
   * Seeks audio to a specific second position.
   */
  seek(timeInSeconds) {
    if (!this.audio || Number.isNaN(timeInSeconds)) return;
    this.audio.currentTime = Math.max(0, timeInSeconds);
  }

  /**
   * Adjusts volume (0.0 to 1.0).
   */
  setVolume(level) {
    if (!this.audio) return;
    this.audio.volume = Math.max(0, Math.min(1, level));
  }

  /**
   * Sets muted state.
   */
  setMuted(isMuted) {
    if (!this.audio) return;
    this.audio.muted = Boolean(isMuted);
  }

  /**
   * Registers an event listener on the native audio element.
   */
  on(eventName, callback) {
    if (!this.audio) return () => {};
    this.audio.addEventListener(eventName, callback);
    return () => this.audio.removeEventListener(eventName, callback);
  }

  getDuration() {
    return this.audio?.duration || 0;
  }

  getCurrentTime() {
    return this.audio?.currentTime || 0;
  }

  destroy() {
    if (!this.audio) return;
    this.pause();
    this.audio.removeAttribute('src');
    this.audio = null;
  }
}

export const audioEngine = new AudioEngine();
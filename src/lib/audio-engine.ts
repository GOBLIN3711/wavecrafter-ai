export interface TrackConfig {
  title: string;
  titleRu: string;
  genre: string;
  type: 'warm-pads' | 'jazz-chords' | 'arpeggios' | 'ambient-drone' | 'soft-groove';
}

export const DEMO_TRACKS: TrackConfig[] = [
  { title: 'Golden Hour Lounge', titleRu: 'Golden Hour Lounge', genre: 'Ambient / Chill', type: 'warm-pads' },
  { title: 'Midnight Jazz Ambient', titleRu: 'Midnight Jazz Ambient', genre: 'Jazz / Lo-fi', type: 'jazz-chords' },
  { title: 'Terrace Sunset Vibes', titleRu: 'Terrace Sunset Vibes', genre: 'Tropical / Warm', type: 'arpeggios' },
  { title: 'Elegant Dinner Suite', titleRu: 'Elegant Dinner Suite', genre: 'Classical / Modern', type: 'ambient-drone' },
  { title: 'Late Night Bar Groove', titleRu: 'Late Night Bar Groove', genre: 'Electronic / Deep', type: 'soft-groove' },
];

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: AudioNode[] = [];
  private activeOscillators: OscillatorNode[] = [];
  private intervalIds: ReturnType<typeof setInterval>[] = [];
  private isPlaying = false;
  private currentTrackIndex = 0;
  private volume = 0.5;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private getMasterGain(): GainNode {
    if (!this.masterGain) {
      this.masterGain = this.getCtx().createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.getCtx().destination);
    }
    return this.masterGain;
  }

  private stopAll() {
    this.activeOscillators.forEach(osc => {
      try { osc.stop(); } catch { /* already stopped */ }
    });
    this.intervalIds.forEach(id => clearInterval(id));
    this.activeNodes.forEach(node => {
      try { node.disconnect(); } catch { /* already disconnected */ }
    });
    this.activeOscillators = [];
    this.activeNodes = [];
    this.intervalIds = [];
  }

  setVolume(v: number) {
    this.volume = v;
    if (this.masterGain) {
      this.masterGain.gain.value = v;
    }
  }

  getVolume() {
    return this.volume;
  }

  getCurrentTrackIndex() {
    return this.currentTrackIndex;
  }

  setCurrentTrackIndex(index: number) {
    this.currentTrackIndex = index;
    if (this.isPlaying) {
      this.stopAll();
      this.isPlaying = false;
      this.play();
    }
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    const ctx = this.getCtx();
    const master = this.getMasterGain();
    const track = DEMO_TRACKS[this.currentTrackIndex];

    switch (track.type) {
      case 'warm-pads':
        this.playWarmPads(ctx, master);
        break;
      case 'jazz-chords':
        this.playJazzChords(ctx, master);
        break;
      case 'arpeggios':
        this.playArpeggios(ctx, master);
        break;
      case 'ambient-drone':
        this.playAmbientDrone(ctx, master);
        break;
      case 'soft-groove':
        this.playSoftGroove(ctx, master);
        break;
    }
  }

  stop() {
    this.stopAll();
    this.isPlaying = false;
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  private createOsc(
    ctx: AudioContext,
    type: OscillatorType,
    frequency: number,
    gainValue: number
  ): OscillatorNode {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = frequency;

    const gain = ctx.createGain();
    gain.gain.value = gainValue;

    osc.connect(gain);
    gain.connect(this.getMasterGain());

    this.activeNodes.push(gain);
    this.activeOscillators.push(osc);

    return osc;
  }

  private createFilter(
    ctx: AudioContext,
    type: BiquadFilterType,
    frequency: number,
    q?: number
  ): BiquadFilterNode {
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    if (q !== undefined) filter.Q.value = q;
    this.activeNodes.push(filter);
    return filter;
  }

  private playWarmPads(ctx: AudioContext, master: GainNode) {
    // C major 7th pad: C3, E3, G3, B3
    const freqs = [130.81, 164.81, 196.0, 246.94];
    const now = ctx.currentTime;

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      // Add subtle vibrato
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.3 + i * 0.1;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 2;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 2);
      gain.gain.setValueAtTime(0.06, now + 6);
      gain.gain.linearRampToValueAtTime(0.04, now + 8);

      const filter = this.createFilter(ctx, 'lowpass', 800, 1);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      osc.start(now);
      lfo.start(now);
      this.activeOscillators.push(osc, lfo);
      this.activeNodes.push(gain, lfoGain, filter);
    });

    // Add a second layer of pads an octave higher
    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq * 2;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.02, now + 3);

      const filter = this.createFilter(ctx, 'lowpass', 600, 0.7);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      osc.start(now);
      this.activeOscillators.push(osc);
      this.activeNodes.push(gain);
    });
  }

  private playJazzChords(ctx: AudioContext, master: GainNode) {
    // Jazz ii-V-I progression: Dm7 -> G7 -> Cmaj7
    const chords = [
      [293.66, 349.23, 440.0, 523.25],   // Dm7: D4 F4 A4 C5
      [392.0, 493.88, 587.33, 698.46],   // G7: G4 B4 D5 F5
      [261.63, 329.63, 392.0, 493.88],   // Cmaj7: C4 E4 G4 B4
    ];
    const now = ctx.currentTime;
    let chordTime = 0;

    const playChord = (freqs: number[], startTime: number) => {
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;

        // Gentle detune for warmth
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = freq * 1.002;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.04, startTime + 0.5);
        gain.gain.linearRampToValueAtTime(0.03, startTime + 3);
        gain.gain.linearRampToValueAtTime(0, startTime + 4);

        const filter = this.createFilter(ctx, 'lowpass', 1200, 0.5);
        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(master);

        osc.start(startTime);
        osc.stop(startTime + 4);
        osc2.start(startTime);
        osc2.stop(startTime + 4);
        this.activeOscillators.push(osc, osc2);
        this.activeNodes.push(gain);
      });
    };

    // Play 3 cycles of the progression
    for (let cycle = 0; cycle < 4; cycle++) {
      chords.forEach((chord, ci) => {
        playChord(chord, now + chordTime);
        chordTime += 4;
      });
    }
  }

  private playArpeggios(ctx: AudioContext, master: GainNode) {
    // Cmaj7 arpeggio: C4, E4, G4, B4, C5
    const notes = [261.63, 329.63, 392.0, 493.88, 523.25];
    const now = ctx.currentTime;
    let noteIndex = 0;

    const playNote = () => {
      if (!this.isPlaying) return;
      const freq = notes[noteIndex % notes.length];
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;

      // Slight pitch variation
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 5;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 3;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 1.5);

      const filter = this.createFilter(ctx, 'lowpass', 2000, 2);
      const reverb = ctx.createBiquadFilter();
      reverb.type = 'allpass';
      reverb.frequency.value = 1500;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(reverb);
      reverb.connect(master);

      osc.start(t);
      osc.stop(t + 1.5);
      lfo.start(t);
      lfo.stop(t + 1.5);
      this.activeOscillators.push(osc, lfo);
      this.activeNodes.push(gain, lfoGain, filter, reverb);

      noteIndex++;
    };

    playNote();
    const id = setInterval(playNote, 600);
    this.intervalIds.push(id);
  }

  private playAmbientDrone(ctx: AudioContext, master: GainNode) {
    const now = ctx.currentTime;

    // Deep C2 drone
    const fundamentalFreq = 65.41;

    [1, 2, 3, 5, 7, 11].forEach((harmonic, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = fundamentalFreq * harmonic;

      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.1 + i * 0.05;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 1;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      const gain = ctx.createGain();
      const vol = 0.06 / harmonic;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(vol, now + 4);

      const filter = this.createFilter(ctx, 'lowpass', 400 + i * 100, 0.5);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      osc.start(now);
      lfo.start(now);
      this.activeOscillators.push(osc, lfo);
      this.activeNodes.push(gain, lfoGain);
    });

    // Add a high ethereal tone
    const ethereal = ctx.createOscillator();
    ethereal.type = 'sine';
    ethereal.frequency.value = 523.25; // C5

    const ethGain = ctx.createGain();
    ethGain.gain.setValueAtTime(0, now);
    ethGain.gain.linearRampToValueAtTime(0.015, now + 6);

    const ethFilter = this.createFilter(ctx, 'lowpass', 1000, 1);
    ethereal.connect(ethFilter);
    ethFilter.connect(ethGain);
    ethGain.connect(master);

    ethereal.start(now);
    this.activeOscillators.push(ethereal);
    this.activeNodes.push(ethGain);
  }

  private playSoftGroove(ctx: AudioContext, master: GainNode) {
    const now = ctx.currentTime;

    // Bass line - simple pattern
    const bassNotes = [65.41, 65.41, 87.31, 73.42]; // C2, C2, F2, D2
    let bassIndex = 0;

    const playBassNote = () => {
      if (!this.isPlaying) return;
      const freq = bassNotes[bassIndex % bassNotes.length];
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.02, t + 0.8);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 300;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      osc.start(t);
      osc.stop(t + 0.8);
      this.activeOscillators.push(osc);
      this.activeNodes.push(gain, filter);

      bassIndex++;
    };

    playBassNote();
    const bassInterval = setInterval(playBassNote, 800);
    this.intervalIds.push(bassInterval);

    // Hi-hat like noise pattern
    const playHat = () => {
      if (!this.isPlaying) return;
      const t = ctx.currentTime;

      const bufferSize = ctx.sampleRate * 0.05;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.03, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 8000;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      source.start(t);
      this.activeNodes.push(gain, filter);
    };

    playHat();
    const hatInterval = setInterval(playHat, 400);
    this.intervalIds.push(hatInterval);

    // Soft pad chord
    const padFreqs = [261.63, 311.13, 392.0]; // C4, Eb4, G4 - Cm
    padFreqs.forEach(freq => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.02, now + 3);

      const filter = this.createFilter(ctx, 'lowpass', 600, 0.7);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      osc.start(now);
      this.activeOscillators.push(osc);
      this.activeNodes.push(gain);
    });
  }
}

let engineInstance: AudioEngine | null = null;

export function getAudioEngine(): AudioEngine {
  if (!engineInstance) {
    engineInstance = new AudioEngine();
  }
  return engineInstance;
}

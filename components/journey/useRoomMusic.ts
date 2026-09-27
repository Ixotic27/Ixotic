"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type RoomMusicOptions = { chapter: number; paused: boolean; gamePlaying?: boolean };
type RoomMusic = { enabled: boolean; toggle: () => void };

const AMBIENT = { tempo: 116, root: 48, chord: [60, 64, 67], rhythm: [1, 1, 0, 1, 0, 1, 1, 0], notes: [60, 64, 67, 71, 69, 67, 64, 62] };
// Original arcade melody: short syncopated phrases with a square-wave lead.
const TENNIS_GAME = { tempo: 152, root: 45, chord: [57, 61, 64], rhythm: [1, 1, 0, 1, 1, 0, 1, 1], notes: [69, 76, 73, 81, 78, 73, 76, 71, 69, 73, 76, 83, 81, 76, 73, 71] };

// The voices are deliberately quiet at their own gains; this master level makes
// the music audible on laptop speakers without peaking when several overlap.
const VOLUME = 0.16;
const PROGRESSION = [0, 5, 7, 0];

export function useRoomMusic({ paused, gamePlaying = false }: RoomMusicOptions): RoomMusic {
  const [enabled, setEnabled] = useState(false);
  const enabledRef = useRef(enabled);
  const gamePlayingRef = useRef(gamePlaying);
  const pausedRef = useRef(paused);
  const contextRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const oscillatorsRef = useRef(new Set<OscillatorNode>());
  const stepRef = useRef(0);
  const gestureRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (transitionRef.current) clearTimeout(transitionRef.current);
    timerRef.current = null;
    transitionRef.current = null;
  }, []);

  const stopNotes = useCallback(() => {
    oscillatorsRef.current.forEach((oscillator) => {
      try { oscillator.stop(); } catch { /* already ended */ }
    });
    oscillatorsRef.current.clear();
  }, []);

  const fade = useCallback((target: number, seconds = 0.65) => {
    const context = contextRef.current;
    const master = masterRef.current;
    if (!context || !master) return;
    const now = context.currentTime;
    try {
      master.gain.cancelScheduledValues(now);
      master.gain.setTargetAtTime(target, now, seconds / 3);
    } catch { /* a browser may close the context during navigation */ }
  }, []);

  const scheduleNote = useCallback(function schedule() {
    const context = contextRef.current;
    const master = masterRef.current;
    if (!context || !master || context.state !== "running" || !enabledRef.current || pausedRef.current || document.hidden) return;

    const playingGame = gamePlayingRef.current;
    const motif = playingGame ? TENNIS_GAME : AMBIENT;
    const beat = 60 / motif.tempo;
    const beatIndex = stepRef.current;
    const transpose = PROGRESSION[Math.floor(beatIndex / 8) % PROGRESSION.length];
    const midi = motif.notes[beatIndex % motif.notes.length] + transpose;
    stepRef.current += 1;

    const playVoice = (pitch: number, duration: number, level: number, type: OscillatorType, delay = 0) => {
      try {
        const oscillator = context.createOscillator();
        const envelope = context.createGain();
        const start = context.currentTime + delay;
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(440 * Math.pow(2, (pitch - 69) / 12), start);
        envelope.gain.setValueAtTime(0, start);
        envelope.gain.linearRampToValueAtTime(level, start + Math.min(0.022, duration * 0.12));
        envelope.gain.setTargetAtTime(0.001, start + duration * 0.38, Math.max(0.025, duration * 0.16));
        oscillator.connect(envelope).connect(master);
        oscillator.onended = () => {
          oscillatorsRef.current.delete(oscillator);
          try { oscillator.disconnect(); envelope.disconnect(); } catch { /* already disconnected */ }
        };
        oscillatorsRef.current.add(oscillator);
        oscillator.start(start);
        oscillator.stop(start + duration);
      } catch { /* audio can become unavailable while the page is closing */ }
    };

    if (motif.rhythm[beatIndex % motif.rhythm.length]) {
      playVoice(midi, beat * 0.82, playingGame ? 0.21 : 0.28, playingGame ? "square" : "triangle");
      playVoice(midi + 12, beat * 0.42, 0.045, "sine");
    }
    // A light answering note between beats gives each room some forward motion.
    if (beatIndex % 2 === 1) {
      playVoice(motif.chord[(Math.floor(beatIndex / 2) + 1) % 3] + transpose + 12, beat * 0.34, 0.095, playingGame ? "square" : "triangle", beat * 0.5);
    }
    if (beatIndex % 4 === 0) playVoice(motif.root + transpose, beat * 2.2, 0.18, "triangle");
    if (beatIndex % 8 === 0) {
      motif.chord.forEach((pitch) => playVoice(pitch + transpose, beat * 3.1, 0.075, "sine"));
    }

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      schedule();
    }, beat * 1000);
  }, []);

  const startIfReady = useCallback(() => {
    const context = contextRef.current;
    if (!gestureRef.current || !context || transitionRef.current || !enabledRef.current || pausedRef.current || document.hidden) return;
    void context.resume().then(() => {
      if (!enabledRef.current || pausedRef.current || document.hidden) return;
      fade(VOLUME, 0.8);
      if (!timerRef.current) scheduleNote();
    }).catch(() => { /* autoplay or device policy can reject resume */ });
  }, [fade, scheduleNote]);

  const unlock = useCallback(() => {
    gestureRef.current = true;
    if (typeof window === "undefined" || !("AudioContext" in window)) return;
    try {
      if (!contextRef.current) {
        const context = new window.AudioContext();
        const master = context.createGain();
        master.gain.value = 0;
        master.connect(context.destination);
        contextRef.current = context;
        masterRef.current = master;
      }
      startIfReady();
    } catch { /* WebAudio is optional; the visual journey still works */ }
  }, [startIfReady]);

  const toggle = useCallback(() => {
    const next = !enabledRef.current;
    enabledRef.current = next;
    setEnabled(next);
    if (!next) {
      clearTimers();
      fade(0, 0.2);
      stopNotes();
    } else {
      unlock();
    }
  }, [clearTimers, fade, stopNotes, unlock]);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    gamePlayingRef.current = gamePlaying;
    stepRef.current = 0;
    if (!gestureRef.current || !enabledRef.current || pausedRef.current || document.hidden) return;
    clearTimers();
    fade(0, 0.2);
    stopNotes();
    transitionRef.current = setTimeout(() => {
      transitionRef.current = null;
      startIfReady();
    }, 260);
  }, [gamePlaying, clearTimers, fade, startIfReady, stopNotes]);

  useEffect(() => {
    pausedRef.current = paused;
    if (paused) {
      clearTimers();
      fade(0, 0.18);
      stopNotes();
      const context = contextRef.current;
      if (context?.state === "running") void context.suspend().catch(() => {});
    } else {
      startIfReady();
    }
  }, [paused, clearTimers, fade, startIfReady, stopNotes]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => { if (event.isTrusted && enabledRef.current) unlock(); };
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.isTrusted) return;
      if (enabledRef.current) unlock();
      if (event.repeat || event.key.toLowerCase() !== "m") return;
      const target = event.target;
      if (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      event.preventDefault();
      toggle();
    };
    const onVisibility = () => {
      const context = contextRef.current;
      if (document.hidden) {
        clearTimers();
        fade(0, 0.12);
        stopNotes();
        if (context?.state === "running") void context.suspend().catch(() => {});
      } else {
        startIfReady();
      }
    };
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimers();
      stopNotes();
      const context = contextRef.current;
      contextRef.current = null;
      masterRef.current = null;
      if (context) void context.close().catch(() => {});
    };
  }, [clearTimers, fade, startIfReady, stopNotes, toggle, unlock]);

  return { enabled, toggle };
}


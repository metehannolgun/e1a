import { useCallback } from 'react';

export function useSpeech() {
  const speak = useCallback((text, enabled = true) => {
    if (!enabled) return;
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.85;
    utterance.pitch = 1;
    
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(v => v.lang === 'es-ES') || 
                         voices.find(v => v.lang.startsWith('es'));
    if (spanishVoice) utterance.voice = spanishVoice;
    
    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak };
}

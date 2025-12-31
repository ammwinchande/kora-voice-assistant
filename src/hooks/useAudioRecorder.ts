import { useState, useRef, useCallback } from 'react';

interface UseAudioRecorderProps {
    onAudioData: (blob: Blob) => void;
}

export const useAudioRecorder = ({ onAudioData }: UseAudioRecorderProps) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // Setup Audio Context for Analysis
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = audioContext;
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256; // Resolution
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            analyserRef.current = analyser;

            // Setup MediaRecorder for capturing data
            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                ? 'audio/webm;codecs=opus'
                : 'audio/webm';

            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    onAudioData(event.data);
                }
            };

            mediaRecorder.start(250); // Chunk every 250ms
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    }, [onAudioData]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            // Cleanup AudioContext
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            setIsRecording(false);
        }
    }, [isRecording]);

    return { isRecording, startRecording, stopRecording, analyser: analyserRef.current };
};

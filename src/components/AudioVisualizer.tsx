import { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
    isRecording: boolean;
    analyser: AnalyserNode | null;
}

export const AudioVisualizer = ({ isRecording, analyser }: AudioVisualizerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;

            ctx.clearRect(0, 0, width, height);

            if (isRecording && analyser) {
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                analyser.getByteTimeDomainData(dataArray);

                ctx.lineWidth = 3;
                // Gradient stroke
                const gradient = ctx.createLinearGradient(0, 0, width, 0);
                gradient.addColorStop(0, '#3b82f6'); // Blue-500
                gradient.addColorStop(0.5, '#8b5cf6'); // Violet-500
                gradient.addColorStop(1, '#ec4899'); // Pink-500
                ctx.strokeStyle = gradient;

                ctx.beginPath();

                const sliceWidth = width * 1.0 / bufferLength;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    const v = dataArray[i] / 128.0; // Normalize 0..1 centered at 128->1? No 128 is center (0)
                    // Uint8: 128 is silence. 0 is -1, 255 is +1.

                    const y = (v * height) / 2; // Center it

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }

                    x += sliceWidth;
                }

                ctx.lineTo(canvas.width, height / 2);
                ctx.stroke();
            } else {
                // Idle state: Flat line or subtle pulse
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.beginPath();
                ctx.moveTo(0, height / 2);
                ctx.lineTo(width, height / 2);
                ctx.stroke();
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, [isRecording, analyser]);

    return (
        <canvas
            ref={canvasRef}
            width={400}
            height={150}
            className="w-full h-40"
        />
    );
};

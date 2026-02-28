import { useEffect, useRef } from "react";
import { Pause, Mic, Zap } from "lucide-react"; // Added icons for status

const AudioVisualizer = ({ stream, isRecording, isPaused, recordingTime }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);

  // Helper to format time (assuming you pass it from parent)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    // Cleanup function for useEffect
    const cleanup = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }

      audioContextRef.current = null;
      analyserRef.current = null;
    };


    if (!stream || !isRecording) {
      cleanup();
      return;
    }

    // --- Setup Web Audio API ---
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);

    // Configure Analyser
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.7; // Slightly smoother movement
    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const bufferLength = analyser.frequencyBinCount; // 128
    const dataArray = new Uint8Array(bufferLength);
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    const barPadding = 2; // Space between bars

    const draw = () => {
      if (!isRecording) return;

      if (isPaused) {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        return;
      }


      animationRef.current = requestAnimationFrame(draw);

      // Get Frequency Data for Bar Graph
      analyser.getByteFrequencyData(dataArray);

      // Clear canvas
      ctx.fillStyle = "rgb(255, 255, 255)"; // Clean white background
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      const barCount = bufferLength; // 128 bars
      const barWidth = WIDTH / barCount - barPadding;
      let x = barPadding;

      // Define colors based on status
      const activeColor1 = "rgb(37, 99, 235)"; // Blue 600
      const activeColor2 = "rgb(79, 70, 229)"; // Indigo 600
      const pausedColor1 = "rgb(245, 158, 11)"; // Amber 600
      const pausedColor2 = "rgb(251, 191, 36)"; // Amber 400

      for (let i = 0; i < barCount; i++) {
        // Scale the data: 0 to 255 -> 0 to Height
        let barHeight = (dataArray[i] / 255) * HEIGHT;

        // Ensure a minimum height for visibility
        if (barHeight < 2) {
          barHeight = 2;
        }

        // Smooth bar gradient
        const gradient = ctx.createLinearGradient(
          x,
          HEIGHT - barHeight,
          x,
          HEIGHT
        );

        if (isPaused) {
          gradient.addColorStop(0, pausedColor1);
          gradient.addColorStop(1, pausedColor2);
        } else {
          gradient.addColorStop(0, activeColor1);
          gradient.addColorStop(1, activeColor2);
        }

        ctx.fillStyle = gradient;

        // Draw the bar (fillRect does not support border radius, but looks cleaner)
        // We draw a vertical line from the bottom up.
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + barPadding;
      }
    };

    // Start drawing only if not paused initially
    if (!isPaused) {
      draw();
    }

    return cleanup;
  }, [stream, isRecording]);
  useEffect(() => {
    if (!audioContextRef.current) return;

    if (isPaused) {
      audioContextRef.current.suspend();
    } else {
      audioContextRef.current.resume();
    }
  }, [isPaused]);

  if (!isRecording) return null;

  // --- RENDER ---
  return (
    <div className="mt-6 p-4 rounded-xl shadow-inner bg-white border border-gray-100">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {isPaused ? (
            <Pause className="w-5 h-5 text-amber-500" />
          ) : (
            <Mic className="w-5 h-5 text-blue-600 animate-pulse" />
          )}
          <span
            className={`text-base font-bold ${
              isPaused ? "text-amber-700" : "text-blue-700"
            }`}
          >
            {isPaused ? "Recording Paused" : "LIVE Input"}
          </span>
        </div>
        {/* Optional: Add timer here for completeness if you pass the state */}
        {recordingTime !== undefined && (
          <div className="text-sm font-mono text-gray-600">
            Duration: {formatTime(recordingTime)}
          </div>
        )}
      </div>

      {/* Canvas Container */}
      <div className="w-full h-24 overflow-hidden rounded-lg shadow-sm bg-white border border-gray-200">
        <canvas
          ref={canvasRef}
          width={800} // Set a fixed width for internal calculations
          height={100} // Set a fixed height
          className="w-full h-full"
        />
      </div>

      {isPaused && (
        <p className="mt-2 text-xs text-center text-amber-500">
          Microphone stream is paused. Click 'Resume' to continue visualization.
        </p>
      )}
    </div>
  );
};

export default AudioVisualizer;

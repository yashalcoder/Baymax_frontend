"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AudioVisualizer from "@/components/AudioVisulaizer";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  X,
  ArrowLeft,
  Mic,
  Square,
  Play,
  Pause,
  Save,
  FileText,
  Clock,
  Download,
  Copy,
  Trash2,
  Settings,
  Upload,
} from "lucide-react";
import Navbar from "../../../components/Navbar";

const Transcription = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [audioBlob, setAudioBlob] = useState(null);
  const [urduAudioBlob, setUrduAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const endpoint = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [urduTranscription, setUrduTranscription] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [uploadedFile,setUploadedFile]=useState("");
  const [summary, setSummary] = useState(null);
  // Timer effect

  // --- NEW REFS FOR VISUALIZATION ---
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioContextRef = useRef(null);
  // ------------------------------------

  const [user, setUser] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    }
  }, []);

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };
const handleUploadFile = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'audio/*,video/*'; // Adjust file types as needed
  input.onchange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile({
        file: file,
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.type
      });
    }
  };
  input.click();
};
// Remove file handler
const handleRemoveFile = () => {
  if (uploadedFile?.url) {
    URL.revokeObjectURL(uploadedFile.url);
  }
  setUploadedFile(null);
};
  const handleStartRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;

      // Try different MIME types based on browser support
      let mimeType = "audio/webm";
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm";
      } else if (MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")) {
        mimeType = "audio/ogg;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mimeType = "audio/mp4";
      }

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Collect audio data
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);

        setAudioBlob(audioBlob);
        setUrduAudioBlob(audioBlob);
        setAudioURL(audioUrl);

        console.log(
          "Recording stopped. Blob size:",
          audioBlob.size,
          "Type:",
          mimeType
        );

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setRecordingTime(0);

      console.log("Recording started with MIME type:", mimeType);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
      Swal.fire({
        title: "The Internet?",
        text: "That thing is still around?",
        icon: "question",
      });
    }
  };

  const handlePauseResume = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  const handleStopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
    setIsPaused(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleDownloadAudio = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `recording-urdu${new Date().toISOString()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  const handleDownloadUrduAudio = () => {
    if (urduAudioBlob) {
      const url = URL.createObjectURL(urduAudioBlob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `recording-${new Date().toISOString()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
//  const token = localStorage.getItem("token");//removng from here and passing in below functio fro build erro

const handleSendToWhisper = async () => {
  const token = localStorage.getItem("token");
  if (!audioBlob && !uploadedFile) {
    Swal.fire({ title: "No Audio", text: "Please record audio first!", icon: "warning" });
    return;
  }

  setIsTranscribing(true);

  // ✅ Most recent patient fetch karo
  let patientId;
  try {
    const patientRes = await fetch(`${endpoint}/api/doctors/old-patient`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const patientData = await patientRes.json();

    if (patientData.status !== "success") {
      Swal.fire({ title: "No Patient", text: "Koi patient assign nahi hua!", icon: "warning" });
      setIsTranscribing(false);
      return;
    }

    patientId = patientData.data.patientId;
    localStorage.setItem("patientId", patientId);

  } catch (err) {
    Swal.fire({ title: "Error", text: "Patient fetch nahi hua!", icon: "error" });
    setIsTranscribing(false);
    return;
  }

  const formData = new FormData();

  if (uploadedFile) {
    formData.append("audio", uploadedFile.file, uploadedFile.name);
  } else {
    formData.append("audio", audioBlob, "recording.webm");
  }

  formData.append("language", selectedLanguage);
  // formData.append("patientId", "69a45ddb81adf47896c0cf74");
  // localStorage.setItem("patientId", "69a45ddb81adf47896c0cf74");
  // doctorId hatao — backend JWT se nikalega
formData.append("patientId", patientId);
  try {
    const response = await fetch(`${endpoint}/api/transcribe`, {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Response data:", data);

    if (data.consultationId) {
      localStorage.setItem("consultationId", data.consultationId);
      console.log("Stored consultationId:", data.consultationId);
    }

    if (
      data.transcription?.conversation &&
      Array.isArray(data.transcription.conversation) &&
      data.transcription.conversation.length > 0
    ) {
      const englishText = data.transcription.conversation
        .map((item) => `${item.speaker} (${item.timestamp}): ${item.english}`)
        .join("\n\n");

      const urduText = data.transcription.conversation
        .map((item) => `${item.speaker} (${item.timestamp}): ${item.urdu}`)
        .join("\n\n");

      setTranscription(englishText);
      setUrduTranscription(urduText);
if (data.transcription?.summary) {
  setSummary(data.transcription.summary);
}
      Swal.fire({
        title: "Transcription Complete!",
        text: `Successfully transcribed ${data.transcription.conversation.length} utterance(s)`,
        icon: "success",
      });
    } else {
      setTranscription(data.full_transcript || "No transcription available");
      setUrduTranscription("No Urdu transcription available");

      Swal.fire({
        title: "Transcription Complete",
        text: "No speaker-separated conversation detected",
        icon: "info",
      });
    }

    // ← Fixed crash
    if (audioBlob) {
      console.log("Audio blob size:", (audioBlob.size / 1024).toFixed(2), "KB");
    }

  } catch (error) {
    console.error("Error sending to Whisper:", error);
    Swal.fire({
      title: "Transcription Error",
      text: error.message || "Error processing audio. Please try again.",
      icon: "error",
    });
  } finally {
    setIsTranscribing(false);
  }
};
  const handleClearTranscription = () => {
    if (confirm("Are you sure you want to clear the transcription?")) {
      setTranscription("");
      setTranscription("");
      setRecordingTime(0);
      setAudioBlob(null);
      setAudioURL(null);
    }
  };
  const handleClearUrduTranscription = () => {
    if (confirm("Are you sure you want to clear the transcription?")) {
      setUrduTranscription("");
      setUrduTranscription("");
      setRecordingTime(0);
      setUrduAudioBlob(null);
      setAudioURL(null);
    }
  };
  const handleCopyTranscription = () => {
    navigator.clipboard.writeText(transcription);
    alert("Transcription copied to clipboard!");
    Swal.fire({
      title: "Transcription successfull!",
      text: "My name is Youshal, and I work here.",
      icon: "success",
    });
  };
  const handleCopyUrduTranscription = () => {
    navigator.clipboard.writeText(urduTranscription);
    alert("Transcription copied to clipboard!");
  };
  const handleDownloadTranscription = () => {
    const element = document.createElement("a");
    const file = new Blob([transcription], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `transcription-${new Date().toISOString()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  const handleDownloadUrduTranscription = () => {
    const element = document.createElement("a");
    const file = new Blob([urduTranscription], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `transcription-urdu-${new Date().toISOString()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const languages = [
    { code: "en", name: "English", label: "English" },
    { code: "ur", name: "Urdu", label: "اردو" },
    { code: "pa", name: "Punjabi", label: "ਪੰਜਾਬੀ" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Speech Transcription & Recording
            </h2>
            <p className="text-gray-600 mt-1">
              Record patient consultations with real-time audio capture
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/doctor")}
            className="border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Recording Controls Card */}
        <Card className="shadow-lg border-gray-200">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Mic className="w-5 h-5 text-blue-600" />
                  </div>
                  Recording Controls
                </CardTitle>
                <CardDescription className="mt-2">
                  Record from microphone and prepare audio for transcription
                </CardDescription>
              </div>

              {/* Recording Timer */}
              {isRecording && (
                <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl border-2 border-blue-200 shadow-sm">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isPaused
                        ? "bg-amber-500"
                        : "bg-red-500 animate-pulse shadow-lg shadow-red-500/50"
                    }`}
                  />
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-2xl font-mono font-bold text-gray-900">
                      {formatTime(recordingTime)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {/* Language Selection */}
            {/* <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Language for Transcription
              </label>
              <div className="flex gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    disabled={isRecording}
                    className={`px-6 py-3 rounded-xl border-2 transition-all font-medium ${
                      selectedLanguage === lang.code
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                    } ${isRecording ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div> */}
            {/* Display uploaded file */}
{uploadedFile && (
  <div className="m-6 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-semibold text-purple-900">Uploaded File</h3>
      <Button
        size="sm"
        variant="ghost"
        className="text-red-500 hover:text-red-700"
        onClick={handleRemoveFile}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
    <p className="text-sm text-gray-600 mb-3">{uploadedFile.name}</p>
    {uploadedFile.type.startsWith('audio/') ? (
      <audio controls className="w-full">
        <source src={uploadedFile.url} type={uploadedFile.type} />
      </audio>
    ) : (
      <video controls className="w-full max-h-64">
        <source src={uploadedFile.url} type={uploadedFile.type} />
      </video>
    )}
  </div>
)}
            <AudioVisualizer
              stream={streamRef.current}
              isRecording={isRecording}
              isPaused={isPaused}
            />

            {/* Recording Buttons */}
            <div className="flex flex-wrap gap-4">
              {!isRecording ? (
                <>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all px-8"
                  onClick={handleStartRecording}
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Start Recording
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all px-8"
                  onClick={handleUploadFile}
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload File
                </Button>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-amber-500 text-amber-600 hover:bg-amber-50 px-8"
                    onClick={handlePauseResume}
                  >
                    {isPaused ? (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="w-5 h-5 mr-2" />
                        Pause
                      </>
                    )}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-red-500 text-red-600 hover:bg-red-50 px-8"
                    onClick={handleStopRecording}
                  >
                    <Square className="w-5 h-5 mr-2" />
                    Stop Recording
                  </Button>
                </>
              )}


              {/* Download and Send to Whisper buttons */}
              {((audioBlob && !isRecording) || uploadedFile) && (
                <>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-green-500 text-green-600 hover:bg-green-50 px-8"
                    onClick={handleDownloadAudio}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Audio
                  </Button>

                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl px-8"
                    onClick={handleSendToWhisper}
                    disabled={isTranscribing || (!audioBlob && !uploadedFile)} // Disable when loading or no audio
                  >
                    {isTranscribing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Transcribe</>
                    )}
                  </Button>
                </>
              )}
            </div>

            {/* Recording Status */}
            {isRecording && (
              <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    <span className="text-sm font-semibold text-gray-900">
                      {isPaused
                        ? "Recording Paused - Click Resume to continue"
                        : "Recording in Progress - Audio being captured from microphone"}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-blue-300 text-blue-700 bg-white"
                  >
                    {languages.find((l) => l.code === selectedLanguage)?.name}
                  </Badge>
                </div>
              </div>
            )}

            {/* Audio Preview */}
            {audioURL && !isRecording && (
              <div className="mt-6 p-5 rounded-xl bg-green-50 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      Recording Complete! ✅
                    </p>
                    <audio controls src={audioURL} className="w-full max-w-md">
                      Your browser does not support audio playback.
                    </audio>
                    <p className="text-xs text-gray-600 mt-2">
                      File size:{" "}
                      {audioBlob ? (audioBlob.size / 1024).toFixed(2) : 0} KB
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* LEFT SIDE — Transcriptions (English + Urdu) */}
  <div className="space-y-4">
    {/* English Transcription */}
    <Card className="shadow-lg border-gray-200">
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            English Transcription
          </CardTitle>
          <CardDescription className="mt-2">
            Speaker-separated English output • Click to edit
          </CardDescription>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <Button variant="outline" size="sm" onClick={handleCopyTranscription} disabled={!transcription} className="border-gray-300 hover:bg-gray-50">
            <Copy className="w-4 h-4 mr-2" /> Copy
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadTranscription} disabled={!transcription} className="border-gray-300 hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" /> Download
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearTranscription} disabled={!transcription} className="border-red-300 text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4 mr-2" /> Clear
          </Button>
          <Button size="sm" disabled={!transcription} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <Save className="w-4 h-4 mr-2" /> Save
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Textarea
          placeholder="English transcription will appear here..."
          className="min-h-[300px] text-base resize-none border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent p-4 leading-relaxed"
          value={transcription}
          onChange={(e) => setTranscription(e.target.value)}
        />
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <span className="font-medium">{transcription.length} characters</span>
          <span>•</span>
          <span className="font-medium">{transcription.split(/\s+/).filter(Boolean).length} words</span>
        </div>
      </CardContent>
    </Card>

    {/* Urdu Transcription */}
    <Card className="shadow-lg border-gray-200">
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            Urdu Transcription — اردو
          </CardTitle>
          <CardDescription className="mt-2">
            Speaker-separated Urdu output • Click to edit
          </CardDescription>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <Button variant="outline" size="sm" onClick={handleCopyUrduTranscription} disabled={!urduTranscription} className="border-gray-300 hover:bg-gray-50">
            <Copy className="w-4 h-4 mr-2" /> Copy
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadUrduTranscription} disabled={!urduTranscription} className="border-gray-300 hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" /> Download
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearUrduTranscription} disabled={!urduTranscription} className="border-red-300 text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4 mr-2" /> Clear
          </Button>
          <Button size="sm" disabled={!urduTranscription} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <Save className="w-4 h-4 mr-2" /> Save
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Textarea
          dir="rtl"
          placeholder="اردو ٹرانسکرپشن یہاں ظاہر ہوگی..."
          className="min-h-[300px] text-base resize-none border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent p-4 leading-relaxed text-right"
          value={urduTranscription}
          onChange={(e) => setUrduTranscription(e.target.value)}
        />
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <span className="font-medium">{urduTranscription.length} characters</span>
          <span>•</span>
          <span className="font-medium">{urduTranscription.split(/\s+/).filter(Boolean).length} words</span>
        </div>
      </CardContent>
    </Card>
  </div>

  {/* RIGHT SIDE — Summary (English + Urdu) */}
  <div className="space-y-4">
    {/* English Summary */}
    <Card className="shadow-lg border-gray-200">
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-white to-emerald-50">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            Consultation Summary — English
          </CardTitle>
          <CardDescription className="mt-2">
            AI-generated summary of the consultation
          </CardDescription>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            disabled={!summary?.english}
            onClick={() => navigator.clipboard.writeText(summary?.english || "")}
            className="border-gray-300 hover:bg-gray-50"
          >
            <Copy className="w-4 h-4 mr-2" /> Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!summary?.english}
            onClick={() => {
              const el = document.createElement("a");
              el.href = URL.createObjectURL(new Blob([summary?.english || ""], { type: "text/plain" }));
              el.download = `summary-english-${new Date().toISOString()}.txt`;
              el.click();
            }}
            className="border-gray-300 hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" /> Download
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {summary?.english ? (
          <div className="min-h-[300px] p-4 bg-emerald-50 border-2 border-emerald-100 rounded-xl text-base leading-relaxed text-gray-800 whitespace-pre-wrap">
            {summary.english}
          </div>
        ) : (
          <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-gray-200 rounded-xl">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-400 text-sm">
              Summary will appear here after transcription
            </p>
          </div>
        )}
      </CardContent>
    </Card>

    {/* Urdu Summary */}
    <Card className="shadow-lg border-gray-200">
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-white to-amber-50">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            خلاصہ — اردو
          </CardTitle>
          <CardDescription className="mt-2">
            مشاورت کا خلاصہ اردو میں
          </CardDescription>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            disabled={!summary?.urdu}
            onClick={() => navigator.clipboard.writeText(summary?.urdu || "")}
            className="border-gray-300 hover:bg-gray-50"
          >
            <Copy className="w-4 h-4 mr-2" /> Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!summary?.urdu}
            onClick={() => {
              const el = document.createElement("a");
              el.href = URL.createObjectURL(new Blob([summary?.urdu || ""], { type: "text/plain" }));
              el.download = `summary-urdu-${new Date().toISOString()}.txt`;
              el.click();
            }}
            className="border-gray-300 hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" /> Download
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {summary?.urdu ? (
          <div dir="rtl" className="min-h-[300px] p-4 bg-amber-50 border-2 border-amber-100 rounded-xl text-base leading-relaxed text-gray-800 whitespace-pre-wrap text-right">
            {summary.urdu}
          </div>
        ) : (
          <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-gray-200 rounded-xl">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-400 text-sm">
              خلاصہ ٹرانسکرپشن کے بعد یہاں ظاہر ہوگا
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  </div>
</div>
      </div>
    </div>
  );
};

export default Transcription;

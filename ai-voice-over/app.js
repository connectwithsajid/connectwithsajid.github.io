const recorderTypes = [
  "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
  "video/mp4;codecs=h264,aac",
  "video/mp4",
  "video/webm;codecs=vp9,opus",
  "video/webm;codecs=vp8,opus",
  "video/webm",
];

const audioRecorderTypes = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
];

const maxTranscriptionAudioBytes = 20 * 1024 * 1024;
const storedKeyName = "connectwithsajid.groqApiKey";

const state = {
  videoFile: null,
  videoUrl: "",
  generatedAudioUrl: "",
  resultUrl: "",
  generatedAudioBlob: null,
  isRendering: false,
  cancelRender: null,
};

const el = {
  audioCard: document.querySelector("[data-audio-card]"),
  audioName: document.querySelector("[data-audio-name]"),
  audioPreview: document.querySelector("[data-audio-preview]"),
  apiKey: document.querySelector("[data-api-key]"),
  cancel: document.querySelector("[data-cancel]"),
  complete: document.querySelector("[data-complete]"),
  download: document.querySelector("[data-download]"),
  downloadCard: document.querySelector("[data-download-card]"),
  emptyState: document.querySelector("[data-empty-state]"),
  error: document.querySelector("[data-error]"),
  fileName: document.querySelector("[data-file-name]"),
  fitVoice: document.querySelector("[data-fit-voice]"),
  fullscreen: document.querySelector("[data-fullscreen]"),
  generate: document.querySelector("[data-generate]"),
  instructions: document.querySelector("[data-instructions]"),
  mute: document.querySelector("[data-mute]"),
  outputName: document.querySelector("[data-output-name]"),
  outputSize: document.querySelector("[data-output-size]"),
  outputType: document.querySelector("[data-output-type]"),
  play: document.querySelector("[data-play]"),
  previewVideo: document.querySelector("[data-preview-video]"),
  progress: document.querySelector("[data-progress]"),
  prompt: document.querySelector("[data-prompt]"),
  rememberKey: document.querySelector("[data-remember-key]"),
  render: document.querySelector("[data-render]"),
  status: document.querySelector("[data-status]"),
  transcript: document.querySelector("[data-transcript]"),
  videoDuration: document.querySelector("[data-video-duration]"),
  videoInput: document.querySelector("[data-video-input]"),
  videoSize: document.querySelector("[data-video-size]"),
  voice: document.querySelector("[data-voice]"),
  volume: document.querySelector("[data-volume]"),
};

function setStatus(message) {
  el.status.textContent = message;
}

function setProgress(value) {
  el.progress.style.width = `${Math.round(Math.max(0, Math.min(value, 1)) * 100)}%`;
}

function setError(message) {
  el.error.hidden = !message;
  el.error.textContent = message || "";
  if (message) {
    setStatus("Needs attention");
  }
}

function setBusy(isBusy) {
  const hasTranscript = Boolean(el.transcript.value.trim());
  el.generate.disabled = isBusy || (!state.videoFile && !hasTranscript);
  el.render.disabled = isBusy || !state.generatedAudioBlob || !state.videoFile;
  el.cancel.disabled = !state.isRendering;
}

function clearObjectUrl(key) {
  if (state[key]) {
    URL.revokeObjectURL(state[key]);
    state[key] = "";
  }
}

function formatDuration(value) {
  if (!value || !Number.isFinite(value)) {
    return "--:--";
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatSize(size) {
  if (!size) {
    return "--";
  }

  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function pickRecorderType() {
  if (typeof MediaRecorder === "undefined") {
    return "";
  }

  return recorderTypes.find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function pickAudioRecorderType() {
  if (typeof MediaRecorder === "undefined") {
    return "";
  }

  return audioRecorderTypes.find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function outputName(videoName, mimeType) {
  const baseName = videoName.replace(/\.[^.]+$/, "") || "video";
  const extension = mimeType.includes("mp4") ? "mp4" : "webm";
  return `${baseName}-ai-voice.${extension}`;
}

function extractedAudioName(videoName, mimeType) {
  const baseName = videoName.replace(/\.[^.]+$/, "") || "video";
  const extension = mimeType.includes("mp4") ? "m4a" : "webm";
  return `${baseName}-speech.${extension}`;
}

function waitForMetadata(media) {
  return new Promise((resolve, reject) => {
    if (media.readyState >= 1) {
      resolve();
      return;
    }

    const cleanup = () => {
      media.removeEventListener("loadedmetadata", onLoaded);
      media.removeEventListener("error", onError);
    };
    const onLoaded = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("Could not read the selected media file."));
    };

    media.addEventListener("loadedmetadata", onLoaded);
    media.addEventListener("error", onError);
    media.load();
  });
}

async function extractAudioFromVideo(videoFile, onProgress) {
  if (typeof MediaRecorder === "undefined") {
    throw new Error("This browser does not support audio extraction.");
  }

  const video = document.createElement("video");
  const url = URL.createObjectURL(videoFile);
  let audioContext = null;
  let rafId = 0;

  try {
    video.src = url;
    video.preload = "auto";
    video.playsInline = true;

    await waitForMetadata(video);

    audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(video);
    const destination = audioContext.createMediaStreamDestination();
    source.connect(destination);

    if (!destination.stream.getAudioTracks().length) {
      throw new Error("No audio track was found in this video.");
    }

    const mimeType = pickAudioRecorderType();
    const recorder = new MediaRecorder(destination.stream, mimeType ? { mimeType } : undefined);
    const chunks = [];

    const stopped = new Promise((resolve, reject) => {
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      recorder.onerror = () => reject(new Error("Audio extraction failed."));
      recorder.onstop = () => resolve();
    });

    const trackProgress = () => {
      if (video.duration) {
        onProgress(Math.min(video.currentTime / video.duration, 1));
      }

      if (!video.ended && !video.paused) {
        rafId = window.requestAnimationFrame(trackProgress);
      }
    };

    video.addEventListener("ended", () => {
      if (recorder.state !== "inactive") {
        recorder.stop();
      }
    }, { once: true });

    recorder.start(1000);
    await audioContext.resume();
    await video.play();
    rafId = window.requestAnimationFrame(trackProgress);
    await stopped;

    const recordedMime = recorder.mimeType || mimeType || "audio/webm";
    const blob = new Blob(chunks, { type: recordedMime });

    if (!blob.size) {
      throw new Error("No audio could be extracted from this video.");
    }

    return new File([blob], extractedAudioName(videoFile.name, recordedMime), {
      type: recordedMime,
    });
  } finally {
    window.cancelAnimationFrame(rafId);
    video.pause();
    if (audioContext) {
      await audioContext.close().catch(() => undefined);
    }
    URL.revokeObjectURL(url);
  }
}

async function groqFetch(url, apiKey, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body,
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    const message = contentType.includes("application/json")
      ? JSON.stringify(await response.json())
      : await response.text();
    throw new Error(message || "Groq request failed.");
  }

  return response;
}

function browserApiError(error) {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
    return "The browser could not call Groq directly. This is usually CORS or network blocking. GitHub Pages can host the UI, but this endpoint may need a small backend proxy.";
  }

  return message;
}

async function transcribeAudio(apiKey, audioFile) {
  const body = new FormData();
  body.append("file", audioFile);
  body.append("model", "whisper-large-v3-turbo");
  body.append("response_format", "json");

  const prompt = el.prompt.value.trim();
  if (prompt) {
    body.append("prompt", prompt);
  }

  const response = await groqFetch("https://api.groq.com/openai/v1/audio/transcriptions", apiKey, body);
  const payload = await response.json();
  return (payload.text || "").trim();
}

async function generateSpeech(apiKey, transcript) {
  const instructions = el.instructions.value.trim();
  const vocalDirection = instructions
    ? `[${instructions.replace(/[[\]]/g, "")}] `
    : "";
  const response = await fetch("https://api.groq.com/openai/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "canopylabs/orpheus-v1-english",
      input: `${vocalDirection}${transcript}`,
      voice: el.voice.value,
      response_format: "wav",
    }),
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    const message = contentType.includes("application/json")
      ? JSON.stringify(await response.json())
      : await response.text();
    throw new Error(message || "Could not generate AI voice.");
  }

  return response.blob();
}

async function generateAiVoice() {
  const transcriptInput = el.transcript.value.trim();

  if (!state.videoFile && !transcriptInput) {
    return;
  }

  const apiKey = el.apiKey.value.trim();
  if (!apiKey) {
    setError("Add a Groq API key before generating the AI voice.");
    return;
  }

  if (el.rememberKey.checked) {
    localStorage.setItem(storedKeyName, apiKey);
  } else {
    localStorage.removeItem(storedKeyName);
  }

  setBusy(true);
  setError("");
  setProgress(0);
  setStatus(transcriptInput ? "Generating AI voice" : "Extracting audio");
  clearObjectUrl("generatedAudioUrl");
  clearObjectUrl("resultUrl");
  state.generatedAudioBlob = null;
  el.audioCard.hidden = true;
  el.downloadCard.hidden = true;
  el.complete.hidden = true;

  try {
    let transcript = transcriptInput;

    if (!transcript) {
      const audioFile = await extractAudioFromVideo(state.videoFile, (ratio) => {
        setProgress(ratio * 0.25);
      });

      if (audioFile.size > maxTranscriptionAudioBytes) {
        throw new Error(`The extracted audio is ${formatSize(audioFile.size)}. Automatic transcription needs extracted audio under 20 MB. Paste a transcript, or use a shorter/compressed video.`);
      }

      setStatus("Understanding speech");
      setProgress(0.3);
      transcript = await transcribeAudio(apiKey, audioFile);

      if (!transcript) {
        throw new Error("Groq returned an empty transcript.");
      }

      el.transcript.value = transcript;
    }

    setStatus("Generating AI voice");
    setProgress(0.5);
    const audioBlob = await generateSpeech(apiKey, transcript);
    state.generatedAudioBlob = audioBlob;
    state.generatedAudioUrl = URL.createObjectURL(audioBlob);

    el.audioPreview.src = state.generatedAudioUrl;
    el.audioName.textContent = `${(state.videoFile?.name || "voiceover").replace(/\.[^.]+$/, "") || "voiceover"}-ai.wav`;
    el.audioCard.hidden = false;
    el.render.disabled = !state.videoFile;
    setProgress(0.65);
    setStatus("AI voice ready");
  } catch (error) {
    setError(browserApiError(error));
  } finally {
    setBusy(false);
  }
}

async function renderVideo() {
  if (!state.videoFile || !state.generatedAudioUrl || typeof MediaRecorder === "undefined") {
    return;
  }

  state.isRendering = true;
  setBusy(true);
  setError("");
  clearObjectUrl("resultUrl");
  el.downloadCard.hidden = true;
  el.complete.hidden = true;
  setProgress(0.65);
  setStatus("Rendering video");

  const workVideo = document.createElement("video");
  const workAudio = document.createElement("audio");
  const videoObjectUrl = URL.createObjectURL(state.videoFile);
  let rafId = 0;
  let stopRequested = false;
  let audioContext = null;
  let combinedStream = null;

  try {
    workVideo.src = videoObjectUrl;
    workVideo.muted = true;
    workVideo.playsInline = true;
    workVideo.preload = "auto";

    workAudio.src = state.generatedAudioUrl;
    workAudio.preload = "auto";

    await Promise.all([waitForMetadata(workVideo), waitForMetadata(workAudio)]);

    if (
      el.fitVoice.checked &&
      Number.isFinite(workAudio.duration) &&
      Number.isFinite(workVideo.duration) &&
      workAudio.duration > 0 &&
      workVideo.duration > 0
    ) {
      workAudio.playbackRate = Math.min(Math.max(workAudio.duration / workVideo.duration, 0.75), 1.5);
    }

    const width = workVideo.videoWidth || 1280;
    const height = workVideo.videoHeight || 720;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) {
      throw new Error("Could not prepare the video canvas.");
    }

    const canvasStream = canvas.captureStream(30);
    audioContext = new AudioContext();
    const audioSource = audioContext.createMediaElementSource(workAudio);
    const audioDestination = audioContext.createMediaStreamDestination();
    audioSource.connect(audioDestination);

    combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...audioDestination.stream.getAudioTracks(),
    ]);

    const mimeType = pickRecorderType();
    const recorder = new MediaRecorder(combinedStream, mimeType ? { mimeType } : undefined);
    const chunks = [];

    const stopped = new Promise((resolve, reject) => {
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      recorder.onerror = () => reject(new Error("Rendering failed."));
      recorder.onstop = () => resolve();
    });

    const stopRecorder = () => {
      if (recorder.state !== "inactive") {
        recorder.stop();
      }
    };

    state.cancelRender = () => {
      stopRequested = true;
      setStatus("Cancelling");
      workVideo.pause();
      workAudio.pause();
      stopRecorder();
    };

    const drawFrame = () => {
      context.drawImage(workVideo, 0, 0, width, height);
      const ratio = workVideo.duration ? Math.min(workVideo.currentTime / workVideo.duration, 1) : 0;
      setProgress(0.65 + ratio * 0.35);

      if (!workVideo.ended && !workVideo.paused && !stopRequested) {
        rafId = window.requestAnimationFrame(drawFrame);
      }
    };

    workVideo.addEventListener("ended", stopRecorder, { once: true });
    workVideo.addEventListener("error", () => {
      stopRequested = true;
      stopRecorder();
    }, { once: true });

    context.drawImage(workVideo, 0, 0, width, height);
    recorder.start(250);
    await audioContext.resume();

    workVideo.currentTime = 0;
    workAudio.currentTime = 0;

    await Promise.all([workVideo.play(), workAudio.play()]);
    rafId = window.requestAnimationFrame(drawFrame);
    await stopped;

    if (stopRequested) {
      throw new Error("Rendering cancelled.");
    }

    const recordedMime = recorder.mimeType || mimeType || "video/webm";
    const blob = new Blob(chunks, { type: recordedMime });
    const name = outputName(state.videoFile.name, recordedMime);
    state.resultUrl = URL.createObjectURL(blob);

    el.download.href = state.resultUrl;
    el.download.download = name;
    el.outputName.textContent = name;
    el.outputSize.textContent = `${formatSize(blob.size)} - ${recordedMime}`;
    el.outputType.textContent = recordedMime.includes("mp4") ? "MP4" : "WebM";
    el.downloadCard.hidden = false;
    el.complete.hidden = false;
    setProgress(1);
    setStatus("Ready to download");
  } catch (error) {
    setError(error instanceof Error ? error.message : "Could not render the video.");
  } finally {
    window.cancelAnimationFrame(rafId);
    workVideo.pause();
    workAudio.pause();
    if (combinedStream) {
      combinedStream.getTracks().forEach((track) => track.stop());
    }
    if (audioContext) {
      await audioContext.close().catch(() => undefined);
    }
    URL.revokeObjectURL(videoObjectUrl);
    state.cancelRender = null;
    state.isRendering = false;
    setBusy(false);
  }
}

function handleVideo(file) {
  clearObjectUrl("videoUrl");
  clearObjectUrl("resultUrl");

  state.videoFile = file || null;
  el.downloadCard.hidden = true;
  el.complete.hidden = true;
  setProgress(0);
  setError("");

  if (!file) {
    el.fileName.textContent = "Choose a video; audio will be extracted first";
    el.videoDuration.textContent = "--:--";
    el.videoSize.textContent = "--";
    el.previewVideo.removeAttribute("src");
    el.emptyState.hidden = false;
    setStatus(el.transcript.value.trim() ? "Transcript ready" : "Add video or transcript");
    setBusy(false);
    return;
  }

  state.videoUrl = URL.createObjectURL(file);
  el.previewVideo.src = state.videoUrl;
  el.previewVideo.volume = Number(el.volume.value);
  el.fileName.textContent = file.name;
  el.videoSize.textContent = formatSize(file.size);
  el.emptyState.hidden = true;
  setStatus(state.generatedAudioBlob ? "Ready to render" : "Video ready");
  setBusy(false);
}

el.transcript.addEventListener("input", () => {
  if (!state.videoFile && !state.generatedAudioBlob) {
    setStatus(el.transcript.value.trim() ? "Transcript ready" : "Add video or transcript");
  }
  setBusy(false);
});

el.videoInput.addEventListener("change", (event) => {
  handleVideo(event.target.files && event.target.files[0]);
});

el.previewVideo.addEventListener("loadedmetadata", () => {
  el.videoDuration.textContent = formatDuration(el.previewVideo.duration);
});

el.previewVideo.addEventListener("play", () => {
  el.play.innerHTML = '<i class="bi bi-pause-fill"></i>';
  el.play.setAttribute("aria-label", "Pause preview");
  el.play.title = "Pause";
});

el.previewVideo.addEventListener("pause", () => {
  el.play.innerHTML = '<i class="bi bi-play-fill"></i>';
  el.play.setAttribute("aria-label", "Play preview");
  el.play.title = "Play";
});

el.play.addEventListener("click", async () => {
  if (el.previewVideo.paused) {
    await el.previewVideo.play();
  } else {
    el.previewVideo.pause();
  }
});

el.mute.addEventListener("click", () => {
  el.previewVideo.muted = !el.previewVideo.muted;
  el.mute.innerHTML = el.previewVideo.muted
    ? '<i class="bi bi-volume-mute-fill"></i>'
    : '<i class="bi bi-volume-up-fill"></i>';
  el.mute.setAttribute("aria-label", el.previewVideo.muted ? "Unmute preview" : "Mute preview");
  el.mute.title = el.previewVideo.muted ? "Unmute" : "Mute";
});

el.volume.addEventListener("input", () => {
  el.previewVideo.volume = Number(el.volume.value);
  el.previewVideo.muted = Number(el.volume.value) === 0;
});

el.fullscreen.addEventListener("click", async () => {
  await el.previewVideo.requestFullscreen?.();
});

el.generate.addEventListener("click", generateAiVoice);
el.render.addEventListener("click", renderVideo);
el.cancel.addEventListener("click", () => state.cancelRender?.());

const storedKey = localStorage.getItem(storedKeyName);
if (storedKey) {
  el.apiKey.value = storedKey;
  el.rememberKey.checked = true;
}

setBusy(false);

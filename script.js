
const synth = window.speechSynthesis;

const text = document.getElementById("text");
const voiceSelect = document.getElementById("voices");
const rate = document.getElementById("rate");
const pitch = document.getElementById("pitch");
const speakBtn = document.getElementById("speak");
const stopBtn = document.getElementById("stop");

let voices = [];
let utterance = null;


function loadVoices() {
    voices = synth.getVoices();

    voiceSelect.innerHTML = "";

    if (voices.length === 0) {
        voiceSelect.add(new Option("No voices available", ""));
        voiceSelect.disabled = true;
        return;
    }

    voiceSelect.disabled = false;

    voices.forEach((voice, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}

loadVoices();
synth.addEventListener("voiceschanged", loadVoices);


function speak() {
    const message = text.value.trim();

    if (!message) {
        alert("Please enter some text");
        return;
    }

    if (voices.length === 0) {
        alert("No voices available");
        return;
    }

    synth.cancel();

    utterance = new SpeechSynthesisUtterance(message);

    utterance.voice = voices[Number(voiceSelect.value)];
    utterance.rate = Number(rate.value);
    utterance.pitch = Number(pitch.value);

    synth.speak(utterance);
}


function stop() {
    synth.cancel();
    utterance = null;
}


function updateSpeech() {
    if (synth.speaking || synth.pending) {
        speak();
    }
}


speakBtn.addEventListener("click", speak);
stopBtn.addEventListener("click", stop);

voiceSelect.addEventListener("change", updateSpeech);
rate.addEventListener("input", updateSpeech);
pitch.addEventListener("input", updateSpeech);

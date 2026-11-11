
const synth = window.speechSynthesis;

const text = document.getElementById("text");
const voiceSelect = document.getElementById("voices");
const rate = document.getElementById("rate");
const pitch = document.getElementById("pitch");
const speakBtn = document.getElementById("speak");
const stopBtn = document.getElementById("stop");

let voices = [];
let utterance = null;
let isSpeaking = false;


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


function createUtterance() {
    const message = text.value.trim();

    if (!message) {
        return null;
    }

    if (voices.length === 0) {
        return null;
    }

    const speech = new SpeechSynthesisUtterance(message);

    speech.voice = voices[Number(voiceSelect.value)];
    speech.rate = Number(rate.value);
    speech.pitch = Number(pitch.value);

    return speech;
}


function speak() {
    const message = text.value.trim();

    if (!message) {
        synth.cancel();
        utterance = null;
        isSpeaking = false;
        alert("Please enter some text");
        return;
    }

    if (voices.length === 0) {
        alert("No voices available");
        return;
    }

    synth.cancel();

    utterance = createUtterance();

    if (!utterance) return;

    const currentUtterance = utterance;

    currentUtterance.onstart = () => {
        if (utterance === currentUtterance) {
            isSpeaking = true;
        }
    };

    currentUtterance.onend = () => {
        if (utterance === currentUtterance) {
            isSpeaking = false;
        }
    };

    currentUtterance.onerror = () => {
        if (utterance === currentUtterance) {
            isSpeaking = false;
        }
    };

    synth.speak(currentUtterance);
}


function stop() {
    synth.cancel();
    utterance = null;
    isSpeaking = false;
}


rate.addEventListener("input", () => {
    if (utterance) {
        utterance.rate = Number(rate.value);
    }
});


pitch.addEventListener("input", () => {
    if (utterance) {
        utterance.pitch = Number(pitch.value);
    }
});


voiceSelect.addEventListener("change", () => {
    if (utterance && voices.length > 0) {
        utterance.voice = voices[Number(voiceSelect.value)];
    }
});


speakBtn.addEventListener("click", speak);
stopBtn.addEventListener("click", stop);

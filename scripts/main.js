document.getElementById("translateButton").addEventListener("click", function() {
    const text = document.getElementById("inputText").value.toLowerCase();
    const morseCode = textToMorseCode(text);
    translateToAudio(morseCode);
    document.getElementById("outputMorse").textContent = morseCode;
});

function textToMorseCode(text) {
    const morseCode = {
        "a": ".-", "b": "-...", "c": "-.-.", "d": "-..", "e": ".", "f": "..-.", "g": "--.", "h": "....", "i": "..",
        "j": ".---", "k": "-.-", "l": ".-..", "m": "--", "n": "-.", "o": "---", "p": ".--.", "q": "--.-", "r": ".-.",
        "s": "...", "t": "-", "u": "..-", "v": "...-", "w": ".--", "x": "-..-", "y": "-.--", "z": "--..",
        "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
        "0": "-----", " ": " "
    };

    return text.split("").map(char => morseCode[char] || char).join(" ");
}

function translateToAudio(morseCode) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioGain = audioContext.createGain();
    audioGain.connect(audioContext.destination);

    let i = 0;
    const timeUnit = 500; // Duración de una negra en Morse (en milisegundos)
    
    function playNext() {
        if (i < morseCode.length) {
            const char = morseCode[i];
            if (char === ".") {
                playTone(audioContext, audioGain, timeUnit / 4, 440); // Corchea para "TA" (punto)
            } else if (char === "-") {
                playTone(audioContext, audioGain, timeUnit, 440); // Negra para "TAAA" (raya)
            } else if (char === " ") {
                // Pausa entre símbolos
                setTimeout(() => {
                    i++;
                    playNext();
                }, timeUnit);
                return;
            } else if (char === "/") {
                // Pausa más larga entre palabras
                setTimeout(() => {
                    i++;
                    playNext();
                }, timeUnit * 7);
                return;
            }
            i++;
            // Pausa entre elementos dentro de la misma letra
            setTimeout(() => {
                playNext();
            }, timeUnit / 2); // Pausa de corchea
        }
    }

    function playTone(audioContext, audioGain, duration, frequency) {
        const oscillator = audioContext.createOscillator();
        oscillator.connect(audioGain);
        oscillator.type = "sine"; // Tipo de onda sinusoidal
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration / 1000);
    }

    playNext();
}

const morseCodeSMS = "TA TA TA TAAA TAAA TA TA TA";
translateToAudio(morseCodeSMS);

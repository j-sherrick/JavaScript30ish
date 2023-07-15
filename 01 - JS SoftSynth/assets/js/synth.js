/**
 * Simple Synth:
 * A simple keyboard synthesizer derived from the Javascript in 30 - Drum Kit tutorial.
 * 
 * Simple Synth utlizes the Web Audio API to derive audio waveforms from the frequency
 * in Hertz of each note.
 * 
 * @author Jason Sherrick <jasonsherrick@gmail.com>
 */



const audioContext = new AudioContext();

const oscList = {};
const attackTime = 0.0;

let gainCeiling = null;
let mainGainNode = null;

const keys = document.querySelectorAll(".key");
const validKeys = ["a", "w", "s", "e", "d", "f", "t", "g", "y", "h", "u", "j"];

const volumeControl = document.querySelector("input[name='volume'");

const noteTable = {
    "C": 261.625565300599,
    "C#": 277.182630976872096,
    "D": 293.66476791740756,
    "D#": 311.1269837220809,
    "E": 329.6275569128699,
    "F": 349.2282314330039,
    "F#": 369.9944227116344,
    "G": 391.99543598174927,
    "G#": 415.3046975799451,
    "A": 440.0,
    "A#": 466.1637615180899,
    "B": 493.8833012561241
};

function setup()
{
    volumeControl.addEventListener("change", changeVolume, false);

    mainGainNode = audioContext.createGain();
    gainCeiling = audioContext.createGain();
    
    gainCeiling.gain.value = 0.2; // Gain will never go past this ceiling
    mainGainNode.gain.value = volumeControl.value;

    gainCeiling.connect(mainGainNode);
    mainGainNode.connect(audioContext.destination);
    
    addMouseEventListeners();
}

setup();

function addMouseEventListeners()
{
    keys.forEach(key => {
        key.addEventListener("mousedown", notePressed, false);
        key.addEventListener("mouseup", noteReleased, false);
        key.addEventListener("mouseover", notePressed, false);
        key.addEventListener("mouseleave", noteReleased, false);
    });
}

function playTone(freq)
{
    const osc = audioContext.createOscillator();
    osc.connect(gainCeiling);
    // Set initial gain value to 0
    mainGainNode.gain.setValueAtTime(0, audioContext.currentTime);
    // Apply attack phase by gradually increasing the gain value
    mainGainNode.gain.linearRampToValueAtTime(volumeControl.value, audioContext.currentTime + attackTime);

    osc.frequency.value = freq;
    osc.start();
    //analyzeFrequency();
    return osc;
}

function analyzeFrequency()
{
    const analyser = audioContext.createAnalyser();
    mainGainNode.connect(analyser);
    console.log(analyser);
    // const bufferSize = analyser.frequencyBinCount;
    // const buffer = new Float32Array(bufferSize);
    // let high, low, diff, mid;
    // for (let count = 0; count < 5; count++)
    // {
    //     analyser.getFloatFrequencyData(buffer);
    //     console.log(buffer);
    //     buffer.forEach(sample => {
    //         if (sample > high) high = sample;
    //         else if (sample < low) low = sample;
    //     })
    //     diff = Math.abs(high - low);
    //     mid = diff / 2;
    //     console.log(`high: ${high}, low: ${low}, difference: ${diff}, mid: ${mid}`);
    // }
}

function notePressed(event)
{
    if (event.buttons & 1) {
        const dataset = event.target.dataset;
        const note = dataset["note"];
        console.log(note);
        if (!dataset["pressed"]) {
            oscList[note] = playTone(noteTable[note]);
            dataset["pressed"] = "yes";
        }
    }
}

function noteReleased(event)
{
    const dataset = event.target.dataset;

    if (dataset && dataset["pressed"]) {
        const note = dataset["note"];
        const osc = oscList[note];
        
        // Apply release phase by gradually decreasing gain value
        mainGainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime +  attackTime);
        
        osc.stop();
        delete dataset["pressed"];
        delete oscList[note];
    }
}

function changeVolume(event)
{
    mainGainNode.gain.value = volumeControl.value;
}

function keyNote(event)
{
    const elKey = keys[validKeys.indexOf(event.key)];

    if (elKey)
    {
        if (event.type === "keydown") {
            elKey.classList.add("active");
            notePressed({buttons: 1, target: elKey});
        }
        else {
            elKey.classList.remove("active");
            noteReleased({buttons: 1, target: elKey});
        }
        event.preventDefault();
    }
}

addEventListener("keydown", keyNote);
addEventListener("keyup", keyNote);
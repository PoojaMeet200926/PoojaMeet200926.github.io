import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = resolve(projectRoot, "public", "music");
const sampleRate = 18_000;
const duration = 32;
const sampleCount = sampleRate * duration;

const tracks = [
  {
    file: "mangal-prabhat.wav",
    root: 130.81,
    droneFifth: 196,
    chords: [[1, 1.5, 2, 3], [1, 1.5, 2.25, 3], [.75, 1.125, 1.5, 2.25], [1, 1.5, 2, 2.5]],
    melody: [2, 2.25, 2.5, 3, 2.5, 2.25, 2, 1.5, 2, 2.5, 3, 3.375, 3, 2.5, 2.25, 2],
    bell: [3, 4, 4.5, 5, 4.5, 4, 3.375, 3],
  },
  {
    file: "phoolon-ki-hawa.wav",
    root: 146.83,
    droneFifth: 220,
    chords: [[1, 1.5, 2, 3], [.75, 1.125, 1.5, 2.25], [1, 1.25, 1.875, 2.5], [1, 1.5, 2, 2.5]],
    melody: [1.5, 2, 2.25, 2.5, 3, 2.5, 2.25, 2, 1.5, 1.875, 2, 2.5, 2.25, 2, 1.5, 1.25],
    bell: [3, 3.75, 4.5, 5, 4.5, 3.75, 3, 2.5],
  },
  {
    file: "shubh-milan.wav",
    root: 98,
    droneFifth: 146.83,
    chords: [[1, 1.5, 2, 2.5], [1, 1.25, 1.875, 2.5], [.75, 1.125, 1.5, 2.25], [1, 1.5, 2, 3]],
    melody: [3, 3.375, 3.75, 4.5, 5, 4.5, 3.75, 3.375, 3, 2.5, 3, 3.75, 4.5, 3.75, 3.375, 3],
    bell: [4.5, 5, 6, 5, 4.5, 3.75, 3.375, 3],
  },
];

function addWarmTone(samples, frequency, start, length, amplitude, brightness = .18) {
  const from = Math.max(0, Math.floor(start * sampleRate));
  const to = Math.min(sampleCount, Math.floor((start + length) * sampleRate));
  const attack = Math.min(.8, length * .24);
  const release = Math.min(1.8, length * .42);
  for (let index = from; index < to; index += 1) {
    const time = index / sampleRate;
    const local = time - start;
    const envelope = Math.min(1, local / attack, (length - local) / release);
    const breath = 1 + .035 * Math.sin(2 * Math.PI * .19 * time);
    const fundamental = Math.sin(2 * Math.PI * frequency * time);
    const harmonic = Math.sin(2 * Math.PI * frequency * 2 * time + .35);
    samples[index] += amplitude * envelope * breath * (fundamental + brightness * harmonic);
  }
}

function addBell(samples, frequency, start, amplitude) {
  const length = 4.4;
  const from = Math.floor(start * sampleRate);
  const to = Math.min(sampleCount, Math.floor((start + length) * sampleRate));
  for (let index = from; index < to; index += 1) {
    const local = index / sampleRate - start;
    const envelope = Math.exp(-local * 1.08) * Math.min(1, local / .035);
    const shimmer =
      Math.sin(2 * Math.PI * frequency * local)
      + .42 * Math.sin(2 * Math.PI * frequency * 2.01 * local)
      + .17 * Math.sin(2 * Math.PI * frequency * 3.97 * local);
    samples[index] += amplitude * envelope * shimmer;
  }
}

function buildTrack(track, trackIndex) {
  const samples = new Float64Array(sampleCount);
  let randomState = 0x9e3779b9 ^ ((trackIndex + 1) * 0x85ebca6b);
  let air = 0;

  for (let index = 0; index < sampleCount; index += 1) {
    const time = index / sampleRate;
    const fade = Math.min(1, time / 2.7, (duration - time) / 3.1);
    const sway = 1 + .012 * Math.sin(2 * Math.PI * .08 * time);
    const drone =
      Math.sin(2 * Math.PI * track.root * time)
      + .42 * Math.sin(2 * Math.PI * track.droneFifth * time + .2)
      + .16 * Math.sin(2 * Math.PI * track.root * 2 * time + .5);
    randomState = (Math.imul(randomState ^ (randomState >>> 15), 2246822519) + 3266489917) | 0;
    const noise = ((randomState >>> 1) / 0x3fffffff) - 1;
    air = air * .986 + noise * .014;
    samples[index] = fade * (.065 * sway * drone + .006 * air);
  }

  track.chords.forEach((chord, chordIndex) => {
    const start = chordIndex * 8;
    chord.forEach((ratio, noteIndex) => {
      addWarmTone(samples, track.root * ratio, start, 9.4, .025 - noteIndex * .0025, .12);
    });
  });

  track.melody.forEach((ratio, noteIndex) => {
    addWarmTone(samples, track.root * ratio, 1 + noteIndex * 1.9, 2.65, .044, .23);
  });

  track.bell.forEach((ratio, noteIndex) => {
    addBell(samples, track.root * ratio, 2.2 + noteIndex * 3.75, .052);
  });

  const shortDelay = Math.floor(sampleRate * .19);
  const longDelay = Math.floor(sampleRate * .37);
  for (let index = longDelay; index < sampleCount; index += 1) {
    samples[index] += samples[index - shortDelay] * .105 + samples[index - longDelay] * .075;
  }

  let peak = 0;
  for (const sample of samples) peak = Math.max(peak, Math.abs(sample));
  const gain = .72 / Math.max(peak, .001);
  const pcm = Buffer.alloc(sampleCount * 2);
  for (let index = 0; index < sampleCount; index += 1) {
    pcm.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(samples[index] * gain * 32767))), index * 2);
  }
  return pcm;
}

function wavFile(pcm) {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

await mkdir(outputDirectory, { recursive: true });
for (const [index, track] of tracks.entries()) {
  await writeFile(resolve(outputDirectory, track.file), wavFile(buildTrack(track, index)));
  console.log(`Generated ${track.file}`);
}

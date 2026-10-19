// Original procedural piano miniature. No sampled recordings or third-party melody.
import { mkdirSync, writeFileSync } from "node:fs";
const rate = 24000,
  duration = 32,
  samples = new Float32Array(rate * duration);
const note = (midi, time, length, volume) => {
  const frequency = 440 * 2 ** ((midi - 69) / 12);
  for (
    let i = 0;
    i < rate * length && Math.floor(time * rate) + i < samples.length;
    i++
  ) {
    const t = i / rate;
    const envelope =
      Math.min(t / 0.018, 1) *
      Math.exp(-t * 2.6) *
      Math.min((length - t) / 0.15, 1);
    const tone =
      Math.sin(2 * Math.PI * frequency * t) +
      0.3 * Math.sin(4 * Math.PI * frequency * t) +
      0.08 * Math.sin(6 * Math.PI * frequency * t);
    samples[Math.floor(time * rate) + i] += tone * envelope * volume;
  }
};
const chords = [
  [48, 55, 60, 64],
  [45, 52, 57, 60],
  [41, 48, 53, 57],
  [43, 50, 55, 59],
];
const melody = [72, 76, 79, 76, 72, 69, 72, 76, 77, 76, 72, 69, 71, 74, 79, 74];
for (let bar = 0; bar < 8; bar++) {
  const chord = chords[bar % 4];
  for (let beat = 0; beat < 8; beat++)
    note(chord[[0, 1, 2, 3, 2, 1, 2, 3][beat]], bar * 4 + beat * 0.5, 2, 0.17);
  for (let beat = 0; beat < 2; beat++)
    note(melody[bar * 2 + beat], bar * 4 + beat * 2 + 0.05, 2.8, 0.13);
}
const buffer = Buffer.alloc(44 + samples.length * 2);
buffer.write("RIFF", 0);
buffer.writeUInt32LE(buffer.length - 8, 4);
buffer.write("WAVEfmt ", 8);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(1, 22);
buffer.writeUInt32LE(rate, 24);
buffer.writeUInt32LE(rate * 2, 28);
buffer.writeUInt16LE(2, 32);
buffer.writeUInt16LE(16, 34);
buffer.write("data", 36);
buffer.writeUInt32LE(samples.length * 2, 40);
for (let i = 0; i < samples.length; i++) {
  const fade = Math.min(i / rate / 0.15, 1, (samples.length - i) / rate / 2);
  buffer.writeInt16LE(
    Math.round(Math.max(-1, Math.min(1, samples[i] * fade)) * 32767),
    44 + i * 2,
  );
}
mkdirSync("public/audio", { recursive: true });
writeFileSync("public/audio/a-little-forever.wav", buffer);

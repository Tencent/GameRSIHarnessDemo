export class RevisionReplay {
  constructor(durations = [9000, 11000, 9000, 9000]) {
    if (!durations.length || durations.some(value => !Number.isFinite(value) || value <= 0)) throw new Error('Positive stage durations required.');
    this.durations = durations;
    this.index = 0;
    this.elapsed = 0;
    this.playing = false;
  }
  get complete() { return this.index === this.durations.length - 1 && this.elapsed === this.durations[this.index]; }
  get progress() { return (this.index + this.elapsed / this.durations[this.index]) / this.durations.length; }
  select(index) {
    if (!Number.isInteger(index) || index < 0 || index >= this.durations.length) return false;
    this.index = index; this.elapsed = 0; this.playing = false; return true;
  }
  play() { if (this.complete) this.select(0); this.playing = true; }
  pause() { this.playing = false; }
  reset() { this.select(0); }
  tick(ms) {
    if (!this.playing || !Number.isFinite(ms) || ms < 0) return;
    let remaining = ms;
    while (remaining > 0 && this.playing) {
      const room = this.durations[this.index] - this.elapsed;
      if (remaining < room) { this.elapsed += remaining; break; }
      remaining -= room;
      if (this.index < this.durations.length - 1) { this.index++; this.elapsed = 0; }
      else { this.elapsed = this.durations[this.index]; this.playing = false; }
    }
  }
}

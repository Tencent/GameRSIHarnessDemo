export class WalkthroughState {
  constructor(cases) {
    if (!cases.length || cases.some(item => !item.views.length)) throw new Error('Each example needs at least one view.');
    this.cases = cases;
    this.caseIndex = 0;
    this.viewIndex = 0;
    this.playing = false;
  }
  get example() { return this.cases[this.caseIndex]; }
  get view() { return this.example.views[this.viewIndex]; }
  get atEnd() { return this.viewIndex === this.example.views.length - 1; }
  selectCase(index) {
    if (!Number.isInteger(index) || index < 0 || index >= this.cases.length) return false;
    this.caseIndex = index; this.viewIndex = 0; this.playing = false; return true;
  }
  selectView(index) {
    if (!Number.isInteger(index) || index < 0 || index >= this.example.views.length) return false;
    this.viewIndex = index; this.playing = false; return true;
  }
  next() {
    if (this.atEnd) { this.playing = false; return false; }
    this.viewIndex++;
    if (this.atEnd) this.playing = false;
    return true;
  }
  start() { if (this.example.views.length < 2) { this.playing = false; return; } if (this.atEnd) this.viewIndex = 0; this.playing = true; }
  stop() { this.playing = false; }
  reset() { this.viewIndex = 0; this.playing = false; }
}

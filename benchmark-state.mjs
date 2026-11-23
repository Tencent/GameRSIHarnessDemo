export class BenchmarkBrowser {
  constructor(cases) {
    if (!cases.length || new Set(cases.map(item => item.id)).size !== cases.length) throw new Error('Unique benchmark cases required.');
    this.cases = cases;
    this.game = 'all'; this.ability = 'all'; this.query = '';
    this.selectedId = cases[0].id; this.mode = 'recording';
  }
  get filtered() {
    const query = this.query.trim().toLocaleLowerCase();
    return this.cases.filter(item => (this.game === 'all' || item.game === this.game) && (this.ability === 'all' || item.ability === this.ability) && (!query || [item.title, item.game, item.ability, item.description, item.completion, ...Object.values(item.instructions)].join(' ').toLocaleLowerCase().includes(query)));
  }
  get selected() { return this.filtered.find(item => item.id === this.selectedId) || null; }
  get index() { return this.filtered.findIndex(item => item.id === this.selectedId); }
  get hasFilters() { return this.game !== 'all' || this.ability !== 'all' || Boolean(this.query.trim()); }
  filter({ game = this.game, ability = this.ability, query = this.query } = {}) {
    this.game = game; this.ability = ability; this.query = query;
    const list = this.filtered;
    if (!list.some(item => item.id === this.selectedId)) { this.selectedId = list[0]?.id ?? null; this.mode = 'recording'; }
  }
  clear() { this.filter({ game: 'all', ability: 'all', query: '' }); }
  select(id) {
    if (!this.filtered.some(item => item.id === id)) return false;
    this.selectedId = id; this.mode = 'recording'; return true;
  }
  move(delta) { const item = this.filtered[this.index + delta]; return item ? this.select(item.id) : false; }
  setMode(mode) { if (!['recording', 'start', 'outcome'].includes(mode)) return false; this.mode = mode; return true; }
}

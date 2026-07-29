import HeroReel from './hero-reel';

// The reel leads instead of a headshot: the reporting is on camera, so the work
// itself should be the first thing a visitor sees moving. The beat strip states
// the range outright for anyone skimming for whether she covers their patch.
const BEATS = [
  { name: 'Housing', note: 'Mortgage & markets' },
  { name: 'Labor', note: 'Unions & contracts' },
  { name: 'Science', note: 'Peer-reviewed beat' },
];

export default function Hero() {
  return (
    <header className="max-w-6xl mx-auto container-px pt-28 lg:pt-32">
      {/* Larger and less tightly tracked than the section kickers: at 10px,
          uppercase mono with wide letterspacing is hard to read, and this is
          the first line on the page. */}
      <p className="kicker text-[13px] tracking-[0.12em]">New York City</p>

      <h1 className="font-serif text-display-lg font-medium mt-4">Nazeefa Ahmed</h1>

      <p className="text-[clamp(15px,1.6vw,18px)] text-soft mt-3.5 max-w-[34em] leading-relaxed">
        Multimedia business reporter covering the economy, on camera and in writing.
      </p>

      <div className="flex flex-wrap rule-t rule-b mt-8">
        {BEATS.map((beat) => (
          <div key={beat.name} className="py-[18px] pr-8 sm:pr-10">
            <span className="block font-serif text-[23px] font-semibold leading-none">
              {beat.name}
            </span>
            <span className="meta block mt-1.5 tracking-[0.08em] uppercase">{beat.note}</span>
          </div>
        ))}
      </div>

      <div className="mt-9">
        <HeroReel src="/showreel.mp4" />
      </div>
    </header>
  );
}

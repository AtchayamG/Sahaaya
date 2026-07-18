import { replayFixture } from "@/lib/domain";

export default function Home() {
  return (
    <main>
      <p className="eyebrow">Sahaaya · Replay</p>
      <h1>When you cannot be there, your circle knows what to do.</h1>
      <p className="lede">A deterministic preview is ready with {replayFixture.responsibilities.length} fictional household responsibilities.</p>
      <p className="notice">Simulated demo data · No messages or external actions are sent.</p>
    </main>
  );
}

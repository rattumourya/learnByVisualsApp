import { tracks } from '../../lib/tracks';
import { TopicCard } from '../../components/TopicCard';

export function Home() {
  return (
    <div className="flex flex-col gap-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Animated CS Coach</h1>
        <p className="max-w-2xl text-muted-foreground">
          Explore interactive, animated explanations for core computer science topics. Choose a track to dive into
          hands-on visual guides with step-by-step narration and controls.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Tracks</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {tracks.map((track) => (
            <TopicCard key={track.id} track={track} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;

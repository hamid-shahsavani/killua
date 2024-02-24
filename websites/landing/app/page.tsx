import Features from '@/containers/features';
import Hero from '@/containers/hero';

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col flex-1 gap-7">
      <Hero />
      <Features />
    </main>
  );
}

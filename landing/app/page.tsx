import Features from '@/containers/features';
import GuideUsage from '@/containers/guide-usage';
import Hero from '@/containers/hero';

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col flex-1 gap-7">
      <Hero />
      <GuideUsage />
      <Features />
    </main>
  );
}

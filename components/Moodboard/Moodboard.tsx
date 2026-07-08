interface MoodboardProps {
  background: string;
}

export function Moodboard({ background }: MoodboardProps) {
  return (
    <section className="paper moodboard" style={{ background }} aria-label="Moodboard місяця">
      <div className="moodboard__tape moodboard__tape--left" />
      <div className="moodboard__tape moodboard__tape--right" />
      <div className="moodboard__pattern" />
    </section>
  );
}

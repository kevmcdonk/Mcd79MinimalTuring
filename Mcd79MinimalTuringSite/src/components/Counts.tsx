import { h } from "preact";

interface CountsProps {
  correctCount: number;
  wrongCount: number;
}

const Counts = ({ correctCount, wrongCount }: CountsProps) => {
  return (
    <section class="box skills gap-2">
      <div class="stack gap-6 lg:gap-6">
        <h2>Correct</h2>
        <p>{correctCount}</p>
      </div>
      <div class="stack gap-6 lg:gap-6">
        <h2>Wrong</h2>
        <p>{wrongCount}</p>
      </div>
    </section>
  );
};

export default Counts;

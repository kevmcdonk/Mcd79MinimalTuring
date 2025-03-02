import { useState, useEffect } from "preact/hooks";
import { v4 as uuidv4 } from 'uuid';
import Counts from './Counts';

export default function ListResults() {
  const [responseMessage, setResponseMessage] = useState<any[]>([]);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);

  let itemOneClassName = "pill";
  let itemTwoClassName = "pill";
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/ListJudgements", {
        method: "GET",
      });
      const data = await response.json();
      if (data) {
        setResponseMessage(data);

        // Count correct and wrong guesses
        const counts = data.reduce(
          (acc: { correct: number; wrong: number }, item: any) => {
            if (item.guess === 0) {
              acc.correct += 1;
            } else if (item.guess === 1) {
              acc.wrong += 1;
            }
            return acc;
          },
          { correct: 0, wrong: 0 }
        );

        setCorrectCount(counts.correct);
        setWrongCount(counts.wrong);
      }
    }

    fetchData();
  }, []);


  return (
    <div>
    {responseMessage.length > 0 ? (
      <div>
        <Counts correctCount={correctCount} wrongCount={wrongCount}></Counts>
      <ul class="grid small">
      {responseMessage.length > 0 ? (
        responseMessage.map((item, index) => {
          
          if (item.humanWord.startsWith("\"")) {
            item.humanWord = item.humanWord.substring(1, item.humanWord.length - 1);
          }

          if (item.aiWord.startsWith("\"")) {
            item.aiWord = item.aiWord.substring(1, item.aiWord.length - 1);
          }
          return (
            <li key={index}>
              <div>{new Date(item.dateLogged).toLocaleDateString('en-gb', options)}</div>
              <div className={item.guess == 0 ? "pill-selected": "pill"}>
                <slot>{item.humanWord}</slot>
              </div>
              <div className={"centred"}>
                vs
              </div>
              <div className={item.guess == 0 ? "pill": "pill-selected"}>
                <slot>{item.aiWord}</slot>
              </div>
            </li>
          );
        })
      ) : (
        <li>No results found</li>
      )}
    </ul></div>
    ) : (
      <p>Loading results</p>
    )}
    </div>
);
}
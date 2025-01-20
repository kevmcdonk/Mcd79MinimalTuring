import { useState, useEffect } from "preact/hooks";
import { v4 as uuidv4 } from 'uuid';

export default function ListResults() {
  const [responseMessage, setResponseMessage] = useState<any[]>([]);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);

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
      <div>Correct: {correctCount}, Wrong: {wrongCount}</div>
      {responseMessage.length > 0 ? (
        
        <ul>
        {responseMessage.length > 0 ? (
          responseMessage.map((item, index) => {
            return (
              <li key={index}>
                
                <div>{item.dateLogged} - Human: {item.humanWord} vs AI: {item.aiWord}. User guessed {item.guess == 0 ? "Correct": "Wrong"}</div>
              </li>
            );
          })
        ) : (
          <li>No results found</li>
        )}
      </ul>
      ) : (
        <p>Loading results</p>
      )}
    </div>
  );
}
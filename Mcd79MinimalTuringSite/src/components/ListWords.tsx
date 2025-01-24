import { useState, useEffect } from "preact/hooks";
import { v4 as uuidv4 } from 'uuid';
import Pill from './Pill.astro';

export default function ListWords() {
  const [responseMessage, setResponseMessage] = useState<any[]>([]);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>("not set");

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/ListResults", {
        method: "GET",
      });
      const data = await response.json();
      if (data) {
        data.forEach((experiment: any) => {
          experiment.isHumanFirst = Math.random() >= 0.5;
          experiment.guessSuccess = "";
        });
        setResponseMessage(data);
      }
    }

    fetchData();
  }, []);

  async function submit(e: MouseEvent, item: any, judgement: string) {
    e.preventDefault();
    console.log(e);
    
    const guess = {
      ID: uuidv4(), // Generate a new GUID
      DateLogged: new Date(),
      HumanWord: item.humanWord,
      AIWord: item.aiWord,
      Guess: judgement
    }
    
    const response = await fetch("/api/SubmitGuess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(guess),
    });
    const data = await response.json();
    if (data) {
      setResponseMessage(data);
    }
  }

  return (

      <div>
        Hello
      {responseMessage.length > 0 ? (
        <ul className="judge-items">
        {responseMessage.length > 0 ? (
          responseMessage.map((item, index) => {
            return (
              <li key={index}>
                <a
                  className={(hoveredItemId == "index" + index.toString() + "1") ? "judge-item-selected" : "judge-item"}
                  onMouseOver={() => setHoveredItemId("index" + index.toString() + "1")}
                  onMouseOut={() => setHoveredItemId("not set")}
                  onClick={(e) => {
                    item.isHumanFirst ? item.guessSuccess = "Correct, you spotted the human word" : "Incorrect, that was the AI Word";
                    submit(e, item, item.isHumanFirst ? "Human" : "AI");
                  }}
                >
                  {item.isHumanFirst ? item.humanWord : item.aiWord}
                </a>
                <Pill>Developer</Pill>
                {" vs "}
                <a
                  className={(hoveredItemId == "index" + index.toString() + "2") ? "judge-item-selected" : "judge-item"}
                  onMouseOver={() => setHoveredItemId("index" + index.toString() + "2")}
                  onMouseOut={() => setHoveredItemId("not set")}
                  onClick={(e) => {
                    item.isHumanFirst ? item.guessSuccess = "Incorrect, that was the AI Word" : "Correct, you spotted the human word";
                    submit(e, item, item.isHumanFirst ? "AI" : "Human");
                  }}
                >
                  {item.isHumanFirst ? item.aiWord : item.humanWord}
                </a>
                <div>{item.guessSuccess}</div>
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
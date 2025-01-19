import { useState } from "preact/hooks";

export default function SubmitWord() {
  const [responseMessage, setResponseMessage] = useState("");

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const HumanWord = formData.get("HumanWord");
    
    const response = await fetch("/api/SubmitWord", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ HumanWord }),
    });
    const data = await response.json();
    if (data) {
      setResponseMessage(data);
    }
  }

  return (
    <form onSubmit={submit}>
      <label>
        Message
        <textarea id="HumanWord" name="HumanWord" required />
      </label>
      <br/>
      <button>Send</button>
      {responseMessage && <p>{responseMessage}</p>}
    </form>
  );
}
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
    const data = await response;
    setResponseMessage("Word submitted - thanks! Now jump over and judge the most human word.");
  }

  return (
    <form onSubmit={submit}>
      <br />
      <label class="centred">
        <input id="HumanWord" name="HumanWord" class="index-submit" required />
      </label>
      <br/>
      <div class="centred">
        <button class="pill-send">Send</button>
      </div>

      {responseMessage && <p>{responseMessage}</p>}
    </form>
  );
}
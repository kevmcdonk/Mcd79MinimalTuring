import { useState, useEffect } from "preact/hooks";

export default function ListWords() {
  const [responseMessage, setResponseMessage] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/ListHumanResults", {
        method: "GET",
      });
      const data = await response.json();
      if (data) {
        setResponseMessage(data);
      }
    }

    fetchData();
  }, []);

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const response = await fetch("/api/ListHumanResults", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (data.message) {
      setResponseMessage(data.message);
    }
  }

  return (
    <div>
    <form onSubmit={submit}>
      <label>
        Message
        <textarea id="message" name="message" required />
      </label>
      <button>Send</button>
    </form>
    <div>
      {responseMessage.length > 0 ? (
        <ul>
          {responseMessage.map((item, index) => (
            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      ) : (
        <p>No results found</p>
      )}
    </div>
  </div>
  );
}
export default function JsonGenerator() {
  const generateJSON = () => {
    const data = {
      name: "Ivan",
      age: 20,
      hobbies: ["coding", "football", "music"],
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <section className="card">
      <h2>Level 2 — JSON Generator</h2>
      <p className="text">Create and download JSON file</p>
      <button className="button" onClick={generateJSON}>
        Create JSON
      </button>
    </section>
  );
}
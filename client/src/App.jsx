import { useState } from "react";

function App() {

  const [userName, updateName] = useState("");
  const [jobRole, updateRole] = useState("");
  const [targetCompany, updateCompany] = useState("");
  const [keySkills, updateSkills] = useState("");

  return (
    <>
      <main>
        <h1>AI Cover Letter Generator</h1>
        <form action="">
          <input
            type="text"
            name="userName"
            id="userName"
            value={userName}
            onChange={(e) => updateName(e.target.value)}
            placeholder="Candidate Name"
          />
          <input
            type="text"
            name="jobRole"
            id="jobRole"
            value={jobRole}
            onChange={(e) => updateRole(e.target.value)}
            placeholder="Job Role"
          />
          <input
            type="text"
            name="targetCompany"
            id="targetCompany"
            value={targetCompany}
            onChange={(e) => updateCompany(e.target.value)}
            placeholder="Target Company"
          />
          <input
            type="text"
            name="keySkills"
            id="keySkills"
            value={keySkills}
            onChange={(e) => updateSkills(e.target.value)}
            placeholder="Key Skills"
          />
          <div
            className="border-dashed w-100 h-50 bg-amber-300"
            id="dropZone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const files = e.dataTransfer.files;
              console.log(files);
            }}
          ></div>
          <button type="submit">Generate</button>
        </form>
      </main>
    </>
  );
}

export default App;

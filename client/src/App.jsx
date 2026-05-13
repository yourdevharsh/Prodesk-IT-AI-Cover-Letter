import { useState } from "react";

function App() {
  const [userName, updateName] = useState("");
  const [jobRole, updateRole] = useState("");
  const [targetCompany, updateCompany] = useState("");
  const [keySkills, updateSkills] = useState("");
  const [resume, updateResume] = useState(null);

  const [letter, updateLetter] = useState("");

  const handleFiles = (files) => {
    if (files.length === 0) return;

    if (files.length > 1) {
      alert("Only one file is allowed!");
      return;
    }

    const file = files[0];

    if (file.type !== "application/pdf") {
      alert("Only PDF format is supported");
      return;
    }

    updateResume(file);
  };

  const handleFormSubmit = async () => {
    const formData = new FormData();

    formData.append("name", userName);
    formData.append("role", jobRole);
    formData.append("company", targetCompany);
    formData.append("skills", keySkills);
    formData.append("resume", resume);

    try {
      updateLetter("Generating....");
      const response = await fetch("http://localhost:3000/getOfferLetter", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        updateLetter(data.letter);
      } else {
        updateLetter("Try again!");
      }
    } catch (error) {
      updateLetter(error.message);
    }
  };

  return (
    <>
      <main className="flex flex-col justify-center items-center w-full h-full bg-slate-900">
        <h1 className="font-bold text-2xl underline my-8">
          AI Cover Letter Generator
        </h1>
        <form
          className="flex flex-col items-center w-[80%]"
          onSubmit={(e) => {
            e.preventDefault();
            handleFormSubmit();
          }}
        >
          <input
            type="text"
            name="userName"
            id="userName"
            value={userName}
            onChange={(e) => updateName(e.target.value)}
            placeholder="Candidate Name"
            required
          />
          <input
            type="text"
            name="jobRole"
            id="jobRole"
            value={jobRole}
            onChange={(e) => updateRole(e.target.value)}
            placeholder="Job Role"
            required
          />
          <input
            type="text"
            name="targetCompany"
            id="targetCompany"
            value={targetCompany}
            onChange={(e) => updateCompany(e.target.value)}
            placeholder="Target Company"
            required
          />
          <textarea
            type="text"
            name="keySkills"
            id="keySkills"
            value={keySkills}
            onChange={(e) => updateSkills(e.target.value)}
            placeholder="Key Skills"
            required
          />
          <div
            className="border-dashed w-[90%] max-w-100 h-15 bg-[#faebd7] rounded-xl flex justify-center items-center text-black border-yellow-500 border-2 relative"
            id="dropZone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
          >
            <input
              type="file"
              name="fileInput"
              id="fileInput"
              className="opacity-0 absolute top-0 left-0 right-0 bottom-0"
              accept="application/pdf"
              onChange={(e) => handleFiles(e.target.files)}
              placeholder="Upload Files"
            />
            <label>
              {(resume && <p>Selected file: {resume.name}</p>) ||
                "Upload Resume"}
            </label>
          </div>
          <button
            type="submit"
            className="hover:scale-105 transition-all duration-200"
          >
            Generate
          </button>
        </form>

        <div className="w-[75%] md:w-200 bg-[#faebd7] text-black p-4 mb-14 mt-8 rounded-lg">
          <button
            className="bg-slate-900 text-white px-2 py-1 my-2 rounded-md"
            onClick={async () => {
              await navigator.clipboard.writeText(letter);
            }}
          >
            Copy
          </button>
          <div>
            {letter.split(/\r?\n/).map((para, index) => (
              <p key={index} className="mb-4">
                {para}
              </p>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export default App;

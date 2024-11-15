import React, { useState } from "react";
import axios from "axios";
import { CiCirclePlus } from "react-icons/ci";
import "./App.css";
import { FaArrowCircleRight } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [documentId, setDocumentId] = useState(null);

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setDocumentId(response.data.documentId);
      toast.success("File uploaded successfully!"); // Replaced alert with toast
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error while uploading file"); // Toast for errors
    }
  };

  const handleAskQuestion = async () => {
    if (!documentId) return toast.error("Please upload Document First");

    try {
      const response = await axios.post("http://localhost:5000/api/ask", {
        documentId: documentId,
        question: question,
      });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error("Error asking question:", error);
      toast.error("Failed to get answer. Please check .env");
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="App">
        <div className="nav">
          <img src={`${process.env.PUBLIC_URL}/assests/logo.png`} alt="Logo" />

          <div className="navRight">
            <input
              className="uploadFile"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            <button onClick={handleUpload} className="addButton">
              <CiCirclePlus className="logo" />
              Upload PDF
            </button>
          </div>
        </div>

        <div className="searchBar">
          <div className="searchCollection">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about the document"
              className="ask"
            />
            <button onClick={handleAskQuestion} className="addButton01">
              <FaArrowCircleRight className="enterBtn" />
            </button>
          </div>
          {answer && (
            <div>
              <h3>Answer:</h3>
              <p>{answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

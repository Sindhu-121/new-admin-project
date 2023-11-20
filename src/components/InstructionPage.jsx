import React, { useState, useEffect } from 'react';
import axios from 'axios';
import base64 from 'base64-js';
// import { Link } from "react-router-dom";
const InstructionPage = () => {
    const [instructionHeading, setInstructionHeading] = useState('');
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState('');
    const [file, setFile] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [instructions,setInstructions] = useState([]);
    const [instructionPoints, setInstructionPoints] = useState([]);
    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get('http://localhost:3081/exams');
                setExams(response.data);
            } catch (error) {
                console.error('Error fetching exams:', error);
            }
        };

        fetchExams();
        fetchInstructions();
        fetchInstructionPoints();
    }, []);


    
  const fetchInstructionPoints = async () => {
    try {
      const response = await axios.get('http://localhost:3081/instructionpoint');
      setInstructionPoints(response.data);
    } catch (error) {
      console.error('Error fetching instruction points:', error);
    }
  };


    const fetchInstructions = async () => {
        try {
          const response = await axios.get('http://localhost:3081/instructions');
          setInstructions(response.data);
        } catch (error) {
          console.error('Error fetching instructions:', error);
        }
      };
    const handleFileUpload = (files) => {
        const selectedFile = files[0];
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        try {
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('examId', selectedExam);
                formData.append('instructionHeading', instructionHeading);

                await axios.post('http://localhost:3081/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                document.getElementById('fileInput').value = '';
                alert('File uploaded successfully!');
                fetchInstructions();
            } else {
                alert('Please select a file to upload.');
            }
        } catch (error) {
            console.error('Error uploading file:', error.response);
            alert('Failed to upload file. Please try again.');
        }
    }; 
    
    const openForm = () => {
        setFormOpen(true);
      };
    
      const closeForm = () => {
        setFormOpen(false);
      };
      const handleDelete = async (instructionId) => {
        try {
          // Send a request to delete the instruction
          await axios.delete(`http://localhost:3081/instructions/${instructionId}`);
          alert('Instruction deleted successfully!');
          fetchInstructions(); // Fetch updated instructions after deletion
        } catch (error) {
          console.error('Error deleting instruction:', error);
          alert('Failed to delete instruction. Please try again.');
        }
      };
      
    return (
        <div>
      {formOpen ? (
            <form>
                <button type="button" onClick={closeForm} disabled={!formOpen}>
        Close Form
      </button>
            <label>Select Exam:</label>
            <select name="examId"  value={selectedExam}  onChange={(e) => setSelectedExam(e.target.value)} >
                <option value="">Select Exam:</option>
                {exams.map((exam) => (
                    <option key={exam.examId} value={exam.examId}>
                        {exam.examName}
                    </option>
                ))}
            </select>
            <label>Instructions Heading:</label>
            <input
                type="text"
                value={instructionHeading}
                onChange={(e) => setInstructionHeading(e.target.value)}
            />
            <br />
            <div>
                <label>Instructions:</label>
                <input type="file"  id="fileInput"  onChange={(e) => handleFileUpload(e.target.files)} />
                <span>{file ? `Selected File: ${file.name}` : 'No file selected'}</span>
                <button type="button" onClick={handleUpload}>
                    Upload
                </button>
            </div>
            </form>
             ) : (
                <button type="button" onClick={openForm}>
                  Open Form
                </button>
            )}
 <table>
        <thead>
          <tr>
            <th>Serial No</th>
            <th>Exam Name</th>
            <th>Instruction Heading</th>
            <th>Document Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {instructions.map((instruction, index) => (
            <tr key={instruction.instructionId}>
              <td>{index + 1}</td>
              <td>{instruction.examName}</td>
              <td>{instruction.instructionHeading}</td>
              <td>{instruction.documentName}</td>
              <td>
                {/* <Link to={`/InstructionUpdate/${instruction.instructionId}`}>
                <button>
                  Update
                </button>
                </Link> */}
                <button onClick={() => handleDelete(instruction.instructionId)}>
                  Delete
                </button>
              </td>
              <td>{decodeBase64(instructionPoints[index]?.instructionPoint) || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div></div>
        </div>
    );
};

function decodeBase64(encodedString) {
  try {
    const decodedString = atob(encodedString);
    return new TextDecoder('utf-8').decode(new TextEncoder().encode(decodedString));
  } catch (error) {
    console.error('Error decoding Base64:', error);
    return 'Unable to decode';
  }
}
export default InstructionPage;

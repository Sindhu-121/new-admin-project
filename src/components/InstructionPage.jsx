import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InstructionPage = () => {
    const [instructionHeading, setInstructionHeading] = useState('');
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState('');
    const [file, setFile] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
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
    }, []);

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
            } else {
                alert('Please select a file to upload.');
            }
        } catch (error) {
            console.error('Error uploading file:', error.response);
            alert('Failed to upload file. Please try again.');
        }
    }; 
    
    const toggleForm = () => {
        setFormOpen(!formOpen);
      };
    return (
        <div>
             <button type="button" onClick={toggleForm}>
        {formOpen ? 'Close Form' : 'ADD'}
      </button>

      {formOpen && (
            <form>
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
            )}
        </div>
    );
};

export default InstructionPage;

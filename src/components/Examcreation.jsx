import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './admin.css'
// import SuccessPopup from './SuccessPopup';
import { Link } from 'react-router-dom';
// import EditForm from './EditForm';
function Examcreation() {
    const [examName, setExamName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    // const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [examsWithSubjects, setExamsWithSubjects] = useState([]);
  

    
    const resetForm = () => {
        setExamName('');
        setStartDate('');
        setEndDate('');
        setSelectedSubjects([]);
    };

//....................................FORMATING dTATE...............................//
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
//....................................END...............................//

//....................................FECHING SUBJECTS ...............................//
    useEffect(() => {
        // Fetch subjects from the backend when the component mounts
        axios.get('http://localhost:3081/subjects')
            .then(response => {
                setSubjects(response.data);
            })
            .catch(error => {
                console.error('Error fetching subjects:', error);
            });
    }, []);
//....................................END...............................//

//....................................HANDLER FOR SUBJECT CHECK BOXS...............................//
    const handleCheckboxChange = (subjectId) => {
        // Toggle the selection of subjects
        setSelectedSubjects((prevSelected) => {
            if (prevSelected.includes(subjectId)) {
                return prevSelected.filter((id) => id !== subjectId);
            } else {
                return [...prevSelected, subjectId];
            }
        });
    };
//....................................END...............................//

//................................... handler for submit button .............................//
    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        if (!examName || !startDate || !endDate || selectedSubjects.length === 0) {
          alert('Please fill in all required fields.');
          return;
        }
        const examData = {
            examName,
            startDate,
            endDate,
            selectedSubjects,
        };

        axios.post('http://localhost:3081/exams', examData)
            .then(response => {
                console.log('Exam created:', response.data);
                // Reset form fields and state as needed
                setSubmitting(false);
                resetForm();
                window.location.reload();
                // setShowSuccessPopup(true);
            })
            .catch(error => {
                console.error('Error creating exam:', error);
                setSubmitting(false);
            });
    };



    // const closeSuccessPopup = () => {
    //     setShowSuccessPopup(false);
    // };



    useEffect(() => {
        axios.get('http://localhost:3081/exams-with-subjects')
            .then(response => {
                setExamsWithSubjects(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);
//....................................END...............................//

//.............................Delete button handler ...................//
    const handleDelete = (examId) => {
        // Handle the "Delete" action for the given examId on the client side
        const confirmDelete = window.confirm('Are you sure you want to delete this data?');
        if (confirmDelete) {
            setExamsWithSubjects(prevExams => prevExams.filter(exam => exam.examId !== examId));

            // Send a request to delete the exam from the server
            axios.delete(`http://localhost:3081/exams/${examId}`)
                .then(response => {
                    console.log(`Exam with ID ${examId} deleted from the database`);
                })
                .catch(error => {
                    console.error('Error deleting exam:', error);
                });
        }
    };
//....................................END...............................//
    


  return (

    <div className='create_exam_container'>
         <div className='create_exam_content'>
            <div className='create_exam_header'>
            <h2>Exams</h2>
            {formOpen ? (
                <div className='Create_Exam_from'>
                  <h2>Create Exam</h2>
                     <form onSubmit={handleSubmit}>
                     <div  className="Create_Exam_from_close" onClick={() => setFormOpen(false)}>
                     <i class="fa-regular fa-circle-xmark"></i>
                     </div>            
            <div className='formdiv_contaniner'>
            <label>
              Exam Name:
            </label>
            <input type="text" value={examName} onChange={(e) => setExamName(e.target.value)} />

            </div>
            <div className='formdiv_contaniner'>
            <label>
              Start Date:
              
            </label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]}/>
             </div>
            
  
           <div className='formdiv_contaniner'>
           <label>
              End Date:
            </label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={new Date().toISOString().split('T')[0]}/>

           </div>
  
           
  
          <div className='formdiv_contaniner'>
          <label>Subjects:</label>
            <ul className="subject-list">
              {subjects.map(subject => (
                <li key={subject.subjectId}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(subject.subjectId)}
                      onChange={() => handleCheckboxChange(subject.subjectId)}
                    />
                    {subject.subjectName}
                  </label>
                </li>
              ))}
            </ul>
          </div>
  
  
  <button type="submit" disabled={submitting}>Create Exam</button>
  
          
            
          </form>
                </div>
       
// ....................................FROM END............................... 
      ) : (  
        
        <button onClick={() => setFormOpen(true)}><i class="fa-solid fa-plus"></i> Exam</button>
      )}
      {/* {showSuccessPopup && <SuccessPopup onClose={closeSuccessPopup} />} */}
            </div>
      {/* ....................................FORM START............................... */}
     

      <div className='Create_exam_page'>
        <h2>Exams with Subjects</h2>
{/* ....................................TABLE START...............................  */}
        <table >
          <thead>
            <tr>
              <th>Serial no</th>
              <th>Exam Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Subjects</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {examsWithSubjects.map((exam, index) => (
            <tr key={exam.examId}>
              <td>{index + 1}</td>
              <td>{exam.examName}</td>
              <td>{formatDate(exam.startDate)}</td>
              <td>{formatDate(exam.endDate)}</td>
              <td>{exam.subjects}</td>
              <td>
                <button>
                <Link to={`/update/${exam.examId}`} ><i class="fa-solid fa-pencil"></i></Link>

                </button>
                <button onClick={() => handleDelete(exam.examId)}><i class="fa-regular fa-trash-can"></i></button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
{/* ....................................TABLE END...............................  */}
      </div>
    </div>
    </div>
   
  );
}

export default Examcreation;

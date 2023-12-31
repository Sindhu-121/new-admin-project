import axios from 'axios';
import React ,{useEffect, useState}from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Examupdate = () => {
const {examId} =useParams();
const [examName,setExamName]=useState('');
const [startDate,setStartDate]=useState('');
const [endDate,setEndDate]=useState('');

const [subjects, setSubjects] = useState([]);
const [selectedSubjects, setSelectedSubjects] = useState([]);

const handleCheckboxChange = (subjectId) => {
    const updatedSelectedSubjects = selectedSubjects.includes(subjectId)
      ? selectedSubjects.filter(id => id !== subjectId)
      : [...selectedSubjects, subjectId];
  
    setSelectedSubjects(updatedSelectedSubjects);
  
    // Make API request to update selected subjects for the exam
    axios.put(`http://localhost:3081/exams/${examId}/subjects`, { subjects: updatedSelectedSubjects })
      .then(res => {
        console.log(res.data.message);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    axios.get(`http://localhost:3081/update/${examId}`)
      .then(res => {
        setExamName(res.data[0].examName);
        setStartDate(res.data[0].startDate);
        setEndDate(res.data[0].endDate);
      })
      .catch(err => console.log(err));
  
    // Fetch subjects
    axios.get('http://localhost:3081/subjects')
      .then(res => {
        setSubjects(res.data);
  
        // Fetch selected subjects for the specific examId
        axios.get(`http://localhost:3081/exams/${examId}/subjects`)
          .then(selectedSubjectsRes => {
            setSelectedSubjects(selectedSubjectsRes.data);
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }, [examId]);

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }



const navigate =useNavigate();
 const hanldesubmit = (e)=>{
    e.preventDefault();
    axios.put(`http://localhost:3081/updatedata/${examId}`, { examName, startDate, endDate ,selectedSubjects})
    .then(res => {
      if (res.data.updated) {
        navigate('/exams');
      } else {
        alert('Data is not updated');
      }
    }) }
    // console.log(req.body);
    // const { examName, startDate, endDate, subjects } = req.body;

  




  return (
    <div> 
    <form onSubmit={hanldesubmit}>
            
    <label>
      Exam Name:
      <input type="text" value={examName} onChange={e =>setExamName(e.target.value)}/>
    </label>

    <br />

    <label>
      Start Date:
      <input type="date" value={formatDate(startDate)} onChange={e =>setStartDate(e.target.value)}/>
    </label>

    <br />

    <label>
      End Date:
      <input type="date" value={formatDate(endDate)} onChange={e =>setEndDate(e.target.value)}/>
    </label>

    <br />

    <label>Subjects:</label>
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
    <button type="submit">Update</button>
  </form></div>
  )
}

export default Examupdate
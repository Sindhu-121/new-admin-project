import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Coureseupdate = () => {
  const{ courseCreationId } =useParams ();
  const [typeOfTest, setTypeOfTest] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedexams, setSelectedexams] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [subjectsData, setSubjectsData] = useState([]);
  const [typeofQuestion, setTypeofQuestion] = useState([]);
  const [selectedtypeofQuestion, setSelectedtypeofQuestion] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  useEffect(() => {
    const fetchTypeOfTest = async () => {
      try {
        const response = await fetch('http://localhost:3081/type_of_tests');
        const result = await response.json();
        setTypeOfTest(result);
      } catch (error) {
        console.error('Error fetching Type of questions:', error);
      }
    };

    fetchTypeOfTest();
  }, []);
  useEffect(() => {
    fetch('http://localhost:3081/courese-exams')
      .then(response => response.json())
      .then(data => {
        setExams(data);
      })
      .catch(error => console.error('Error fetching exams:', error));
  }, []);

  const handleexams = async (event) => {
    const selectedExamId = event.target.value;
    console.log('Selected Exam ID:', selectedExamId);
    setSelectedexams(selectedExamId);
    console.log('Selected Exam ID (after setting):', selectedexams);
    try {
      const response = await fetch(`http://localhost:3081/courese-exam-subjects/${selectedExamId}/subjects`);
      const data = await response.json();
      console.log('Subjects Data:', data);
      setSubjectsData(data);
      setSelectedSubjects([]);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }

    setSelectedexams(selectedExamId);
  };



  const handleSubjectChange = (event, subjectId) => {
    const { checked } = event.target;
    const subject = subjectsData.find((subj) => subj.subjectId === subjectId);
    if (subject) {
      setSelectedSubjects((prevSelectedSubjects) => {
        if (checked) {
          return [...prevSelectedSubjects, subjectId];
        } else {
          return prevSelectedSubjects.filter((id) => id !== subjectId);
        }
      });
    }
  };

  const handleQuestionChange = (event, questionTypeId) => {
    const { checked } = event.target;

    setSelectedtypeofQuestion((prevSelectedQuestions) => {
      if (checked) {
        return [...prevSelectedQuestions, questionTypeId];
      } else {
        return prevSelectedQuestions.filter((id) => id !== questionTypeId);
      }
    });
  };

  useEffect(() => {
    const fetchTypeOfQuestion = async () => {
      try {
        const response = await fetch('http://localhost:3081/type_of_questions');
        const result = await response.json();
        setTypeofQuestion(result);
      } catch (error) {
        console.error('Error fetching Type of questions:', error);
      }
    };

    fetchTypeOfQuestion();
  }, []);


  const handleStartDateChange = (e) => {
    const formattedDate = e.target.value;
    setStartDate(formattedDate);
  };

  const handleEndDateChange = (e) => {
    const formattedDate = e.target.value;
    setEndDate(formattedDate);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    let selectedTypeOfTest;
    if (name === 'cost' || name === 'discount') {
      const cost = name === 'cost' ? parseFloat(value) : formData.cost;
      const discount = name === 'discount' ? parseFloat(value) : formData.discount;
      const discountAmount = (!isNaN(cost) && !isNaN(discount)) ? (cost * discount) / 100 : '';
      const totalPrice = (!isNaN(cost) && !isNaN(discountAmount)) ? cost - discountAmount : '';
      setFormData({
        ...formData,
        typeOfTest: selectedTypeOfTest || '',
        examId: selectedexams,
        subjects: selectedSubjects,
        typeofQuestion: selectedtypeofQuestion,
        courseStartDate: startDate,
        courseEndDate: endDate,
        cost: cost,
        discount: discount,
        discountAmount: discountAmount,
        totalPrice: totalPrice,

      });
    } else if (name === 'courseStartDate' || name === 'courseEndDate') {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const [formData, setFormData] = useState({
    courseName: '',
    examId: '',
    typeOfTestId: '',
    questiontypes: '',
    courseStartDate: '',
    courseEndDate: '',
    cost: '',
    discount: '',
    discountAmount: '',
    totalPrice: '',

  });

useEffect(()=>{
  axios.get('http://localhost:3081/courese_update/' +courseCreationId)
  .then(res => console.log(res))
  .catch(err => console.log(err));
},[])






  return (
    <div>
      <form>
        <div>
          <label>Course Name:</label>
          <input type="text" />
        </div>
        <div>
          <label>
            Type of test:
          </label>
          <select
            value={formData.typeOfTestId}
            name="typeOfTestId"
            onChange={handleChange}
          >
            <option value="">Select type of test</option>
            {typeOfTest.map((type) => (
              <option key={type.typeOfTestId} value={type.typeOfTestId}>
                {type.typeOfTestName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="exams">Select Exam:</label>
          <select id="exams" value={selectedexams} onChange={handleexams}>
            <option value="">Select exams</option>
            {exams.map(exams => (
              <option key={exams.examId} value={exams.examId}>
                {exams.examName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Select Subjects:</label>
          {subjectsData.map((subject) => (
            <div key={subject.subjectId}>
              <input
                type="checkbox"
                id={`subject-${subject.subjectId}`}
                name={`subject-${subject.subjectId}`}
                value={subject.subjectId}
                checked={selectedSubjects.includes(subject.subjectId)}
                onChange={(e) => handleSubjectChange(e, subject.subjectId)}
              />
              <label htmlFor={`subject-${subject.subjectId}`}>{subject.subjectName}</label>
            </div>
          ))}
        </div>
        <div>
          <label>
            type of Questions:
          </label>
          <div>
            {typeofQuestion.map((type) => (
              <div key={type.quesionTypeId}>
                <input
                  type="checkbox"
                  id={`question-${type.quesionTypeId}`}
                  name={`question-${type.quesionTypeId}`}
                  value={type.quesionTypeId}
                  checked={selectedtypeofQuestion.includes(type.quesionTypeId)}
                  onChange={(e) => handleQuestionChange(e, type.quesionTypeId)}
                />
                <label htmlFor={`question-${type.quesionTypeId}`}>{type.typeofQuestion}</label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="courseStartDate">Course Start Date:</label>
          <input
            type="date"
            id="courseStartDate"
            name="courseStartDate"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </div>

        <div>
          <label htmlFor="courseEndDate">Course End Date:</label>
          <input
            type="date"
            id="courseEndDate"
            name="courseEndDate"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </div>
        <div>
          <label htmlFor="cost">Cost:</label>
          <input
            type="number"
            id="cost"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="discount">Discount (%):</label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="discountAmount">Discount Amount:</label>
          <input
            type="number"
            id="discountAmount"
            name="discountAmount"
            value={formData.discountAmount}
            readOnly
          />
        </div>

        <div>
          <label htmlFor="totalPrice">Total Price:</label>
          <input
            type="number"
            id="totalPrice"
            name="totalPrice"
            value={formData.totalPrice}
            readOnly
          />
        </div>
      </form>
    </div>
  )
}

export default Coureseupdate
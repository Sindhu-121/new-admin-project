import React, { useState, useEffect } from 'react'

const Coureseupdate = () => {
    const [typeOfTest, setTypeOfTest] = useState([]);
    const [exams, setExams] = useState([]);
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
                // value={formData.typeOfTestId}
                name="typeOfTestId"
                // onChange={handleChange}
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
              <select id="exams">
                <option value="">Select exams</option>
                {exams.map(exams => (
                  <option key={exams.examId} value={exams.examId}>
                    {exams.examName}
                  </option>
                ))}
              </select>
            </div>
         
            </form>                          
    </div>
  )
}

export default Coureseupdate
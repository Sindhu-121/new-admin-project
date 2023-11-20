import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Coureseupdate = () => {
  const { courseCreationId } = useParams();
  const navigate = useNavigate();
  const [courseName, setCourseName] = useState("");
  const [courseStartDate, setCourseStartDate] = useState("");
  const [courseEndDate, setCourseEndDate] = useState("");
  const [cost, setCost] = useState("");
  const [discount, setDiscount] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [typeOfTests, setTypeOfTests] = useState([]);
  const [selectedTypeOfTest, setSelectedTypeOfTest] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3081/courseupdate/${courseCreationId}`
        );
        const examsResponse = await axios.get(
          "http://localhost:3081/courese-exams"
        );
        const typeOfTestsResponse = await axios.get(
          "http://localhost:3081/type_of_tests"
        );
        setTypeOfTests(typeOfTestsResponse.data);
        const courseData = response.data[0];
        setExams(examsResponse.data);
        if (courseData) {
          setCourseName(courseData.courseName || "");
          setSelectedExam(
            courseData.examId !== undefined ? courseData.examId.toString() : ""
          );
          setSelectedTypeOfTest(
            courseData.typeOfTestId !== undefined
              ? courseData.typeOfTestId.toString()
              : ""
          );
          setCourseStartDate(formatDate(courseData.courseStartDate) || "");
          setCourseEndDate(formatDate(courseData.courseEndDate) || "");
          setCost(
            courseData.cost !== undefined ? courseData.cost.toString() : ""
          );
          setDiscount(
            courseData.Discount !== undefined
              ? courseData.Discount.toString()
              : ""
          );
          setTotalPrice(
            courseData.totalPrice !== undefined
              ? courseData.totalPrice.toString()
              : ""
          );
        } else {
          console.error("Course data not found.");
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchData();
  }, [courseCreationId]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        if (selectedExam) {
          const response = await axios.get(
            `http://localhost:3081/courese-exam-subjects/${selectedExam}/subjects`
          );
          setSubjects(response.data);
        } else {
          setSubjects([]);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, [selectedExam]);

  useEffect(() => {
    const fetchSelectedSubjects = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3081/course_subjects/${courseCreationId}`
        );
        const selectedSubjectIds = response.data.map(
          (subject) => subject.subjectId
        );
        setSelectedSubjects(selectedSubjectIds);
      } catch (error) {
        console.error("Error fetching selected subjects:", error);
      }
    };

    fetchSelectedSubjects();
  }, [courseCreationId]);

  useEffect(() => {
    const fetchQuestionTypes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3081/question_types"
        );
        setQuestionTypes(response.data);
      } catch (error) {
        console.error("Error fetching question types:", error);
      }
    };

    fetchQuestionTypes();
  }, []);

  useEffect(() => {
    const fetchSelectedQuestionTypes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3081/course-type-of-questions/${courseCreationId}`
        );
        const selectedTypes = response.data.map((type) => type.quesionTypeId);
        setSelectedQuestionTypes(selectedTypes);
      } catch (error) {
        console.error("Error fetching selected question types:", error);
      }
    };

    if (courseCreationId) {
      fetchSelectedQuestionTypes();
    }
  }, [courseCreationId]);

  const handleQuestionTypeCheckboxChange = (quesionTypeId) => {
    const updatedSelectedTypes = [...selectedQuestionTypes];
    const index = updatedSelectedTypes.indexOf(quesionTypeId);

    if (index === -1) {
      updatedSelectedTypes.push(quesionTypeId);
    } else {
      updatedSelectedTypes.splice(index, 1);
    }

    setSelectedQuestionTypes(updatedSelectedTypes);
  };

  const handleSubjectCheckboxChange = (subjectId) => {
    const updatedSubjects = [...selectedSubjects];
    const index = updatedSubjects.indexOf(subjectId);

    if (index === -1) {
      updatedSubjects.push(subjectId);
    } else {
      updatedSubjects.splice(index, 1);
    }

    setSelectedSubjects(updatedSubjects);
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleCalculateTotal = () => {
    // Assuming cost and discount are numbers
    const costValue = parseFloat(cost);
    const discountPercentage = parseFloat(discount);

    if (!isNaN(costValue) && !isNaN(discountPercentage)) {
      const discountAmount = (costValue * discountPercentage) / 100;
      const calculatedTotal = costValue - discountAmount;
      setTotalPrice(calculatedTotal.toFixed(2));
    } else {
      setTotalPrice("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:3081/update-course/${courseCreationId}`,
        {
          courseName,
          selectedTypeOfTest,
          selectedExam,
          selectedSubjects,
          selectedQuestionTypes,
          courseStartDate,
          courseEndDate,
          cost,
          discount,
          totalPrice,
        }
      );
      alert("Course updated successfully");
      navigate("/Coursecreation");
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course. Please try again.");
    }
  };

  return (
    <div className="couseupdatepage">
      <form onSubmit={handleSubmit}>
      <div className="courseupdate_frominput_container">
        <label> Course Name:</label>
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
      </div>
      <div className="courseupdate_frominput_container">
        <label>Select Type of Test:</label>
        <select
          name="typeOfTestId"
          value={selectedTypeOfTest}
          onChange={(e) => setSelectedTypeOfTest(e.target.value)}
        >
          <option value="">Select Type of Test</option>
          {typeOfTests.map((type) => (
            <option key={type.typeOfTestId} value={type.typeOfTestId}>
              {type.typeOfTestName}
            </option>
          ))}
        </select>
      </div>
      <div className="courseupdate_frominput_container">
      <label>
        Select Exam:
       
      </label>
      <select
          name="examId"
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
        >
          <option value="">Select Exam</option>
          {exams.map((exam) => (
            <option key={exam.examId} value={exam.examId}>
              {exam.examName}
            </option>
          ))}
        </select>
      </div>
     
      <div className="courseupdate_frominput_container">
      <label>
        Select Subjects:
      
      </label>


      <div className="courseupdate_frominput_container_checkbox" >

    
      {subjects.map((subject) => (
          <div  key={subject.subjectId}>
            <input
              type="checkbox"
              id={`subject-${subject.subjectId}`}
              value={subject.subjectId}
              checked={selectedSubjects.includes(subject.subjectId)}
              onChange={() => handleSubjectCheckboxChange(subject.subjectId)}
            />
            <label htmlFor={`subject-${subject.subjectId}`}>
              {subject.subjectName}
            </label>
          </div>
        ))}
          </div>
     </div>

      
     <div className="courseupdate_frominput_container">
     <label>
        Select Type of Questions:
      
      </label>

      <div className="courseupdate_frominput_container_checkbox" >
                  
      {questionTypes.map((type) => (
          <div key={type.quesionTypeId}>
            <input
              type="checkbox"
              id={`question-type-${type.quesionTypeId}`}
              value={type.quesionTypeId}
              checked={selectedQuestionTypes.includes(type.quesionTypeId)}
              onChange={() =>
                handleQuestionTypeCheckboxChange(type.quesionTypeId)
              }
            />
            <label htmlFor={`question-type-${type.quesionTypeId}`}>
              {type.typeofQuestion}
            </label>
          </div>
        ))}
        </div>
      </div>
   
      <div className="courseupdate_frominput_container">
      <label>
        Course Start Date:
       
      </label>
      <input
          type="date"
          value={formatDate(courseStartDate)}
          onChange={(e) => setCourseStartDate(e.target.value)}

          min={new Date().toISOString().split("T")[0]} // Set max attribute to today

        />
</div>
    
<div className="courseupdate_frominput_container">
  
<label>
        Course End Date:
      
      </label>
      <input
          type="date"
          value={formatDate(courseEndDate)}
          onChange={(e) => setCourseEndDate(e.target.value)}

          min={new Date().toISOString().split("T")[0]} // Set max attribute to today


        />
  
  </div>
  <div className="courseupdate_frominput_container">
  <label>
        Cost:
      
      </label>
      <input
          type="number"
          value={cost}
          onChange={(e) => {
            setCost(e.target.value);
            handleCalculateTotal();
          }}
        />
  </div>
    
  <div className="courseupdate_frominput_container">
  <label>
        Discount (%):
      
      </label>
      <input
          type="number"
          value={discount}
          onChange={(e) => {
            setDiscount(e.target.value);
            handleCalculateTotal();
          }}
        />
  </div>

     
  <div className="courseupdate_frominput_container">
  <label>
        Total Price:
      </label>
      <input type="text" value={totalPrice} readOnly />

  </div>
     
    
  
      <button type="submit">UPDATE COURSE</button>
    </form>
    </div>
    
  );
};

export default Coureseupdate;

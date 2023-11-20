import React, { useState, useEffect } from "react";
import "./admin.css";
import { Link } from "react-router-dom";
const Coursecreation = () => {
  const [typeOfTest, setTypeOfTest] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedexams, setSelectedexams] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [typeofQuestion, setTypeofQuestion] = useState([]);
  const [selectedtypeofQuestion, setSelectedtypeofQuestion] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [subjectsData, setSubjectsData] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [courseData, setCourseData] = useState([]);
  // const [resetForm, setResetForm] = useState(false);

  const resetFormFields = () => {
    // Reset form fields
    setFormData({
      courseName: "",
      examId: "",
      typeOfTestId: "",
      questiontypes: "",
      courseStartDate: "",
      courseEndDate: "",
      cost: "",
      discount: "",
      discountAmount: "",
      totalPrice: "",
    });
    // Reset selected subjects and question types
    setSelectedSubjects([]);
    setSelectedtypeofQuestion([]);

    // Reset form visibility
    setIsFormOpen(false);
  };

  // const toggleFormVisibility = () => {
  //   setIsFormOpen((prevIsFormOpen) => !prevIsFormOpen);

  //   // Reset the form when closing it
  //   if (isFormOpen) {
  //     resetFormFields();
  //   }
  // };

  
  const [formData, setFormData] = useState({
    courseName: "",
    examId: "",
    typeOfTestId: "",
    questiontypes: "",
    courseStartDate: "",
    courseEndDate: "",
    cost: "",
    discount: "",
    discountAmount: "",
    totalPrice: "",
  });

  useEffect(() => {
    const fetchSelectedExam = async () => {
      try {
        const response = await fetch(
          `http://localhost:3081/courese-exams/${selectedexams}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // console.log("Fetched Selected Exam:", data);
        // Now 'data' contains the selected exam details, including examName
      } catch (error) {
        console.error("Error fetching selected exam:", error);
      }
    };

    // Call the function when selectedexams changes
    fetchSelectedExam();
  }, [selectedexams]);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3081/course_creation_table"
        );
        const result = await response.json();

        // Ensure that subjects and typeofQuestion are arrays
        const coursesWithArrays = result.map((course) => ({
          ...course,
          subjects: course.subjects ? course.subjects.split(", ") : [],
          typeofQuestion: course.question_types
            ? course.question_types.split(", ")
            : [],
        }));

        // console.log("Fetched Course Data:", coursesWithArrays);
        setCourseData(coursesWithArrays);
        // setCourseData(fetchedData);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourseData();
  }, []);

  useEffect(() => {
    const fetchTypeOfTest = async () => {
      try {
        const response = await fetch("http://localhost:3081/type_of_tests");
        const result = await response.json();
        setTypeOfTest(result);
      } catch (error) {
        console.error("Error fetching Type of questions:", error);
      }
    };

    fetchTypeOfTest();
  }, []);

  useEffect(() => {
    fetch("http://localhost:3081/courese-exams")
      .then((response) => response.json())
      .then((data) => {
        setExams(data);
      })
      .catch((error) => console.error("Error fetching exams:", error));
  }, []);

  const handleexams = async (event) => {
    const selectedExamId = event.target.value;
    console.log("Selected Exam ID:", selectedExamId);
    setSelectedexams(selectedExamId);
    console.log("Selected Exam ID (after setting):", selectedexams);
    try {
      const response = await fetch(
        `http://localhost:3081/courese-exam-subjects/${selectedExamId}/subjects`
      );
      const data = await response.json();
      console.log("Subjects Data:", data); // Log the fetched data
      setSubjectsData(data); // Update subjectsData state
      setSelectedSubjects([]); // Reset selected subjects
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }

    setSelectedexams(selectedExamId);
  };

  const handleSubjectChange = (event, subjectId) => {
    const { checked } = event.target;
    // Fetch the subject details from subjectsData using subjectId
    const subject = subjectsData.find((subj) => subj.subjectId === subjectId);

    if (subject) {
      // If checked, add the subject to the selectedSubjects array
      // If unchecked, remove the subject from the selectedSubjects array
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
        const response = await fetch("http://localhost:3081/type_of_questions");
        const result = await response.json();
        // console.log("Type of Questions Data:", result); // Add this line to log the data
        setTypeofQuestion(result);
      } catch (error) {
        console.error("Error fetching Type of questions:", error);
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
    if (name === "cost" || name === "discount") {
      const cost = name === "cost" ? parseFloat(value) : formData.cost;
      const discount =
        name === "discount" ? parseFloat(value) : formData.discount;
      const discountAmount =
        !isNaN(cost) && !isNaN(discount) ? (cost * discount) / 100 : "";
      const totalPrice =
        !isNaN(cost) && !isNaN(discountAmount) ? cost - discountAmount : "";
      setFormData({
        ...formData,
        typeOfTest: selectedTypeOfTest || "",
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
    } else if (name === "courseStartDate" || name === "courseEndDate") {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      "courseName",
      "typeOfTestId",
      "examId",
      "courseStartDate",
      "courseEndDate",
      "cost",
      "discount",
      "totalPrice",
    ];

    const isEmptyField = requiredFields.some((field) => !formData[field]);

    if (isEmptyField) {
      alert("Please fill in all required fields.");
      return;
    }
    window.location.reload();
    resetFormFields();
    // Prepare the data for submission
    const data = {
      ...formData,
      typeOfTest,
      examId: selectedexams,
      subjects: selectedSubjects,
      typeofQuestion: selectedtypeofQuestion, // Assuming selectedtypeofQuestion is an array
    };

    // Submit the data to the server
    try {
      const response = await fetch("http://localhost:3081/course-creation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      // Check if the result contains the expected structure
      if (result && result.courseCreationId) {
        const courseCreationId = result.courseCreationId;

        // Use the courseCreationId in the second fetch to add subjects
        const subjectsResponse = await fetch(
          "http://localhost:3081/course_type_of_question",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              courseCreationId,
              subjectIds: selectedSubjects,
              quesionTypeIds: selectedtypeofQuestion,
            }),
          }
        );

        const subjectsResult = await subjectsResponse.json();
        console.log("Subjects Result:", subjectsResult);
        console.log(result);
        if (result.success) {
          console.log("Course created successfully");
        } else {
          console.log("Failed to create course:", result.error);
        }
      } else {
        console.log("Failed to create course. Unexpected response:", result);
      }
    } catch (error) {
      console.error("Error submitting course data:", error);
      // Handle error or show an error message to the user
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handleDelete = async (courseCreationId) => {
    // Display a confirmation dialog before deleting
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:3081/course_creation_table_Delete/${courseCreationId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result.message);
        const updatedCourseData = courseData.filter(
          (course) => course.courseCreationId !== courseCreationId
        );
        console.log("Before:", courseData);
        console.log("After:", updatedCourseData);
        setCourseData(updatedCourseData);
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    } else {
      // The user canceled the deletion
      console.log("Deletion canceled.");
    }
  };

  const openForm = () => {
    setIsFormOpen(true);
    if (isFormOpen) {
      resetFormFields();
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    if (isFormOpen) {
      resetFormFields();
    }
  };
  return (
    <div className="course_container">
      <div className="course_container_heder">
        <h2>courses</h2>

      

      {isFormOpen ? (
                 <>
              
        <form onSubmit={handleSubmit}>

        <button id="courses_close_btn" type="button" onClick={closeForm}>
        <i className="far fa-circle-xmark"></i>
               </button>
          <div className="course_frominput_container">
            <div>
              <label htmlFor="courseName">Course Name:</label>
              <input
                type="text"
                id="courseName"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Type of test:</label>
              <div>
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
            </div>
          </div>

          <fieldset>
            <legend>Select Exam</legend>
            <div className="course_frominput_container">
              <div>
                <label htmlFor="exams">Select Exam:</label>
                <select id="exams" value={selectedexams} onChange={handleexams}>
                  <option value="">Select exams</option>
                  {exams.map((exams) => (
                    <option key={exams.examId} value={exams.examId}>
                      {exams.examName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="course_frominput_container">
                <label>Select Subjects:</label>
                <div>
                  {subjectsData.map((subject) => (
                    <div
                      className="course_frominput_container " id="course_frominput_container_media"
                      key={subject.subjectId}
                    >
                      <input
                        type="checkbox"
                        id={`subject-${subject.subjectId}`}
                        name={`subject-${subject.subjectId}`}
                        value={subject.subjectId}
                        checked={selectedSubjects.includes(subject.subjectId)}
                        onChange={(e) =>
                          handleSubjectChange(e, subject.subjectId)
                        }
                      />
                      <label htmlFor={`subject-${subject.subjectId}`}>
                        {subject.subjectName}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </fieldset>
          <br />
          <fieldset>
            <div className="course_frominput_container">
              <label>type of Questions:</label>
              <div className="course_checkbox_continer_content">
                {typeofQuestion.map((type) => (
                  <div
                    className="course_checkbox_continer course_frominput_container_media"
                    key={type.quesionTypeId}
                  >
                    <input
                      type="checkbox"
                      id={`question-${type.quesionTypeId}`}
                      name={`question-${type.quesionTypeId}`}
                      value={type.quesionTypeId}
                      checked={selectedtypeofQuestion.includes(
                        type.quesionTypeId
                      )}
                      onChange={(e) =>
                        handleQuestionChange(e, type.quesionTypeId)
                      }
                    />
                    <label htmlFor={`question-${type.quesionTypeId}`}>
                      {type.typeofQuestion}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </fieldset>
          <br />
          <fieldset>
            <legend>Course Duration</legend>
            <div className="course_frominput_container">
              <label htmlFor="courseStartDate">Course Start Date:</label>
              <input
                type="date"
                id="courseStartDate"
                name="courseStartDate"
                value={startDate}
                onChange={handleStartDateChange}
                min={new Date().toISOString().split("T")[0]}
              />
              <div className="course_frominput_container">
                <label htmlFor="courseEndDate">Course End Date:</label>
                <input
                  type="date"
                  id="courseEndDate"
                  name="courseEndDate"
                  value={endDate}
                  onChange={handleEndDateChange}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
          </fieldset>
          <br />
          <fieldset>
            <legend>Cost and Discounts</legend>

            <div className="course_frominput_container_parent">
              <div className="course_frominput_containe_discunt ">
                <label htmlFor="cost">Cost:</label>
                <input
                  type="number"
                  id="cost"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                />
              </div>

              <div className="course_frominput_containe_discunt">
                <label htmlFor="discount">Discount (%):</label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                />
              </div>
              <div className="course_frominput_containe_discunt">
                <label htmlFor="discountAmount">Discount Amount:</label>
                <input
                  type="number"
                  id="discountAmount"
                  name="discountAmount"
                  value={formData.discountAmount}
                  readOnly
                />
              </div>
              <div className="course_frominput_containe_discunt">
                <label htmlFor="totalPrice">Total Price:</label>
                <input
                  type="number"
                  id="totalPrice"
                  name="totalPrice"
                  value={formData.totalPrice}
                  readOnly
                />
              </div>
            </div>
          </fieldset>
          <button type="submit">Create Course</button>
        </form>
        </>
) : (

  <div className="Add_Course_btn_container">
  <button type="button" onClick={openForm}>
   Add course
  </button>
  </div>

      )}</div>
      <div className="course_exam_page">
        <table>
          <thead>
            <tr>
              <th scope="col">Serial no</th>
              <th scope="col">Course Name</th>
              <th scope="col">Type of Test</th>
              <th scope="col"> Exam</th>
              <th scope="col">Subjects</th>
              <th scope="col">Type of Questions</th>
              <th scope="col">Course Start Date</th>
              <th scope="col">Course End Date</th>
              <th scope="col">Cost</th>
              <th scope="col">Discount</th>
              <th scope="col">Total Price</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {courseData.map((course, index) => (
              <tr key={course.courseCreationId}>
                <td>{index + 1}</td>
                <td>{course.courseName}</td>
                <td>{course.typeOfTestName}</td>
                <td>{course.examName}</td>
                <td>
                  {Array.isArray(course.subjects) && course.subjects.length > 0
                    ? course.subjects.join(", ")
                    : "N/A"}
                </td>
                <td>
                  {Array.isArray(course.typeofQuestion) &&
                  course.typeofQuestion.length > 0
                    ? course.typeofQuestion.join(", ")
                    : "N/A"}
                </td>
                <td>{formatDate(course.courseStartDate)}</td>
                <td>{formatDate(course.courseEndDate)}</td>
                <td>{course.cost}</td>
                <td>{course.Discount}</td>
                <td>{course.totalPrice}</td>
                <td>
                  <div className="courseupdate_btn_container">

                  <Link to={`/courseupdate/${course.courseCreationId}`}>
                    {" "}
                    <button className="courseupdate_btn">
                      <i class="fa-solid fa-pencil"></i>
                    </button>
                  </Link>
                  
                  </div>
                 <button

                    <Link to={`/courseupdate/${course.courseCreationId}`}>
                      {" "}
                      <button className="courseupdate_btn">
                        <i class="fa-solid fa-pencil"></i>
                      </button>
                    </Link>
                    <button

                      className="coursedelte_btn"
                      onClick={() => handleDelete(course.courseCreationId)}
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>


                  </div>
                

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Coursecreation;

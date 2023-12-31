const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const port = 3081;

app.use(express.json());
app.use(cors());
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'admin_project',
});





//_______________________________________________________________exam creation start_____________________________________________________________________________

//-----------------------------geting subjects in exam creation page ------------------------
app.get('/subjects', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM subjects');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//--------------------------------------------END--------------------------------------------------
//---------------------------------------------inserting exam creation page data-------------------------------------------------
app.post('/exams', async (req, res) => {
    const { examName, startDate, endDate, selectedSubjects } = req.body;
  
    try {
      // Insert the exam data into the exams table
      const [examResult] = await db.query(
        'INSERT INTO exams (examName, startDate, endDate) VALUES (?, ?, ?)',
        [examName, startDate, endDate]
      );
  
      const insertedExamId = examResult.insertId;
  
      // Insert selected subjects into the exam_creation table
      for (const subjectId of selectedSubjects) {
        await db.query(
          'INSERT INTO exam_creation_table (examId, subjectId) VALUES (?, ?)',
          [insertedExamId, subjectId]
        );
      }
      res.json({ message: 'Exam created successfully', examId: insertedExamId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  //--------------------------------------------END--------------------------------------------------
  //--------------------------------------------desplaying only selected subjects in table in ecam creation page --------------------------------------------------
  app.get('/exams-with-subjects', async (req, res) => {
    try {
      const query = `
      SELECT e.examId, e.examName, e.startDate, e.endDate, GROUP_CONCAT(s.subjectName) AS subjects
      FROM exams AS e
      JOIN exam_creation_table AS ec ON e.examId = ec.examId
      JOIN subjects AS s ON ec.subjectId = s.subjectId
      GROUP BY e.examId
      `;
      const [rows] = await db.query(query);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  //--------------------------------------------END--------------------------------------------------
  //--------------------------------------------Deleting exams from table(dalete button) --------------------------------------------------
  app.delete('/exams/:examId', async (req, res) => {
    const examId = req.params.examId;
  
    try {
      await db.query('DELETE FROM exams WHERE examId = ?', [examId]);
      // You might also want to delete related data in other tables (e.g., exam_creation) if necessary.
  
      res.json({ message: `Exam with ID ${examId} deleted from the database` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  //--------------------------------------------END--------------------------------------------------

  //-------------------------------------------insertion/Deleting subjects in table --------------------------------------------------
  app.put('/exams/:examId/subjects', async (req, res) => {
    const { examId } = req.params;
    const { subjects } = req.body;
  
    try {
      // First, you can delete the existing subjects associated with the exam.
      await db.query('DELETE FROM exam_creation_table WHERE examId = ?', [examId]);
  
      // Then, insert the updated subjects into the exam_creation_table.
      for (const subjectId of subjects) {
        await db.query(
          'INSERT INTO exam_creation_table (examId, subjectId) VALUES (?, ?)',
          [examId, subjectId]
        );
      }
  
      res.json({ message: 'Subjects updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
//--------------------------------------------END--------------------------------------------------

//--------------------------------------------updationg exam--------------------------------------------------
  app.get('/update/:examId', async (req, res) => {
    const query = 'SELECT * FROM exams WHERE examId = ?';
    const examId = req.params.examId;
    try {
      const [result] = await db.query(query, [examId]);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  //--------------------------------------------END--------------------------------------------------
  //--------------------------------------------updation subjects--------------------------------------------------
app.put('/updatedata/:examId', async (req, res) => {
  const updateExamQuery = "UPDATE exams SET examName=?, startDate=?, endDate=? WHERE examId=?";
  const updateSubjectsQuery = "UPDATE exam_creation_table SET subjectId=? WHERE examId=?";

  const examId = req.params.examId;
  const { examName, startDate, endDate, subjects } = req.body;

  try {
    // Update exam details
    await db.query(updateExamQuery, [examName, startDate, endDate, examId]);

    // Check if subjects is an array before updating
    if (Array.isArray(subjects)) {
      // Update subjects
      await Promise.all(subjects.map(subjectId => db.query(updateSubjectsQuery, [subjectId, examId])));
    }

    res.json({ updated: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//--------------------------------------------END--------------------------------------------------
//--------------------------------------------geting only selected subjects in edit page--------------------------------------------------
app.get('/exams/:examId/subjects', async (req, res) => {
    const examId = req.params.examId;
  
    try {
      const [rows] = await db.query('SELECT subjectId FROM exam_creation_table WHERE examId = ?', [examId]);
      const selectedSubjects = rows.map(row => row.subjectId);
      res.json(selectedSubjects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
//--------------------------------------------END--------------------------------------------------
//--------------------------------------------updating subjects--------------------------------------------------
  app.put('/exams/:examId/subjects', async (req, res) => {
    const { examId } = req.params;
    const { subjects } = req.body;
  
    try {
      // First, delete the existing subjects associated with the exam.
      await db.query('DELETE FROM exam_creation_table WHERE examId = ?', [examId]);
  
      // Then, insert the updated subjects into the exam_creation_table.
      for (const subjectId of subjects) {
        await db.query(
          'INSERT INTO exam_creation_table (examId, subjectId) VALUES (?, ?)',
          [examId, subjectId]
        );
      }
  
      res.json({ message: 'Subjects updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  //--------------------------------------------END--------------------------------------------------
//________________________________________________________________Exam creation end_____________________________________________________________________________
//_______________________________________________________________courese creation start_____________________________________________________________________________

// Add this route to fetch type of test names
app.get('/type_of_tests', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT typeOfTestId, typeOfTestName FROM type_of_test');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/type_of_questions', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT quesionTypeId, typeofQuestion FROM quesion_type');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/courese-exams', async (req, res) =>{
  try{
const [rows] = await db.query('SELECT  examId,examName FROM exams');
res.json(rows);
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
 
app.get('/courese-exam-subjects/:examId/subjects', async (req, res) => {
  const examId = req.params.examId;

  try {
    const query = `
      SELECT s.subjectId, s.subjectName
      FROM subjects AS s
      JOIN exam_creation_table AS ec ON s.subjectId = ec.subjectId
      WHERE ec.examId = ?
    `;
    const [rows] = await db.query(query, [examId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/course-creation', async (req, res) => {
  const {
    courseName, examId, typeOfTestId, courseStartDate, courseEndDate, cost, discount, totalPrice,
  } = req.body;

  try {
    // Insert the course data into the course_creation_table
    const [result] = await db.query(
      'INSERT INTO course_creation_table (courseName,  examId, typeOfTestId, courseStartDate, courseEndDate , cost, Discount, totalPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [courseName, examId, typeOfTestId, courseStartDate, courseEndDate, cost, discount, totalPrice]
    );

    // Check if the course creation was successful
    if (result && result.insertId) {
      const courseCreationId = result.insertId;

      // Return the courseCreationId in the response
      res.json({ message: 'Course created successfully', courseCreationId });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/course_type_of_question', async (req, res) => {
  try {
    // Extract data from the request body
    const { courseCreationId, subjectIds, quesionTypeIds } = req.body;
    // Insert subjects into the course_subjects table
    for (const subjectId of subjectIds) {
      await db.query(
        'INSERT INTO course_subjects (courseCreationId, subjectId) VALUES (?, ?)',
        [courseCreationId, subjectId]
      );
    }

    // Insert question types into the course_type_of_question table
    for (const quesionTypeId of quesionTypeIds) {
      await db.query(
        'INSERT INTO course_type_of_question (courseCreationId, quesionTypeId) VALUES (?, ?)',
        [courseCreationId, quesionTypeId]
      );
    }

    // Respond with success message
    res.json({ success: true, message: 'Subjects and question types added successfully' });
  } catch (error) {
    // Log any errors that occur during the database queries
    console.error('Error inserting data into the database:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


app.get('/course_creation_table', async (req, res) => {
  try {
    const query = `
    SELECT cc.*, subjects.subjects AS subjects, questions.quesion_types AS question_types, e.examName, t.typeOfTestName FROM course_creation_table cc LEFT JOIN ( SELECT cs.courseCreationId, GROUP_CONCAT(s.subjectName) AS subjects FROM course_subjects cs LEFT JOIN subjects s ON cs.subjectId = s.subjectId GROUP BY cs.courseCreationId ) AS subjects ON cc.courseCreationId = subjects.courseCreationId LEFT JOIN ( SELECT ct.courseCreationId, GROUP_CONCAT(q.typeofQuestion) AS quesion_types FROM course_type_of_question ct LEFT JOIN quesion_type q ON ct.quesionTypeId = q.quesionTypeId GROUP BY ct.courseCreationId ) AS questions ON cc.courseCreationId = questions.courseCreationId JOIN exams AS e ON cc.examId = e.examId JOIN type_of_test AS t ON cc.typeOfTestId = t.typeOfTestId;
     `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/course_creation_table_Delete/:courseCreationId', async (req, res) => {
  const courseCreationId = req.params.courseCreationId;

  try {
    await db.query('DELETE course_creation_table,course_subjects,course_type_of_question FROM course_creation_table LEFT JOIN course_subjects ON course_creation_table.courseCreationId=course_subjects.courseCreationId LEFT JOIN course_type_of_question ON course_creation_table.courseCreationId=course_type_of_question.courseCreationId WHERE course_creation_table.courseCreationId=?', [courseCreationId]);

    res.json({ message: `courese with ID ${courseCreationId} deleted from the database` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getcoursedata/:courseCreationId', async (req, res) => {
  const query = `
    SELECT c.courseName, c.cost, c.Discount, c.totalPrice, c.typeOfTestId, t.typeOfTestName
    FROM course_creation_table c
    JOIN type_of_test t ON c.typeOfTestId = t.typeOfTestId
    WHERE c.courseCreationId = ?;
  `;
  const courseCreationId = req.params.courseCreationId;
  try {
    const [result] = await db.query(query, [courseCreationId]);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.put('/updatecourese/:courseCreationId', async (req, res) => {
  const { courseCreationId } = req.params;
  const {
    courseName,
    selectedTypeOfTestId,
    cost,
    Discount,
    totalPrice,
  } = req.body;

  try {
    // Update the course details in the database
    const query = `
      UPDATE course_creation_table
      SET
        courseName = ?,
        typeOfTestId = ?,
        cost = ?,
        Discount = ?,
        totalPrice = ?
      WHERE
        courseCreationId = ?
    `;
    const result = await db.query(query, [courseName, selectedTypeOfTestId, cost, Discount, totalPrice, courseCreationId]);
    console.log(result);
    if (result.affectedRows > 0) {
      // If at least one row is affected, it means the update was successful
      res.json({ updated: true });
    } else {
      res.json({ updated: false });
    }
  } catch (error) {
    console.error('Error updating course details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//_______________________________________________________________courese creation end _____________________________________________________________________________



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

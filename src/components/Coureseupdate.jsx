// import React, { useState, useEffect } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import axios from 'axios';

// const Coureseupdate = () => {
//     const { courseCreationId } = useParams();
//     const [courseName,setCourseName] =useState('');
//     const [typeOfTest, setTypeOfTest] = useState([]);
//     const [courseDetails, setCourseDetails] = useState({});
//     const [typeOfTests, setTypeOfTests] = useState([]);
//     const [selectedTypeOfTestId, setSelectedTypeOfTestId] = useState('');
//     const [cost,setCost]=useState('');
//     const [discount,setDiscount] =useState('');
//     const [totalPrice,setTotalPrice] = useState('');

//     useEffect(() => {
//         const fetchTypeOfTest = async () => {
//           try {
//             const response = await fetch('http://localhost:3081/type_of_tests');
//             const result = await response.json();
//             setTypeOfTest(result);
//           } catch (error) {
//             console.error('Error fetching Type of questions:', error);
//           }
//         };
    
//         fetchTypeOfTest();
//       }, []);




//       useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:3081/getcoursedata/${courseCreationId}`);
//                 setCourseDetails(response.data);
//                 setSelectedTypeOfTestId(response.data.typeOfTestId);
//                 setCourseName(response.data.courseName);
//                 setCost(response.data.cost);
//                 setDiscount(response.data.Discount);  // Change here
//                 setTotalPrice(response.data.totalPrice);
//             } catch (error) {
//                 console.error('Error fetching course data:', error);
//             }
//         };
    
//         fetchData();
//     }, [courseCreationId]);


    
//  const navigate =useNavigate();

//  const handleSubmit = (e) => {
//     e.preventDefault();
//     axios.put(`http://localhost:3081/updatecourese/${courseCreationId}`, {
//       courseName,
//       typeOfTestId: selectedTypeOfTestId,
//       cost,
//       discount, // Corrected to match the state property name
//       totalPrice,
//     })
//     .then((res) => {
//       if (res.data.updated) {
//         navigate('/Coursecreation');
//       } else {
//         alert("Not updated");
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       alert("Error updating course");
//     });
//   };

//     return (
//         <div>
//             <form onSubmit={handleSubmit}>
//             <label>Course Name:</label>
//             <input type="text" value={courseName} onChange={e=>setCourseName(e.target.value)}/>
//             <br />
//             <label>
//                 Type of test:
//             </label>
//             <div>
//             <select
//     name="typeOfTestId"
//     value={selectedTypeOfTestId}
//     onChange={(e) => setSelectedTypeOfTestId(e.target.value)}
// >
//     <option value="">Select type of test</option>
//     {typeOfTests.map((type) => (
//         <option key={type.typeOfTestId} value={type.typeOfTestId}>
//             {type.typeOfTestName}
//         </option>
//     ))}
// </select>
//         </div>
//             <label>cost:</label>
//             <input type='number'  value={cost}  onChange={e=>setCost(e.target.value)}/>
//             <br />
//             <label>Discout (%):</label>
//             <input type='number' value={discount} onChange={e=>setDiscount(e.target.value)}/>
//             <br />
//             <label>Discount Amount:</label>
//             <input type='number' />
//             <br />
//             <label>Total Price:</label>
//             <input type='number' value={totalPrice} onChange={e=>setTotalPrice(e.target.value)}/>
//             <button>UPDATE</button>
//             </form>
//         </div>
//     )
// }

// export default Coureseupdate



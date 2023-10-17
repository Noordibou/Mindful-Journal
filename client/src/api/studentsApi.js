import axios from 'axios';
import URL from '../URL'

const STUDENTS_API_URL = URL+'/api/students';

// // this works ✅
// export const getStudents = async () => {
//   const response = await axios.get(STUDENTS_API_URL);
//   return response.data;
// };


// this works ✅
export const createStudent = async (student) => {
    try {
        const response = await axios.post(STUDENTS_API_URL, student);
        return response.data;
    } catch (error) {
        throw error;
    }
  
};

// this works ✅
export const getStudentById = async (id) => {
    try {
        const response = await axios.get(`${STUDENTS_API_URL}/${id}`, { withCredentials: true })
        return response.data;
    } catch (error) {
        throw error;
    }
    
}


export const updateStudent = async (id, studentUpdate, checkInOutType) => {
    try {
        const response = await axios.put(`${STUDENTS_API_URL}/${id}`, {studentUpdate, checkInOutType}, { withCredentials: true })
        return response.data;
    } catch (error) {
        console.log("oh shoot")
        throw error;
    }
    
}

// this works ✅
export const deleteStudent = async (id) => {
    try {
        const response = await axios.delete(`${STUDENTS_API_URL}/${id}`, { withCredentials: true })
        return response.sendStatus(200);
    } catch (error) {
        throw error;
    }
    
}

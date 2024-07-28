import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import {
  getTeacherById,
  getAllStudentsClassroom,
  createClassroom,
  getAllStudents,
} from "../../api/teachersApi";
import TeacherNavbar from "../../components/Navbar/TeacherNavbar";
import GoBack from "../../components/GoBack";
import Nav from "../../components/Navbar/Nav";
import youngStudent from "../../images/young-student.png";
import { getBackgroundColorClass } from "../../utils/classroomColors";
import Button from "../../components/Button";
import Checkbox from "../../components/Checkbox";



const CreateClass = () => {

  const navigate = useNavigate();
  const { userData, updateUser } = useUser();
  const [classroomsData, setClassroomsData] = useState([]);
  const [newClassData, setNewClassData] = useState({
    classSubject: "",
    location: "",
    students: [],
  });
  const [allStudents, setAllStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await getTeacherById(userData._id);
        const studentsPromises = response.classrooms.map(async (classroom) => {
          const students = await getAllStudentsClassroom(
            userData._id,
            classroom._id
          );
          return { classroom, students };
        });

        const classroomsWithStudents = await Promise.all(studentsPromises);
        setClassroomsData(classroomsWithStudents);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAllStudents = async () => {
      try {
        const allStudentsData = await getAllStudents();
        setAllStudents(allStudentsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTeacherData();
    fetchAllStudents();
  }, [userData]);

  const handleInputChange = (field, value) => {
    setNewClassData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleAddStudent = (studentId) => {
    // Check if the student is already selected
    const isSelected = newClassData.students.includes(studentId);

    if (isSelected) {
      // If selected, remove the student from the array
      setNewClassData((prevData) => ({
        ...prevData,
        students: prevData.students.filter((id) => id !== studentId),
      }));
    } else {
      // If not selected, add the student to the array
      setNewClassData((prevData) => ({
        ...prevData,
        students: [...prevData.students, studentId],
      }));
    }
  };

  const isStudentSelected = (studentId) =>
    newClassData.students.includes(studentId);

  const handleCreateClassroom = async () => {
    try {
      const newClassroomData = {
        classSubject: newClassData.classSubject,
        location: newClassData.location,
        students: newClassData.students.map((studentId) => ({
          student: studentId,
          seatInfo: {
            x: null,
            y: null,
            assigned: false,
          },
        })),
      };
      const newClassroom = await createClassroom(
        userData._id,
        newClassroomData
      );

      setClassroomsData((prevData) => [
        ...prevData,
        { classroom: newClassroom },
      ]);
      setNewClassData((prevData) => ({ ...prevData, students: [] }));

      // Updates React Context
      const updatedUserData = await getTeacherById(userData._id);
      updateUser(updatedUserData);

      navigate(`/teacher-home`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents =
    searchTerm.length > 0
      ? allStudents.filter((student) =>
          `${student.firstName} ${student.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      : allStudents;

  const toggleDaySelection = (day) => {
    setSelectedDays((currentSelectedDays) =>
      currentSelectedDays.includes(day)
        ? currentSelectedDays.filter((d) => d !== day)
        : [...currentSelectedDays, day]
    );
  };


  
  return (
    <>
      <div className="h-screen ">
        <div className="flex justify-around items-center pt-8">
          <div className="absolute left-14">
            <GoBack />
          </div>
          <span className="text-header1 w-full text-center font-header1">
            Add New Classroom
          </span>
        </div>

        <div className="bg-sandwich w-[80%]  ml-auto mr-auto p-[1rem] rounded-[1rem] my-[1rem]">
          <h3 className="mb-[0.5rem] ml-[0.5rem] text-header3 font-header2">
            Title or Subject
          </h3>
          <FormField
            label="Math"
            value={newClassData?.classSubject || ""}
            onChange={(e) => handleInputChange("classSubject", e.target.value)}
          />

          <h3 className="mb-[0.5rem] ml-[0.5rem] mt-[0.5rem] text-header3 font-header2">
          Days of the Week
          </h3>
          <div className="flex justify-center space-x-[1.5rem] py-[1rem] font-poppins text-md">
          Sun <Checkbox label="Sunday" />

          <label for="Monday">Mon
          <input type="checkbox" id="Monday"></input></label>
          
          <label for="Tuesday">Tue
          <input type="checkbox" id="Tuesday"></input></label>
          
          <label for="Wednesday">Wed
          <input type="checkbox" id="Wedneday"></input></label>
          
          <label for="Thursday">Thurs
          <input type="checkbox" id="Thursday"></input></label>
          
          <label for="Friday">Fri
          <input type="checkbox" id="Friday"></input></label>
          
          <label for="Saturday">Sat
          <input type="checkbox" id="Saturday"></input></label>
          
          </div>
          <div className="rounded-[1rem]">
            <div className="flex-col text-sm font-body">
              <h3 className="mt-[0.5rem] mb-[0.5rem] ml-[0.5rem] text-header3 font-header2">
                Location
              </h3>
              <FormField
                label="Classroom 101"
                value={newClassData?.location || ""}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>

            <div>
              <div className="flex gap-[8rem]">
                <div className="w-[50%]">
                  <h3 className="mb-[0.5rem] ml-[0.2rem] mt-[0.5rem] text-header3 font-header2">
                    Check-in:
                  </h3>
                  <FormField
                    label="00:00 AM"
                    value={newClassData?.checkIn || ""}
                    onChange={(e) =>
                      handleInputChange("checkIn", e.target.value)
                    }
                  />
                </div>
                <div className="w-[50%]">
                  <h3 className="mb-[0.5rem] ml-[0.2rem] mt-[0.5rem] text-header3 font-header2">
                    Check-out:
                  </h3>
                  <FormField
                    label="00:00 PM"
                    value={newClassData?.checkOut || ""}
                    onChange={(e) =>
                      handleInputChange("checkOut", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center bg-sandwich rounded-[1rem]">
            
            <h2 className="text-header2 font-header2">
              <a href="/edit-seating-chart/:teacherId/:classroomId">
                <u>Edit Seating Chart</u>
              </a>
            </h2>
          </div>
        </div>

        <div className="w-[80%] ml-auto mr-auto p-[2rem] rounded-[1rem] h-[60%] overflow-y-auto ">
          <h2 className="text-header2 font-header2 text-center">
            <a href="/addstudent/:teacherId/:classroomId">
              <u>+ Add student</u>
            </a>
          </h2>
          <div className="flex justify-center pt-[3rem]">
            <div className="flex flex-col w-[80%] gap-5 text-center">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="mb-4 p-[1rem] rounded-lg bg-notebookPaper rounded-3xl border-[0.5rem] border-sandwich font-karla text-lg"
              />
              {filteredStudents.length > 0 && (
                <div className="text-center">
                  <ul className="columns-2">
                    {filteredStudents.map((student) => (
                      <li key={student._id}>
                        <div
                          onClick={() => handleAddStudent(student._id)}
                          className={`flex cursor-pointer font-poppins text-black border-${getBackgroundColorClass(
                            student?.journalEntries[
                              student?.journalEntries.length - 1
                            ]?.checkout?.ZOR ||
                              student?.journalEntries[
                                student?.journalEntries.length - 1
                              ]?.checkin?.ZOR
                          )} bg-${getBackgroundColorClass(
                            student?.journalEntries[
                              student?.journalEntries.length - 1
                            ]?.checkout?.ZOR ||
                              student?.journalEntries[
                                student?.journalEntries.length - 1
                              ]?.checkin?.ZOR
                          )} mb-[0.5rem] border-[0.2rem] rounded-lg opacity-${
                            isStudentSelected(student._id) ? "100" : "60"
                          }`}
                        >
                          <div>
                            <img
                              src={
                                student.avatarImg === "none"
                                  ? youngStudent
                                  : student.avatarImg
                              }
                              alt={student.lastName}
                              className="w-[3rem] h-[3rem] rounded-lg"
                            />
                          </div>
                          <div className="m-auto">
                            {student.firstName} {student.lastName}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="h-[25%] w-full flex justify-center mt-[1rem]">
        <div onClick={handleCreateClassroom}>
        <Button />
        </div>
        </div>

        <div className="bottom-0 fixed w-screen lg:inset-y-0 lg:left-0 lg:order-first lg:w-44 ">
          <Nav  />

          </div>
      </div>
    </>
  );
};


const FormField = ({ label, value, onChange }) => (
  <div>
    <input
      type="text"
      placeholder={label}
      value={value}
      onChange={onChange}
      className="custom-placeholder custom-input"
    />
  </div>
);

export default CreateClass;

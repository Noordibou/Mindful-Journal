import { useEffect, useState } from "react";
import { useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import {
  getTeacherClassroom,
  getAllStudentsClassroom,
  updateSeatingChart,
  getTeacherById
} from "../../api/teachersApi";
import { getBorderColorClass } from "../../components/classRoomColors";
import { useNavigate } from "react-router-dom";

const TESTEditSeatingChart = () => {
  const { teacherId, classroomId } = useParams();
  const { userData, updateUser } = useUser();
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const constraintsRef = useRef(null);

  const [assignedStudents, setAssignedStudents] = useState([]);
  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const navigate = useNavigate();

  const [studentPositions, setStudentPositions] = useState({});

  const fetchData = async () => {
    try {
      const classroom = userData.classrooms.find((c) => c._id === classroomId);
      setClassroom(classroom);
      const classroomStudents = await getAllStudentsClassroom(
        teacherId,
        classroomId
      );

      // Calculate the border color for each student
      const studentsWithBorderColor = classroomStudents.map((student) => {
        const lastJournal =
          student.journalEntries[student.journalEntries.length - 1];
        if (lastJournal) {
          const lastCheckin = lastJournal.checkin;
          const lastCheckout = lastJournal.checkout;
          if (lastCheckout && lastCheckout.ZOR) {
            const zor = lastCheckout.ZOR;
            student.borderColorClass = getBorderColorClass(zor);
          } else if (lastCheckin && lastCheckin.ZOR) {
            const zor = lastCheckin.ZOR;
            student.borderColorClass = getBorderColorClass(zor);
          } else {
            student.borderColorClass = "border-graphite";
          }
        } else {
          student.borderColorClass = "border-graphite";
        }

        return student;
      });

      setStudents(studentsWithBorderColor);
      const positions = {};
      classroom.students.forEach((student) => {
        positions[student._id] = {
          x: student.seatInfo.x || null,
          y: student.seatInfo.y || null,
        };
      });

      setStudentPositions(positions);

      // organizing all unassigned seats to an array
      const unassigned = classroom.students.filter(
        (student) => student.seatInfo.x === null || student.seatInfo.y === null
      );
      setUnassignedStudents(unassigned);

      // organizing all assigned seats to an array
      const assigned = classroom.students.filter(
        (student) => student.seatInfo.x !== null && student.seatInfo.y !== null
      );
      setAssignedStudents(assigned);
    } catch (error) {
      console.log("oof error ");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [teacherId, classroomId, userData]);

  const handleDragEnd = (studentId, x, y) => {
    console.log("ohh hey first hit")
    const motionDiv = document.getElementById(`motion-div-${studentId}`);
    if (motionDiv) {
      const coords = motionDiv.style.transform.match(
        /^translateX\((.+)px\) translateY\((.+)px\) translateZ/
      );
      console.log("ohh hey second hit")
      if (coords?.length) {
        console.log("Coords: " + JSON.stringify(coords));
        console.log("nice it seems to be fine here")
        // Update studentPositions directly
        setStudentPositions((prevPositions) => ({
          ...prevPositions,
          [studentId]: {
            x: parseInt(coords[1], 10),
            y: parseInt(coords[2], 10),
          },
        }));
      } else {
        console.log("well poop")
      }
    }
  };


  // --------- temporary ---------- //
  const handleDivClick = (studentId) => {
    setStudentPositions((prevPositions) => {
      // Find the clicked student in the positions state
      const updatedPositions = { ...prevPositions };
  
      if (studentId in updatedPositions && updatedPositions[studentId].x === null && updatedPositions[studentId].y === null) {
        // Hardcode the coordinates when x and y are null
        updatedPositions[studentId] = { x: 100, y: 100 }; // Change these values accordingly
      }
  
      return updatedPositions;
    });
  };
  // ----------------------------- //

  const handleSubmit = async () => {
    const updatedPositions = students.map((student) => ({
      studentId: student._id,
      x: studentPositions[student._id].x,
      y: studentPositions[student._id].y,
    }));

    try {
      await updateSeatingChart(teacherId, classroomId, updatedPositions);
      console.log("Submitted :)");
      // Optionally, you can show a success message to the user
      // updateUser({
      //   classrooms: [{ _id: classroomId, students: updatedPositions }],
      // });

      const updatedUserData = await getTeacherById(teacherId);
    updateUser(updatedUserData);
      
    } catch (error) {
      // Handle any errors
    }
  };

  return (
    <>
      {" "}
      <div className="flex min-h-screen min-w-screen">
        <div className="w-full">
          <h1 className="text-center mt-10 text-header1">
            Edit Classroom Seating Chart
          </h1>
          <h3 className="text-center mt-10 text-header2">
            🚧 Still in progress 🚧
          </h3>
          <div className="flex justify-around my-8">
            <button className="bg-darkTeal border p-5 h-10 rounded flex items-center">
              Save & Exit
            </button>
            <button
              className="bg-yellow border p-5 h-10 rounded flex items-center"
              onClick={handleSubmit}
            >
              Save & Keep Working
            </button>
            <button className="bg-orange border p-5 h-10 rounded flex items-center">
              Unassign All
            </button>
            <a
              className="bg-lightLavender border p-5 h-10 rounded flex items-center"
              href={`/TESTEditSC/${teacherId}/${classroomId}`}
            >
              Refresh
            </a>
          </div>
          {classroom ? (
            <>
              <div
                className="flex w-[690px] h-[507px] rounded-[1rem] mr-auto ml-auto border-sandwich border-[5px]"
                ref={constraintsRef}
              >
                <h4 className="relative top-1 left-1/2 transform -translate-x-1/2 h-10 bg-sandwich font-body text-body rounded-[1rem] text-center w-96">
                  Smartboard
                </h4>
                {/* Classroom layout here */}

                {assignedStudents.map((studentObj, index) => {
                  const initialX = studentObj.seatInfo.x;
                  const initialY = studentObj.seatInfo.y;

                  const assignedStudent = students.find(
                    (student) => student._id === studentObj._id
                  );
                  if (assignedStudent) {
                    return (
                      <motion.div
                        id={`motion-div-${studentObj._id}`}
                        dragMomentum={false}
                        drag
                        dragElastic={0}
                        dragPropagation={false}
                        dragConstraints={constraintsRef}
                        key={`${studentObj._id}-${index}`}
                        initial={{
                          x: Math.max(0, initialX),
                          y: Math.max(0, initialY),
                        }}
                        className={`absolute border-4 ${assignedStudent.borderColorClass} p-3 rounded-lg h-[80px] w-[80px] bg-lightYellow`}
                        onDragEnd={(event, info) => {
                          const containerBounds =
                            constraintsRef.current.getBoundingClientRect();

                          const containerX =
                            Math.max(0, info.point.x - containerBounds.left) -
                            40;
                          const containerY =
                            Math.max(0, info.point.y - containerBounds.top) -
                            40;
                          console.log(
                            "Dragged to x:",
                            containerX,
                            "y:",
                            containerY,
                            ", for " + assignedStudent.firstName
                          );

                          handleDragEnd(studentObj._id, containerX, containerY);
                        }}
                      >
                        <h1 className="">{assignedStudent.firstName}</h1>
                      </motion.div>
                    );
                  } else {
                    return null;
                  }
                })}
                <div className="absolute bottom-60 w-[680px] flex-col">
            <h2 className="py-3 text-header2">Unassigned Students</h2>
            <div className="flex-wrap flex flex-row bg-lightBlue p-5 rounded">
              {unassignedStudents.map((studentId, index) => {
                const unassignedStudent = students.find(
                  (student) => student._id === studentId._id
                );

                if (unassignedStudent) {
                  return (
                    <div
                      id={`motion-div-${studentId._id}`}
                      key={`unassigned-${index}`}
                      onClick={() => {
                        handleDivClick(studentId._id);
                      }}
                      className={`p-2 border-2 ${unassignedStudent.borderColorClass}`}
                    >
                      {unassignedStudent.firstName}
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          </div>
              </div>
              
            </>
          ) : (
            "Loading..."
          )}
          {/* Unassigned Students */}

        </div>
      </div>
    </>
  );
};

export default TESTEditSeatingChart;
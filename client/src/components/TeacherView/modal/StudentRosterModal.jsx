import { forwardRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import UnassignedStudent from "../../SeatingChart/UnassignedStudent";
import CancelImg from "../../../images/x-button.png";
import { updateSeatingChart } from "../../../api/teachersApi";

const AddStudentModal = forwardRef(
  ({
    dialogRef,
    setShowStudentRosterModal,
    unassignedStudents,
    students,
    teacherId,
    classroomId,
    updateInfo,
  }) => {
    const [isSelected, setIsSelected] = useState([]);

    const handleConfirm = async () => {
      await updateSeatingChart(teacherId, classroomId, isSelected);
      setIsSelected([]);
      updateInfo();
      setShowStudentRosterModal();
    };

    const onClose = () => {
      setShowStudentRosterModal();
      setIsSelected([]);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    useEffect(() => {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    });

    return createPortal(
      <dialog ref={dialogRef} className="rounded overflow-visible">
        {/* Add Student Modal */}
        <div className="w-full md:w-auto flex justify-center items-center">
          <div className="relative h-[70%] md:h-[90%] w-[85%] md:w-[686px] bg-notebookPaper border-sandwich border-4 p-10 rounded">
            <form method="dialog" onSubmit={setShowStudentRosterModal}>
              <button>
                <img
                  className="absolute -top-6 -right-6"
                  src={CancelImg}
                  alt="close student roster"
                  tabIndex="0"
                />
              </button>
            </form>

            {unassignedStudents.length > 0 ? (
              <div className="flex w-full h-full flex-col">
                <h2 className="font-[Poppins] text-[20px] md:text-[24px] my-5">
                  Tap to add students to the classroom
                </h2>
                <div className="flex flex-row h-[220%] md:h-3/4 flex-wrap overflow-y-auto">
                  <UnassignedStudent
                    unassignedStudents={unassignedStudents}
                    students={students}
                    isSelected={isSelected}
                    setIsSelected={setIsSelected}
                  />
                </div>

                <div className="flex items-end h-72 md:h-1/3 justify-center">
                  <button
                    id="unassigned-section"
                    className="flex items-center h-[50px] md:h-[90px] w-full flex-col rounded-2xl border-4 border-darkSandwich"
                    onClick={handleConfirm}
                  >
                    <h2 className="flex items-center h-full font-semibold text-[20px] md:text-header2">
                      Confirm
                    </h2>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-full w-full text-center justify-center pt-20">
                <h2 className="text-black text-[200%]">
                  All students have been assigned in the classroom!
                </h2>
              </div>
            )}
          </div>
        </div>
      </dialog>,
      document.getElementById("modal")
    );
  }
);

export default AddStudentModal;
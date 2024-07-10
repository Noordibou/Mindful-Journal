import { getBackgroundColorClass } from "../utils/classroomColors";
import { Link } from "react-router-dom";
import avatarImg from "../images/Sample_Avatar.png";
import xButton from "../images/x-button.png";
import { getLastJournalInfo } from "../utils/editSeatChartUtil";

const StudentInfoBox = ({
  student,
  userData,
  classroomId,
  handleClick,
  isEditMode,
}) => {
  
  const {bgColorClass, lastCheck, lastEmotion, borderColorClass} = getLastJournalInfo(student);

  return (
    <div className="relative flex flex-col h-full w-full" key={`${student.id}`}>
      {/* bg object */}
      <div
        className={`${
          bgColorClass
            ? `bg-notebookPaper border-${borderColorClass}`
            : "bg-[#ece6d2] border-sandwich"
        } border-4 shadow-2xl h-full w-full rounded-lg flex flex-row `}
      >
        {/* student image */}
        <div
          className={`flex ${
            bgColorClass ? `w-32 md:w-full bg-${bgColorClass} flex justify-center border-${borderColorClass}` : "w-32 md:w-28 opacity-50 bg-[#ece6d2] border-sandwich"
          }`}
        >
          <img
            src={student.avatarImg === "none" ? avatarImg : student.avatarImg}
            alt={student.firstName}
            className={`flex w-24 h-24 rounded-2xl p-2 self-center  ${
              borderColorClass ===
              "sandwich"
                ? "opacity-50"
                : ""
            }`}
          />
        </div>

        {/* text container */}
        <div className="flex flex-col md:flex-row w-full md:w-[80%] px-2 md:px-4 my-2 md:my-5">
          <div>
          {/* last emotion */}
          <div className="pb-2 flex justify-between">
            {lastCheck ? (
              <div className="font-[Poppins] text-[15px] md:text-[17px] px-2">
                <h4>
                  {student.firstName} {student.lastName}
                </h4>
                <span>is feeling{" "}</span>
                <b className="font-semibold underline">{lastEmotion}</b>
              </div>
            ) : (
              <></>
            )}
          </div>

          {/* goals & needs */}
          <div
            className={`${
              bgColorClass
                ? "bg-notebookPaper py-2 flex justify-around"
                : "w-full"
            } px-2 rounded-md `}
          >
            {lastCheck ? (
              <div className="hidden md:flex flex-col w-60">
                <h5 className="font-[Poppins] text-[14px]"><b>Goals:</b> {lastCheck.goal}</h5>
                <h5 className="font-[Poppins] text-[14px]"><b>Needs:</b> {lastCheck.need}</h5>
              </div>
            ) : (
              <div className="flex flex-col w-60 h-16">
                <h5 className="font-[Poppins]">
                  {student.firstName} {student.lastName} hasn't checked in
                  today.
                </h5>
              </div>
            )}
            </div>
          </div>
          <div
              className={`flex items-center justify-center md:justify-end underline text-[14px] md:text-[17px] ${
                bgColorClass ? "w-16" : "w-16 md:w-full flex justify-end h-full pt-4"
              }`}
            >
              <Link to={`/${userData._id}/${classroomId}/${student._id}`}>
                More &gt;
              </Link>
            </div>
        </div>
      </div>
      {isEditMode ? (
        <div className="absolute -top-5 self-end -right-5">
          <button onClick={handleClick}>
            <img src={xButton} alt="x Button" />
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default StudentInfoBox;

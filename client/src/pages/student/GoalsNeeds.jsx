import React, { useState } from "react";
import { useUser } from "../../context/UserContext";
import { updateStudent } from "../../api/studentsApi";
import { useNavigate, useLocation } from "react-router-dom";
import Wiggly from "../../images/wiggly.png";

const GoalsNeeds = () => {
  const navigate = useNavigate();
  const { userData, accumulatedUpdates, updateUserDataAccumulated, clearAccumulatedUpdates, isCheckinOrOut } = useUser();

  const location = useLocation();
  const emotionFromLocation = location.state?.emotion || "";

  const [inputMode1, setInputMode1] = useState(false);
  const [inputMode2, setInputMode2] = useState(false);

  const [userInput1, setUserInput1] = useState('');
  const [userInput2, setUserInput2] = useState('');

  const handleInputChange1 = (e) => {
    setUserInput1(e.target.value);
  };

  const handleInputChange2 = (e) => {
    setUserInput2(e.target.value);
  };

  const handleSubmit = async () => {
    console.log("handle submit activated");
    await updateStudent(userData._id, accumulatedUpdates, isCheckinOrOut);

    navigate("/summary", {
      state: {
        emotion: emotionFromLocation,
      },
    });
  };

  return (
    <>
      <div className="flex flex-col w-screen items-center bg-notebookPaper">
        <div className="items-center justify-center mt-20 mb-[2.5rem]">
          <img className="w-[33rem]" src={Wiggly} alt="Wiggly" />
        </div>

        <div className="max-w-lg mt-5">
          <h2 className="text-header2 font-header2">
            What’s your most important goal for the day?
          </h2>

          <div className="w-full">
            <div className="flex flex-row justify-between mt-3">
              <button
                className="bg-themeWhite m-2 p-4 w-1/2 text-body font-body border-2 border-lightOrange rounded-[1rem] hover:bg-lightOrange"
                onClick={() => updateUserDataAccumulated({ goal: "Finish homework during study hall" })}
              >
                Finish homework during study hall
              </button>
              <button
                className="bg-themeWhite m-2 p-4 w-1/2 text-body font-body border-2 border-lightOrange rounded-[1rem] hover:bg-lightOrange"
                onClick={() => updateUserDataAccumulated({ goal: "Better manage my energy" })}
              >
                Better manage my energy
              </button>
            </div>

            <div className="flex flex-row justify-between">
              <button
                className="bg-themeWhite m-2 p-4 w-1/2 text-body font-body border-2 border-lightOrange rounded-[1rem] hover:bg-lightOrange"
                onClick={() => updateUserDataAccumulated({ goal: "Do my best in class" })}
              >
                Do my best in class
              </button>
              <button
                className="bg-themeWhite m-2 p-4 w-1/2 text-body font-body border-2 border-lightOrange rounded-[1rem] hover:bg-lightOrange"
                onClick={() => updateUserDataAccumulated({ goal: "Be more present" })}
              >
                Be more present
              </button>
            </div>
            <div>
              {inputMode1 ? (
                <div className="p-2">
                  <input
                    type="text"
                    value={userInput1}
                    onChange={handleInputChange1}
                    placeholder="Type your goal here"
                    className="bg-themeWhite p-4 w-full text-body font-body border-2 border-lightOrange rounded-[1rem]"
                  />
                  <button
                    onClick={() => {
                      console.log('User input 1:', userInput1);
                      updateUserDataAccumulated({ goal: userInput1 });
                      setInputMode1(false);
                      setUserInput1('');
                    }}
                    className="bg-lightOrange mt-2 p-4 w-full text-body font-body border-2 border-lightOrange rounded-[1rem] hover:bg-lightOrange/60"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="p-2">
                  <button
                    className="bg-themeWhite p-4 w-full text-body font-body border-2 border-lightOrange rounded-[1rem] hover:bg-lightOrange"
                    onClick={() => setInputMode1(true)}
                  >
                    Something else
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-lg mt-5">
          <h2 className="text-header2 font-header2">What do you need from an adult to succeed today?</h2>

          <div className="w-full">
            <div className="flex flex-row justify-between mt-3">
              <button
                className="bg-themeWhite m-2 p-4 w-1/2 text-body font-body border-2 border-lightOrange rounded-[1rem] hover:bg-lightOrange"
                onClick={() => updateUserDataAccumulated({ need: "Check in with my teacher" })}
              >
                Check in with my teacher
              </button>
              <button
                className="bg-themeWhite m-2 p-4 w-1/2 text-body font-body border-2 border-lightOrange rounded-[1rem] hover:bg-lightOrange"
                onClick={() => updateUserDataAccumulated({ need: "Help with homework" })}
              >
                Help with homework
              </button>
            </div>

            <div className="flex flex-row justify-between">
              <button
                className="bg-themeWhite m-2 p-4 w-1/2 text-body font-body border-2 border-lightOrange rounded-[1rem] hover:bg-lightOrange"
                onClick={() => updateUserDataAccumulated({ need: "Extra practice" })}
              >
                Extra practice
              </button>
              <button
                 className="bg-themeWhite m-2 p-4 w-1/2 text-body font-body border-2 border-lightOrange rounded-[1rem] hover:bg-lightOrange"
                 onClick={() => updateUserDataAccumulated({ need: "Help with focusing" })}
              >
                Help with focusing
              </button>
            </div>
            {inputMode2 ? (
              <div className="p-2">
                <input
                  type="text"
                  value={userInput2}
                  onChange={handleInputChange2}
                  placeholder="Enter your custom message"
                  className="bg-themeWhite p-4 w-full text-body font-body border-2 border-lightOrange rounded-[1rem]"
                />
                <button
                  onClick={() => {
                    console.log('User input 2:', userInput2);
                    updateUserDataAccumulated({ need: userInput2 });
                    setInputMode2(false);
                    setUserInput2('');
                  }}
                  className="bg-lightOrange mt-2 p-4 w-full text-body font-body border-2 border-lightOrange rounded-[1rem] hover:bg-lightOrange/60"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="p-2">
                <button
                  className="bg-themeWhite p-4 w-full text-body font-body border-2 border-lightOrange rounded-[1rem] hover:bg-lightOrange"
                  onClick={() => setInputMode2(true)}
                >
                  Something else
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center w-full mt-10 mb-20">
          <button
            className="w-8/12 rounded-[1rem] py-4 text-body bg-lightOrange hover:bg-lightOrange/60"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

export default GoalsNeeds;

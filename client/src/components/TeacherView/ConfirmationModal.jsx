import { forwardRef } from "react";
import { createPortal } from "react-dom";

const ConfirmationModal = forwardRef(
  (
    {
      closeConfirmModal,
      itemFullName,
      deleteMsg,
      inputValue,
      setInputValue,
      removeItemFromSystem,
    },
    confirmRef
  ) => {
    const resetInput = () => {
      setInputValue("");
      closeConfirmModal();
    };

    return createPortal(
      <dialog ref={confirmRef} className={`rounded-xl`}>
        <div className={`flex items-center justify-center z-10`}>
          <div className="relative bg-sandwich w-[80%] sm:w-auto rounded-xl p-6 sm:p-10 font-[Poppins]">
            <button
              onClick={resetInput}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h1 className="select-none pt-6">{deleteMsg}</h1>
            <h2 className="select-none">Type the below text to confirm.</h2>
            <p id="user-fullname" className="py-5">
              {itemFullName}
            </p>
            <input
              id="name-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="border border-gray-300 rounded-md p-2 mt-2 w-full"
            />
            <div className="w-full flex justify-end pt-8">
              <button
                type="button"
                className="bg-red-500 text-white font-semibold mt-4 p-2 rounded-md"
                onClick={() => removeItemFromSystem()}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </dialog>,
      document.getElementById("modal")
    );
  }
);

export default ConfirmationModal;

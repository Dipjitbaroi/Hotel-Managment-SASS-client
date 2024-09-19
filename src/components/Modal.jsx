import React from "react";

const Modal = ({ id, children, classNames }) => {
  return (
    <dialog id={id} className="modal">
      <div
        className={`modal-box  scrollbar-none ${classNames ? classNames : ""}`}
      >
        {children}
      </div>
    </dialog>
  );
};

export default Modal;

import React from "react";
import { MdOutlineClear } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

const ChangeShift = ({
  formik,
  managerList,
  managers,
  handleAdd,
  handleRemove,
  handleChange,
  setSave,
}) => {
  return (
    <>
      <form autoComplete="off" method="dialog">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          x
        </button>
      </form>
      <div className={`px-10`}>
        <h3 className={`text-2xl font-semibold mb-3`}>Assign Manager</h3>
        <hr />
        <div className={`mt-5 space-y-3`}>
          {managerList.map((elem, idx) => {
            return (
              <>
                <div className="grid grid-cols-2 gap-4 relative">
                  <div className="flex flex-col gap-3">
                    <select
                      name={`manager`}
                      className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
                      onChange={(e) => handleChange(e, idx)}
                    >
                      <option value="" selected disabled>
                        Manager
                      </option>
                      {managers?.map((manager) => (
                        <option value={JSON.stringify(manager)} selected={elem?.manager?._id === manager?._id}>
                          {manager?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Manager Shift box */}
                  <div className="flex flex-col gap-3">
                    <select
                      name={`shift`}
                      className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
                      value={elem.shift}
                      onChange={(e) => handleChange(e, idx)}
                    >
                      <option value="" selected disabled>
                        Shift
                      </option>
                      {/* <option value="shiftManager4">General Shift</option> */}
                      <option value="Morning">Morning</option>
                      <option value="Day">Day</option>
                      <option value="Night">Night</option>
                    </select>
                  </div>
                  {managerList.length !== 1 && (
                    <div
                      className={`absolute right-0 top-1/2 -translate-y-1/2 inline-flex w-6 h-6 items-center justify-center text-red-600 hover:text-green-slimy cursor-pointer transition-colors duration-500 -mr-7`}
                      onClick={() => handleRemove(idx)}
                    >
                      <FaTrash />
                    </div>
                  )}
                </div>
                <div className={`flex justify-between`}>
                  {managerList.length - 1 === idx ? (
                    <form method="dialog">
                      <button
                        className="btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case w-fit"
                        onClick={() => {
                          setSave(true);
                          formik.handleSubmit();
                        }}
                      >
                        Save
                      </button>
                    </form>
                  ) : null}
                  {managerList.length - 1 === idx && managerList.length < 3 && (
                    <button
                      type="button"
                      onClick={handleAdd}
                      className="btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case w-fit"
                    >
                      Add more
                    </button>
                  )}
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ChangeShift;

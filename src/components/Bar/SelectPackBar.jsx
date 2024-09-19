import React from "react";
import { MdOutlineClear } from "react-icons/md";
import {FaTrash} from "react-icons/fa";

const SelectPackBar = ({
  selectPack,
//   packs,
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
        <h3 className={`text-2xl font-semibold mb-3`}>Select Pack</h3>
        <hr />
        <div className={`mt-5 space-y-3`}>
          {selectPack.map((elem, idx) => {
            return (
              <>
                <div className="grid grid-cols-2 gap-4 relative">
                  <div className="flex flex-col gap-3">
                    <select
                      name={`pack`}
                      className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
                      value={elem.pack}
                      onChange={(e) => handleChange(e, idx)}
                    >
                      <option value="" selected disabled>
                        Select Pack
                      </option>
                      <option value="HalfQuater" >
                        Half Quater
                      </option>
                      <option value="singlePack" >
                        Single Pack
                      </option>
                      <option value="largePack" >
                        Large Pack
                      </option>
                      {/* {packs?.map((elem) => (
                        <option value={JSON.stringify(elem)}>
                          {elem?.name}
                        </option>
                      ))} */}
                    </select>
                  </div>
                  {/* Price box */}
                  <div className="flex flex-col gap-3">
                    {/* <select
                      name={`price`}
                      className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
                      value={elem.price}
                      onChange={(e) => handleChange(e, idx)}
                    >
                      <option value="" selected disabled>
                        price
                      </option>
                      <option value="pricepack4">General price</option>
                      <option value="Morning">Morning</option>
                      <option value="Day">Day</option>
                      <option value="Night">Night</option>
                    </select> */}
                    <input
                    name={`price`}
                    type="text"
                    placeholder="Price"
                    className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy"
                    value={elem.price}
                    onChange={(e) => handleChange(e, idx)}
              />

                  </div>
                  {selectPack.length !== 1 && (
                    <div
                      className={`absolute right-0 top-1/2 -translate-y-1/2 inline-flex w-6 h-6 items-center justify-center text-red-600 hover:text-green-slimy cursor-pointer transition-colors duration-500 -mr-7`}
                      onClick={() => handleRemove(idx)}
                    >
                      <FaTrash />
                    </div>
                  )}
                </div>
                <div className={`flex justify-between`}>
                  {selectPack.length - 1 === idx ? (
                    <form method="dialog">
                      <button
                        className="btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case w-fit"
                        onClick={() => setSave(true)}
                      >
                        Save
                      </button>
                    </form>
                  ) : null}
                  {selectPack.length - 1 === idx && selectPack.length < 4 && (
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

export default SelectPackBar;

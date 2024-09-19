import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { Rings } from "react-loader-spinner";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useUpdateUserMutation } from "../../redux/admin/subadmin/subadminAPI";

const HotelLimitEdit = ({ data, hotels }) => {
  const [updateUser, { isLoading, error, isError, isSuccess }] =
    useUpdateUserMutation();
  const closeRef = useRef(null);
  const [user, setUser] = useState(0);
  const { id } = useParams();
  const increment = () => {
    setUser(user + 1);
  };

  const decrement = () => {
    if (user > 0) {
      setUser(user - 1);
    } else {
      setUser(0);
    }
  };

  const reduceLimit = () => {
    if (user === data.assignedHotel.length) {
      toast.error("First delete your hotel.");
    } else {
      decrement();
    }
  };

  const deleteHotel = (hotel) => {
    const obj = { ...data };
    const tempArr = [...obj.assignedHotel];
    const findIdx = tempArr.findIndex((item) => item._id === hotel._id);
    tempArr.splice(findIdx, 1);

    updateUser({ id, data: { assignedHotel: tempArr } });
    toast.success("Deleted successfully!");
  };

  const handleHotelNumChange = () => {
    if (hotels === user) return "";
    updateUser({ id, data: { maxHotels: user } });
    toast.success("Hotel limit updated successfully!");
  };

  useEffect(() => {
    setUser(hotels);
  }, [hotels]);

  return (
    <>
      <form autoComplete="off" method="dialog">
        <button
          ref={closeRef}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => formik.handleReset()}
        >
          ✕
        </button>
      </form>
      <div className={`flex flex-col gap-10 mt-10`}>
        <div className="flex gap-5">
          <h2 className="mt-1">Number Of Hotels :</h2>
          <div className={`flex gap-1.5`}>
            {/* decrement */}
            <button
              onClick={reduceLimit}
              className="btn btn-sm bg-white input-bordered border-gray-500 rounded"
            >
              <AiOutlineMinus />
            </button>
            <h1 className="btn btn-sm bg-white input-bordered border-gray-500 rounded">
              {user}
            </h1>
            {/* increment */}
            <button
              onClick={increment}
              className="btn btn-sm bg-white input-bordered border-gray-500 rounded"
            >
              <AiOutlinePlus />
            </button>
          </div>
          <div>
            <button
              disabled={isLoading}
              onClick={handleHotelNumChange}
              className="btn btn-sm bg-white input-bordered border-gray-500 rounded normal-case"
            >
              Save
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table border">
            <thead>
              <tr>
                <th>Sl</th>
                <th>Hotel Name</th>
                <th>Hotel Branch</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.assignedHotel?.map((hotel, idx) => {
                return (
                  <tr className={idx % 2 === 0 ? "bg-gray-100 hover" : "hover"}>
                    <th> {++idx}</th>
                    <td>{hotel?.name}</td>
                    <td>{hotel?.branch_name}</td>
                    <td className={`space-x-1.5`}>
                      <span
                        className={`btn btn-sm bg-transparent hover:bg-red-500 text-red-500 hover:text-white !border-red-500 rounded normal-case ms-2`}
                        onClick={() => deleteHotel(hotel)}
                      >
                        <MdDelete />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default HotelLimitEdit;

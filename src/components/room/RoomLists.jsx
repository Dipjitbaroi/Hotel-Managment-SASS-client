import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useDeleteRoomMutation } from "../../redux/room/roomAPI.js";
import Swal from "sweetalert2";
import { handleImageUrl } from "../../utils/utils.js";

const RoomLists = ({ currentPage, setCurrentPage, rooms,forcePage }) => {
  const navigate = useNavigate();
  const [deleteRoom] = useDeleteRoomMutation();
  const [roomsPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(1);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Room will be delete.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#35bef0",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Deleted!",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          deleteRoom(id);
        });
      }
    });
  };

  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (rooms) setPageCount(rooms?.data?.totalPages);
  }, [rooms]);

  return (
    <div>
      <div className="overflow-x-auto border">
        <table className="table">
          <thead>
            <tr className={`text-lg`}>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rooms?.data?.docs?.map((room, idx) => {
              const {
                _id,
                bedSize,
                capacity,
                category,
                description,
                floorNumber,
                images,
                price,
                roomNumber,
                status,
                type,
              } = room;

              return (
                <tr
                  key={room._id}
                  className={idx % 2 === 0 ? "bg-gray-100 hover" : "hover"}
                >
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-16 h-16">
                          <img src={handleImageUrl(images[0])} alt="" />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">Room - {roomNumber}</div>
                        <div className="text-md opacity-50">
                          Floor - {floorNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{category}</td>
                  <td>{price}</td>
                  <td>{capacity}</td>
                  <td>
                    {status === "Available" ? (
                      <div className="badge min-w-[6rem] bg-green-slimy border-green-slimy text-white">
                        Available
                      </div>
                    ) 
                    // : status === "Booked" ? (
                    //   <div className="badge min-w-[6rem] bg-orange-600 border-orange-600 text-white">
                    //     Booked
                    //   </div>
                    // ) 
                    : (
                      <div className="badge min-w-[6rem] bg-red-600 border-red-600 text-white">
                        Checked In
                      </div>
                    )}
                  </td>
                  <td className={`flex flex-wrap gap-1.5`}>
                    <span
                      className={`btn btn-md bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case`}
                      onClick={() => navigate(`/dashboard/manage-room/${_id}`)}
                      title={`View`}
                    >
                      <FaEye />
                    </span>
                    <span
                      className={`btn btn-md bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case`}
                      onClick={() => navigate(`/dashboard/edit-room/${_id}`)}
                      title={`Edit`}
                    >
                      <FaEdit />
                    </span>
                    <span
                      className="btn btn-md bg-red-600 hover:bg-transparent text-white hover:text-red-600 !border-red-600 normal-case rounded"
                      title={`Cancel`}
                      onClick={() => handleDelete(_id)}
                    >
                      <FaTrash />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-10">
        <ReactPaginate
          containerClassName="join rounded-none"
          pageLinkClassName="join-item btn btn-md bg-transparent"
          activeLinkClassName="btn-active !bg-green-slimy text-white"
          disabledLinkClassName="btn-disabled"
          previousLinkClassName="join-item btn btn-md bg-transparent"
          nextLinkClassName="join-item btn btn-md bg-transparent"
          breakLinkClassName="join-item btn btn-md bg-transparent"
          previousLabel="<"
          nextLabel=">"
          breakLabel="..."
          pageCount={pageCount}
          pageRangeDisplayed={2}
          marginPagesDisplayed={2}
          onPageChange={handlePageClick}
          renderOnZeroPageCount={null}
          forcePage={currentPage}
        />
      </div>
    </div>
  );
};

export default RoomLists;

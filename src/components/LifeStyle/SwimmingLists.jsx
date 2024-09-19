import React, { useState } from "react";
import {
  FaDoorOpen,
  FaEdit,
  FaEye,
  FaFileInvoice,
  FaPlusCircle,
  FaRegEdit,
  FaTrash,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../Modal.jsx";
// import EditBooking from "./EditBooking.jsx";
import ReactPaginate from "react-paginate";

const SwimmingLists = () => {
  const navigate = useNavigate();
  const [bookingPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="overflow-x-auto border">
        <table className="table">
          <thead>
            <tr className={`text-lg`}>
                <th>Sl</th>
              <th>Guest Name</th>
              <th>Pool Name</th>
              <th>Type Of <br /> Name</th>
              <th>Capacity</th>
              <th>Price</th>
            
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, idx) => {
              return (
                <tr className={idx % 2 === 0 ? "bg-gray-100 hover" : "hover"}>
                    <td>{++idx}</td>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-bold">Jobbar</div>
                        <div className="text-sm opacity-50">Rooms: 101</div>
                      </div>
                    </div>
                  </td>
                  <td>Nepthune</td>
                  <td>OutDoor Pools</td>
                  <td>30</td>
                  <td>
                    1500
                  </td>
                  
                 
                  <td className={`space-x-1.5`}>
                    {/* <span
                      className={`btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case`}
                      title={`View`}
                      onClick={() => navigate(`${++idx}`)}
                    >
                      <FaEye />
                    </span> */}
                
                <Link to={`/dashboard/swimming-edit/${idx}`}>
                          <span
                            className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case md:mb-2 mb-2 ms-2`}
                          >
                            <FaRegEdit />
                          </span>
                        </Link>
                
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Modal id={`eb_modal`}>
          {/* <EditBooking /> */}
        </Modal>
      
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
        />
      </div>
    </div>
  );
};

export default SwimmingLists;

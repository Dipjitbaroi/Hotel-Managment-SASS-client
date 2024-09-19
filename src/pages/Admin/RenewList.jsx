import React, { useState } from "react";
import {FaEye, FaTrash} from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { MdOutlineAutorenew } from "react-icons/md";

import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";


const RenewList = () => {
  const navigate = useNavigate();
  const [renewPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };

  return (
    <div className={`space-y-8 bg-white p-10 rounded-2xl`}>
      <div className={`text-2xl text-center`}>
    Renew List
      </div>
      <div className="overflow-x-auto">
        <table className="table border">
          <thead>
            <tr>
              <th>Sl</th>
              <th>Client Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(2)].map((_, idx) => {
              return (
                <tr className={idx % 2 === 0 ? "bg-gray-100 hover" : "hover"}>
                  <th>{++idx}</th>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                      </div>
                      <div>
                        <div className="font-bold">Jon Doe</div>
                      </div>
                    </div>
                  </td>
                  <td>JonDoe@gmail.com</td>
                  <td>Expired</td>
                  <td className={`space-x-1.5`}>
                    <span
                     className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case mb-2 ms-2`}
                      onClick={() => navigate(`/dashboard/renew-view/${idx}`)}
                    >
                      <FaEye />
                    </span>
                    <span
                      className={`btn btn-sm bg-red-500 hover:bg-transparent text-white hover:text-red-500 !border-red-500 rounded normal-case`}
                      onClick={() => navigate(`/dashboard/edit-renew/${idx}`)}
                    >
                      <MdOutlineAutorenew />
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
        />
      </div>
    </div>
  );
};

export default RenewList;

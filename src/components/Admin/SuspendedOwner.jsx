import React, { useState } from "react";
import { FaUserCheck } from "react-icons/fa";
import ReactPaginate from "react-paginate";

const SuspendedOwner = () => {
  const [ownersPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };

  return (
    <div className="card w-full bg-white shadow-xl">
      <div className="card-body">
        <h1 className="text-2xl text-center ">Suspended Owner</h1>
        <div className="overflow-x-auto mt-10">
          <table className="table border">
            <thead>
              <tr>
                <th>Sl</th>
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, idx) => {
                return (
                  <tr className={idx % 2 === 0 ? "bg-gray-100 hover" : "hover"}>
                    <th>{++idx}</th>
                    <td>Jon Doe</td>
                    <td>jondoe@gmail.com</td>
                    <td>
                      <button type="button" title="unsuspend owner">
                        <FaUserCheck className="hover:text-green-slimy duration-300 text-lg" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <h6 className="m-5">Total: 5</h6>
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
      </div>
    </div>
  );
};

export default SuspendedOwner;

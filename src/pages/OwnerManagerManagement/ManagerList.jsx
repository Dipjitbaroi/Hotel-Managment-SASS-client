import React, { useEffect, useState } from "react";
import { FaEye, FaRegEdit, FaSearch, FaTrash } from "react-icons/fa";
import { AiFillSetting, AiTwotoneDelete } from "react-icons/ai";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useUpdateLicenseStatusMutation } from "../../redux/admin/sls/slsAPI.js";
import { useOwnerListQuery } from "../../redux/admin/ownerlist/ownerListAPI.js";
import { useGetUsersQuery } from "../../redux/admin/subadmin/subadminAPI.js";
import store from "../../redux/store.js";
import { Rings } from "react-loader-spinner";
import OwnerSettings from "../../components/Admin/OwnerSettings.jsx";
import Modal from "../../components/Modal.jsx";
import Swal from "sweetalert2";
import ManagerSettings from "../../components/Admin/ManagerSettings.jsx";

const ManagerList = () => {
  const [keyword, setKeyword] = useState(null);
  const formik = useFormik({
    initialValues: {
      search: "",
      filter: "",
    },
    onSubmit: (values) => {
      setKeyword(values.search);
    },
  });
  const [updateLicenseStatus] = useUpdateLicenseStatusMutation();

  const navigate = useNavigate();
  const [subAdminPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [owner, setOwner] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const parentId = store.getState().authSlice.user._id;
  const { isLoading, data: subadmins } = useGetUsersQuery({
    cp: currentPage,
    filter: formik.values.filter,
    search: keyword,
    role: "manager",
    parentId,
  });

  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };

  const handleDelete = (owner) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Manager will be delete.",
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
          const { user_id, status } = owner;
          updateLicenseStatus({ user_id, status });
        });
      }
    });
  };

  const pressEnter = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      formik.handleSubmit();
    }
  };

  useEffect(() => {
    if (subadmins) setPageCount(subadmins.totalPages);
  }, [subadmins]);

  useEffect(() => {
    if (subadmins && modalOpen) {
      window.ol_modal.showModal();
      setModalOpen(false);
    }
  }, [modalOpen]);

  return (
    <div className={`px-5 space-y-5`}>
      <div className={`bg-white px-10 py-5 rounded`}>
        <div
          className={`flex flex-col sm:flex-row justify-between items-center gap-5`}
        >
          <h3 className={`text-xl font-semibold text-center`}>Manager List</h3>
          <div className={`flex felx-wrap gap-3`}>
            <div>
              <select
                name="filter"
                className="select select-sm select-bordered border-green-slimy rounded w-full focus:outline-none"
                value={formik.values.filter}
                onChange={formik.handleChange}
              >
                <option value="">All</option>
                <option value="Active">In Duty</option>
                <option value="Deactive">Resign</option>
                <option value="Deleted">Deleted</option>
              </select>
            </div>
            <div className={`relative sm:min-w-[20rem]`}>
              <input
                type="text"
                placeholder="Search by name..."
                name="search"
                className="input input-sm input-bordered border-green-slimy rounded w-full focus:outline-none"
                value={formik.values.search}
                onChange={formik.handleChange}
                onKeyUp={(e) => {
                  e.target.value === "" ? formik.handleSubmit() : null;
                }}
                onKeyDown={(e) => pressEnter(e)}
              />
              <button
                type="button"
                className="absolute top-0 right-0 btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
                onClick={() => formik.handleSubmit()}
              >
                <FaSearch />
              </button>
            </div>
          </div>
        </div>
        <hr className={`my-5`} />
        <div className={`space-y-10`}>
          {!isLoading ? (
            subadmins?.docs?.length ? (
              <>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Name</th>
                        <th>Username</th>
                        {/* <th>Sub Admin Address</th> */}
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Emergency Contact</th>

                        <th>Status</th>
                        {/* <th>Salary</th> */}
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subadmins?.docs?.map((sa, idx) => {
                        return (
                          <tr
                            key={idx}
                            className={
                              idx % 2 === 0 ? "bg-gray-100 hover" : "hover"
                            }
                          >
                            <th>{++idx}</th>
                            <td>{sa?.name}</td>
                            <td>{sa?.username}</td>
                            <td>{sa?.email}</td>
                            <td>{sa?.phone_no}</td>
                            <td>{sa?.emergency_contact}</td>

                            {/* <td>{owner?.status === "Active" ? (
                              <div className="badge min-w-[7rem] bg-green-slimy border-green-slimy text-white">
                                Active
                              </div>
                          ) : (
                              <div className="badge min-w-[7rem] bg-red-600 border-red-600 text-white">
                                Deactive
                              </div>
                          )}</td> */}
                            <td>
                              {sa?.status === "Active" ? (
                                <div className="badge min-w-[7rem] bg-green-slimy border-green-slimy text-white">
                                  In Duty
                                </div>
                              ) : sa?.status === "Deactive" ? (
                                <div className="badge min-w-[7rem] bg-red-600 border-red-600 text-white">
                                  Resign
                                </div>
                              ) : (
                                <div className="badge min-w-[7rem] bg-orange-600 border-orange-600 text-white">
                                  Deleted
                                </div>
                              )}
                            </td>
                            <td className={`flex flex-wrap gap-1.5`}>
                              <Link
                                to={`/dashboard/managerList-view/${sa?._id}`}
                              >
                                <span
                                  className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case`}
                                >
                                  <FaEye />
                                </span>
                              </Link>
                              <Link to={`/dashboard/manager-edit/${sa?._id}`}>
                                <span
                                  className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case`}
                                >
                                  <FaRegEdit />
                                </span>
                              </Link>
                              {sa?.status !== "Deleted" ? (
                                <span
                                  className={`btn btn-sm bg-red-500 hover:bg-transparent text-white hover:text-red-500 !border-red-500 rounded normal-case`}
                                  onClick={() =>
                                    handleDelete({
                                      user_id: sa?._id,
                                      status: "Deleted",
                                    })
                                  }
                                >
                                  <FaTrash />
                                </span>
                              ) : null}
                              <span
                                className={`btn btn-sm bg-green-slimy hover:bg-transparent hover:text-green-slimy text-white !border-green-slimy rounded normal-case`}
                                onClick={() => {
                                  setOwner({
                                    id: sa?._id,
                                    status: sa?.status,
                                  });
                                  setModalOpen(true);
                                }}
                              >
                                <AiFillSetting />
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
                <Modal id={`ol_modal`}>
                  <ManagerSettings owner={owner} />
                </Modal>
              </>
            ) : (
              <h3 className={`mt-10 text-center`}>No data found!</h3>
            )
          ) : (
            <Rings
              width="50"
              height="50"
              color="#37a000"
              wrapperClass="justify-center"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerList;

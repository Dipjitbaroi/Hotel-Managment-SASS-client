import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaEye,
  FaRegEdit,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { useFormik } from "formik";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AiFillSetting } from "react-icons/ai";
import Modal from "../../components/Modal.jsx";
import OwnerSettings from "../../components/Admin/OwnerSettings.jsx";
import ReactPaginate from "react-paginate";
import { useOwnerListQuery } from "../../redux/admin/ownerlist/ownerListAPI.js";
import { Rings } from "react-loader-spinner";
import { useUpdateLicenseStatusMutation } from "../../redux/admin/sls/slsAPI.js";


import Swal from "sweetalert2";
import store from "../../redux/store.js";
import {
  getLatestDate,
  isValidUrl,
} from "../../utils/utils.js";
import { getIndianFormattedDate } from "../../utils/timeZone.js";

const AdminOwnerList = ({ title }) => {
  const { user } = store.getState().authSlice;

  const [keyword, setKeyword] = useState(null);
  const formik = useFormik({
    initialValues: {
      search: "",
      filter: "",
    },
    onSubmit: (values) => {
      setCurrentPage(0);
      setForcePage(0);
      setKeyword(values.search);
    },
  });
  const [updateLicenseStatus] = useUpdateLicenseStatusMutation();

  const navigate = useNavigate();
  const [forcePage, setForcePage] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [owner, setOwner] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { id } = useParams();

  const {
    isLoading,
    data: owners,
    refetch,
  } = useOwnerListQuery({
    cp: currentPage,
    filter: formik.values.filter,
    search: keyword,
    role: "owner",
    parentId: id,
  });
  useEffect(() => {
    refetch();
  }, []);

  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };

  const handleDelete = (owner) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Owner will be delete.",
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
    if (owners) setPageCount(owners.totalPages);
  }, [owners]);

  useEffect(() => {
    if (owner && modalOpen) {
      window.ol_modal.showModal();
      setModalOpen(false);
    }
  }, [modalOpen]);

  const location = useLocation();
  const { pathname } = location;
  return (
    <div>
      <div className={`space-y-8 bg-white p-4 rounded-2xl`}>

        <span>
          {isValidUrl("adminowner-list", pathname) ? (
            <div>
              <Link to={`/dashboard `}>
                <button
                  type="button"
                  className="text-white bg-green-slimy  font-medium rounded-lg text-sm p-2.5 text-center inline-flex me-2 gap-1 "
                >
                  <dfn>
                    <abbr title="Back">
                      <FaArrowLeft />
                    </abbr>
                  </dfn>

                  <span className="tracking-wider font-semibold text-[1rem] "></span>
                </button>
              </Link>
            </div>
          ) : (
            ""
          )}
        </span>
        <div>
          <h1 className="bg-green-slimy text-2xl text-center text-white max-w-3xl  mx-auto py-3 px-5 rounded space-x-1.5 mb-7">
            Owner List
          </h1>
        </div>


        <div className={`flex justify-end gap-4`}>
          <div className={`flex justify-end flex-col sm:flex-row gap-5`}>
            <div>
              <select
                name="filter"
                className="select select-sm select-bordered border-green-slimy rounded w-full focus:outline-none"
                value={formik.values.filter}
                onChange={(e) => {
                  formik.setFieldValue("filter", e.target.value);
                  setCurrentPage(0);
                }}
              >
                <option value="">All</option>
                <option value="Active">Active</option>
                <option value="Deactive">Deactivate</option>
                <option value="Suspended">Suspend</option>
                <option value="Expired">Expired</option>
                {isValidUrl("dashboard/adminowner-list", pathname) &&
                  user.role === "admin" && (
                    <option value="Deleted">Deleted</option>
                  )}
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
                  e.target.value === "" && setForcePage(1);
                  e.target.value === "" && setCurrentPage(0);
                  e.target.value === "" ? formik.handleSubmit() : null;
                }}
                onKeyDown={(e) => pressEnter(e)}
              />
              <button
                onClick={() => formik.handleSubmit()}
                type="button"
                className="absolute top-0 right-0 btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
              >
                <FaSearch />
              </button>
            </div>
          </div>
        </div>
        {!isLoading ? (
          owners?.docs?.length ? (
            <>
              <div className="overflow-x-auto">
                <table className="table border">
                  <thead>
                    <tr>
                      <th>Sl</th>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Duration</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...owners?.docs]
                      ?.sort((a, b) =>
                        a.name.toLowerCase() > b.name.toLowerCase()
                          ? 1
                          : a.name.toLowerCase() < b.name.toLowerCase()
                          ? -1
                          : 0
                      )
                      ?.map((owner, idx) => {
                        return (
                          <tr
                          key={idx}
                            className={
                              idx % 2 === 0 ? "bg-gray-100 hover" : "hover"
                            }
                          >
                            <th>{++idx}</th>
                            <td>{owner?.name}</td>
                            <td>{owner?.username}</td>
                            <td>{owner?.email}</td>
                            <td>
                              {owner?.status === "Active" ? (
                                <div className="badge min-w-[7rem] bg-green-slimy border-green-slimy text-white">
                                  Active
                                </div>
                              ) : owner?.status === "Deactive" ||
                                owner?.status === "Deleted" ? (
                                <div className="badge min-w-[7rem] bg-red-600 border-red-600 text-white">
                                  {owner?.status}
                                </div>
                              ) : owner?.status === "Suspended" ? (
                                <div className="badge min-w-[7rem] bg-red-500 border-red-500 text-white">
                                  Suspended
                                </div>
                              ) : (
                                <div className="badge min-w-[7rem] bg-orange-600 border-orange-600 text-white">
                                  Expired
                                </div>
                              )}
                            </td>
                            <td>
                              {owner?.extended_time?.length
                                ? getIndianFormattedDate(
                                    getLatestDate(owner?.extended_time).from
                                  )
                                : getIndianFormattedDate(owner?.bill_from)}
                              <span className="px-1"> - </span>
                              {owner?.extended_time?.length
                                ? getIndianFormattedDate(
                                    getLatestDate(owner?.extended_time).to
                                  )
                                : getIndianFormattedDate(owner?.bill_to)}
                            </td>
                            <td className={`flex flex-wrap gap-1.5`}>
                              <span
                                className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case`}
                                onClick={() =>
                                  navigate(
                                    `/dashboard/adminowner-view/${owner?._id}`
                                  )
                                }
                              >
                                <FaEye />
                              </span>
                              <Link
                                to={`/dashboard/owner-profile/${owner?._id}/edit`}
                              >
                                <span
                                  className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case`}
                                >
                                  <FaRegEdit />
                                </span>
                              </Link>
                              {owner?.status !== "Deleted" &&
                              user?.role !== "subadmin" ? (
                                <span
                                  className={`btn btn-sm bg-red-500 hover:bg-transparent text-white hover:text-red-500 !border-red-500 rounded normal-case`}
                                  onClick={() =>
                                    handleDelete({
                                      user_id: owner?._id,
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
                                    id: owner?._id,
                                    status: owner?.status,
                                    extended_time: owner?.extended_time,
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
                  forcePage={forcePage}
                />
              </div>
              <Modal id={`ol_modal`}>
                <OwnerSettings owner={owner} />
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
  );
};

export default AdminOwnerList;

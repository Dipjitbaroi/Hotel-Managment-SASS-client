import { useFormik } from "formik";
import React, { useState } from "react";
import {
  FaArrowLeft,
  FaUserAltSlash,
  FaUserCheck,
  FaUserLock,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
// import SubAdminReport from "./SubAdminReport";
import ReactPaginate from "react-paginate";
import OwnerList from "../../components/Admin/OwnerList.jsx";
import SuspendedOwner from "../../components/Admin/SuspendedOwner.jsx";
import TransactionHistory from "../../components/Admin/TransactionHistory";
import StatusHistory from "../../components/Admin/StatusHistory";
import AdminOwnerList from "./AdminOwnerList";
import { useGetUserQuery } from "../../redux/admin/subadmin/subadminAPI";
import Report from "./Report.jsx";
import { getOnlyFormatDate } from "../../utils/utils.js";

const SubAdminListView = () => {
  const navigate = useNavigate();
  const [roomsPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const { id } = useParams();

  const { data: userData, error, isLoading } = useGetUserQuery(id);
  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page);
  };

  const formik = useFormik({
    initialValues: {
      entries: "",
      search: "",
      startDate: "",
      endDate: "",
    },
  });

  return (
    <div className={`space-y-10`}>
      <div className="w-full rounded-xl bg-white shadow-xl p-5">
        <div>
          <span
            className={`inline-flex w-8 h-8 items-center justify-center bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy border border-green-slimy cursor-pointer rounded-full normal-case transition-colors duration-500`}
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
          </span>
        </div>
      <div>
      <h1 className="bg-green-slimy text-2xl text-center text-white max-w-3xl  mx-auto py-3 px-5 rounded space-x-1.5 mb-7 mt-5">
          Sub Admin Information
        </h1>
      </div>
      {/* ===== */}
      <div className="card-body grid grid-cols xl:grid-cols-2 ">
         <div className="">
         <h2 className="card-title mb-3">Sub Admin Information </h2>
           <table className="table-auto overflow-x-auto ">
             <tbody>
               <tr>
                 <th className="text-start">User Name </th>
                 <td className="pl-2">:</td>
                 <td className="break-all pl-5">{userData?.username}</td>
               </tr>
               <tr>
                 <th className="text-start">Name</th>
                 <td className="pl-2">:</td>
                 <td className="break-all pl-5"> {userData?.name}</td>
               </tr>
               <tr>
                 <th className="text-start">Address</th>
                 <td className="pl-2">:</td>
                 <td className="break-all pl-5">
                   <span>{userData?.address}</span>
                 </td>
               </tr>
               <tr>
                 <th className="text-start">Emergency No</th>
                 <td className="pl-2">:</td>
                 <td className="break-all">
                   <span className="break-all pl-5"> {userData?.emergency_contact}</span>
                 </td>
               </tr>
             
               <tr>
                 <th className="text-start">Email</th>
                 <td className="pl-2">:</td>
                 <td className="break-all pl-5">
                   <span>{userData?.email}</span>
                 </td>
               </tr>
             </tbody>
           </table>
         </div>
         <div className="">
            <h2 className="card-title mb-3">Other Information </h2>
            <table>
              <tbody>
                <tr>
                  <th className="text-start">Joining Date</th>
                  <td className="pl-2">:</td>
                  <td className="break-all pl-3">
                    {getOnlyFormatDate(userData?.joining_date)}
               
                  </td>
                </tr>
                <tr>
                  <th className="text-start">Salary</th>
                  <td className="pl-2">:</td>
                  <td className="break-all pl-3">{userData?.salary}</td>
                </tr>
                <tr>
                  <th className="text-start">Status</th>
                  <td className="pl-2">:</td>
                  <td className="break-all pl-3">{userData?.status}</td>
                </tr>
              </tbody>
            </table>
          </div>
       </div>
    
      </div>
      <AdminOwnerList title={"Owner List"} />
      <TransactionHistory />
      <StatusHistory />
      {/* <SuspendedOwner /> */}
      <Report />
    </div>
  );
};

export default SubAdminListView;

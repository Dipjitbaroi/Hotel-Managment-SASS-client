import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { FaArrowLeft, FaEyeSlash } from "react-icons/fa";
import { useSelector } from "react-redux";
import Modal from "../../components/Modal.jsx";
import HotelAsManager from "../../components/owner/HotelAsManager.jsx";
import { useGetUsersQuery } from "../../redux/admin/subadmin/subadminAPI.js";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import {
  useHotelQuery,
  useUpdateHotelMutation,
} from "../../redux/Owner/hotelsAPI.js";
import { Rings } from "react-loader-spinner";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

// form validation
const validationSchema = yup.object({
  name: yup.string().required("Hotel Name is required"),
  address: yup.string().required("Hotel Address is required"),
  email: yup.string().required("Hotel Email is required"),
  phoneNumber: yup.string().required("Phone Number  is required"),
  branchName: yup.string().required("Branch Name is required"),
});

const HotelEdit = () => {
  // const [save, setSave] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [updateHotel] = useUpdateHotelMutation();
  const [showManagers, setShowManagers] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const { isLoading: isFetching, data: hotel } = useHotelQuery(id);
  const { user } = useSelector((store) => store.authSlice);
  // const [managerList, setManagerList] = useState([{ manager: "", shift: "" }]);
  const { data: managers } = useGetUsersQuery({
    cp: 0,
    filter: "",
    search: "",
    role: "manager",
    parentId: user?._id,
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      email: "",
      phoneNumber: "",
      branchName: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);

      const obj = { ...values };
      const {
        name,
        address,
        email,
        phoneNumber: phone_no,
        branchName: branch_name,
      } = obj;

      const response = await updateHotel({
        id,
        data: {
          name,
          address,
          email,
          phone_no,
          branch_name,
          managers: showManagers,
        },
      });
      if (response?.error) {
        toast.error(response.error.data.message);
      } else {
        toast.success(response.data.message);
        navigate(-1);
      }

      setLoading(false);
    },
  });

  // const handleChange = (e, index) => {
  //   const { name, value } = e.target;
  //   const list = [...managerList];
  //   list[index][name] = value;
  //   setManagerList(list);
  // };

  // const handleRemove = (index) => {
  //   const list = [...managerList];
  //   list.splice(index, 1);
  //   setManagerList(list);
  // };

  // const handleAdd = () => {
  //   setManagerList([...managerList, { manager: "", shift: "" }]);
  // };

  // useEffect(() => {
  //   if (save) {
  //     const tempList = [
  //       ...managerList
  //         ?.map((elem) => ({
  //           ...(elem.manager
  //             ? typeof elem.manager === "string"
  //               ? JSON.parse(elem.manager)
  //               : elem.manager
  //             : {}),
  //           shift: elem.shift,
  //         }))
  //         ?.filter((elem) => Boolean(elem._id) && Boolean(elem.shift)),
  //     ];

  //     setShowManagers(tempList);
  //     setSave(false);
  //   }
  // }, []);


  useEffect(() => {
    if (hotel) {
      formik.setValues({
        name: hotel.name,
        address: hotel.address,
        email: hotel.email,
        phoneNumber: hotel.phone_no,
        branchName: hotel.branch_name,
      });

      const tempArr =  hotel && hotel?.managers?.map((elem) => ({
        manager: elem,
        shift: elem.shift,
      }));

      // setManagerList(tempArr);
      // setSave(true);
    }
  }, [hotel]);


  return (
    <div className={`space-y-10`}>
      <div className="card bg-white shadow-xl">
        <div className="card-body p-2">
          <div className="text-2xl  items-center gap-1.5">
            <div>
              <span
                className={`inline-flex w-8 h-8 items-center p-2 justify-center bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy border border-green-slimy cursor-pointer rounded-full normal-case transition-colors duration-500`}
                onClick={() => navigate(-1)}
              >
                {/* <IoArrowBackOutline /> */}
                <FaArrowLeft /> 
              </span>
            </div>
            <div>
              <h2 className="text-center bg-green-slimy text-white py-1 max-w-[18rem] mx-auto mt-4 rounded-md ">
                Edit Hotel
              </h2>
            </div>
          </div>
          <hr className={`my-5`} />
        </div>

        {!isFetching ? (
          <>
            <div className="max-auto">
              <form
                autoComplete="off"
                className="form-control grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-10 p-3"
                onSubmit={formik.handleSubmit}
              >
                {/* Hotel Name box */}
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy "
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && Boolean(formik.errors.name) ? (
                    <small className="text-red-600">
                      {formik.touched.name && formik.errors.name}
                    </small>
                  ) : null}
                </div>
                {/*Hotel Branch box */}
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Branch Name"
                    name="branchName"
                    className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy "
                    value={formik.values.branchName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.branchName &&
                  Boolean(formik.errors.branchName) ? (
                    <small className="text-red-600">
                      {formik.touched.branchName && formik.errors.branchName}
                    </small>
                  ) : null}
                </div>
                {/* Hotel Address box */}
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Address"
                    name="address"
                    className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy "
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {formik.touched.address && Boolean(formik.errors.address) ? (
                    <small className="text-red-600">
                      {formik.touched.address && formik.errors.address}
                    </small>
                  ) : null}
                </div>
                {/* Email box */}
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Email "
                    name="email"
                    className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy "
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && Boolean(formik.errors.email) ? (
                    <small className="text-red-600">
                      {formik.touched.email && formik.errors.email}
                    </small>
                  ) : null}
                </div>

                {/*Phone Number  box */}
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Phone Number"
                    name="phoneNumber"
                    className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy "
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.phoneNumber &&
                  Boolean(formik.errors.phoneNumber) ? (
                    <small className="text-red-600">
                      {formik.touched.phoneNumber && formik.errors.phoneNumber}
                    </small>
                  ) : null}
                </div>
                <button
                  onClick={() =>
                    navigate(
                      `/dashboard/change-hotel-password/${hotel?.manager_acc?._id}`
                    )
                  }
                  type="button"
                  className=" btn btn-md  bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
                >
                  <span>Change Password</span>
                </button>
                {/* <button
                  type="button"
                  className="btn btn-md bg-transparent border-gray-500/50 rounded focus:outline-none focus:border-green-slimy normal-case"
                  onClick={() => window.ol_modal.showModal()}
                >
                  Assign Manager
                </button> */}
                {/* {showManagers.length ? (
                  <div className={`col-span-full`}>
                    <h3>Assigned Manager</h3>
                    <ul className={`list-disc list-inside`}>
                      {showManagers?.map((elem) => (
                        <li>
                          {elem.name} - {elem.shift}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null} */}
                {/* submit button */}
                <div className="flex flex-col gap-3 col-span-full text-end">
                  <button
                    disabled={isLoading}
                    type="submit"
                    className=" btn btn-md  bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
                  >
                    <span>Update Hotel</span>
                    {isLoading ? (
                      <span
                        className="inline-block h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"
                        role="status"
                      ></span>
                    ) : null}
                  </button>
                </div>
              </form>
            </div>
            {/* <Modal id={`ol_modal`}>
              <HotelAsManager
                setSave={setSave}
                managers={managers?.docs}
                managerList={managerList}
                handleAdd={handleAdd}
                handleRemove={handleRemove}
                handleChange={handleChange}
              />
            </Modal> */}
          </>
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

export default HotelEdit;

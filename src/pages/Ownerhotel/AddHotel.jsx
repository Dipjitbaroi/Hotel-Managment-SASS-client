import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import * as yup from "yup";
import Modal from "../../components/Modal.jsx";
import HotelAsManager from "../../components/owner/HotelAsManager.jsx";
import {
  useAddHotelMutation,
  useHotelQuery,
  useHotelsQuery,
} from "../../redux/Owner/hotelsAPI.js";
import { useGetUsersQuery } from "../../redux/admin/subadmin/subadminAPI.js";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { Rings } from "react-loader-spinner";
import { Link } from "react-router-dom";

// form validation
const validationSchema = yup.object({
  name: yup.string().required("Hotel Name is required"),
  address: yup.string().required("Address is required"),
  email: yup.string().required("Hotel Email is required"),
  phoneNumber: yup.string().required("Phone Number  is required"),
  branchName: yup.string().required("Branch Name is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  username: yup
    .string()
    .required("Username is required")
    .matches(
      /^[a-zA-Z][a-zA-Z0-9]*$/,
      "Username must start with a character and can include characters and numbers"
    ),
});

const AddHotel = () => {
  const [isLoading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.authSlice);
  const [addHotel, { isLoading: addHotelLoading }] = useAddHotelMutation();
  const [managerList, setManagerList] = useState([{ manager: "", shift: "" }]);
  const [showManagers, setShowManagers] = useState([]);
  const [showPass, setShowPass] = useState(false);
  const {
    isLoading: hotelsLoading,
    data: hotels,
    isError,
  } = useHotelsQuery({
    uid: user._id,
    pid: "",
    filter: "Active",
    limit: 1000,
    cp: 0,
  });
  const { data: managers } = useGetUsersQuery({
    cp: 0,
    filter: "",
    search: "",
    role: "manager",
    parentId: user?._id,
  });
  const [save, setSave] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      email: "",
      phoneNumber: "",
      branchName: "",
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, formikHelpers) => {
      setLoading(true);

      const obj = { ...values };
      const {
        name,
        address,
        email,
        phoneNumber: phone_no,
        branchName: branch_name,
        username,
        password,
      } = obj;

      const response = await addHotel({
        owner_id: user?._id,
        name,
        address,
        email,
        phone_no,
        branch_name,
        managers: showManagers,
        username,
        password,
      });

      if (response?.error) {
        toast.error(response.error.data.message);
      } else {
        toast.success(response.data.message);
        formikHelpers.resetForm();
        setManagerList([{ manager: "", shift: "" }]);
        setSave(true);
      }

      setLoading(false);
    },
  });

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...managerList];
    list[index][name] = value;
    setManagerList(list);
  };

  const handleRemove = (index) => {
    const list = [...managerList];
    list.splice(index, 1);
    setManagerList(list);
  };

  const handleAdd = () => {
    setManagerList([...managerList, { manager: "", shift: "" }]);
  };

  useEffect(() => {
    if (save) {
      const tempList = [
        ...managerList
          .map((elem) => ({
            ...(elem.manager ? JSON.parse(elem.manager) : {}),
            shift: elem.shift,
          }))
          .filter((elem) => Boolean(elem._id) && Boolean(elem.shift)),
      ];

      setShowManagers(tempList);
      setSave(false);
    }
  }, [save]);
  if (hotelsLoading) {
    return (
      <Rings
        width="50"
        height="50"
        color="#37a000"
        wrapperClass="justify-center"
      />
    );
  }
  return (
    <div className={`space-y-10 min-h-screen`}>
      <div className="card bg-white shadow-xl">
        <div className="card-body p-4">
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

                <span className="tracking-wider font-semibold text-[1rem]"></span>
              </button>
            </Link>
          </div>
          <div>
            <h2 className="text-center text-2xl bg-green-slimy w-48 mx-auto text-white p-1 rounded-md mb-4">
              Add Hotel
            </h2>
          </div>
          <div className="text-2xl md:flex justify-end items-center ">
            <h2 className="shadow-lg bg-slate-100 px-4 py-2 rounded-md text-green-slimy inline-block space-x-1.5 text-base">
              {user?.maxHotels - hotels?.docs?.length >= 1 ? (
                <>
                  <span className="text-base ">You can add</span>
                  <span className="text-green-slimy font-bold">
                    {` ${user?.maxHotels - hotels?.docs?.length}`}
                  </span>
                  <span className="text-base">hotels.</span>
                </>
              ) : (
                <span className="text-sm font-semibold uppercase text-red-600">
                  Please Upgrade your package to add more hotels.
                </span>
              )}
            </h2>
          </div>
          <hr className={`my-5`} />
        </div>

        <div className="max-auto">
          <form
            autoComplete="off"
            className="form-control grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-10 p-4"
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
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Username "
                name="username"
                className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy "
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.username && Boolean(formik.errors.username) ? (
                <small className="text-red-600">
                  {formik.touched.username && formik.errors.username}
                </small>
              ) : null}
            </div>
            <div className={`flex flex-col gap-3`}>
              <div className={`relative`}>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="New Password"
                  name="password"
                  className="input input-md bg-transparent input-bordered border-gray-500/50 rounded focus:outline-none focus:border-green-slimy w-full"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {showPass ? (
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer`}
                    onClick={() => setShowPass(false)}
                  >
                    <FaEyeSlash />
                  </span>
                ) : (
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer`}
                    onClick={() => setShowPass(true)}
                  >
                    <FaEye />
                  </span>
                )}
              </div>
              {formik.touched.password && Boolean(formik.errors.password) ? (
                <small className="text-red-600">
                  {formik.touched.password && formik.errors.password}
                </small>
              ) : null}
            </div>
            {/* <button
              type="button"
              className="btn btn-md bg-transparent border-gray-500/50 rounded focus:outline-none focus:border-green-slimy normal-case"
              onClick={() => window.ol_modal.showModal()}
            >
              Assign Manager
            </button>
            {showManagers.length ? (
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
                type="submit"
                className=" btn btn-md  bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
                disabled={
                  addHotelLoading
                    ? true
                    : user?.maxHotels - hotels?.docs?.length === 0
                }
              >
                <span>Create Hotel</span>
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
      </div>
      <Modal id={`ol_modal`}>
        <HotelAsManager
          setSave={setSave}
          managers={managers?.docs}
          managerList={managerList}
          handleAdd={handleAdd}
          handleRemove={handleRemove}
          handleChange={handleChange}
        />
      </Modal>
    </div>
  );
};
export default AddHotel;

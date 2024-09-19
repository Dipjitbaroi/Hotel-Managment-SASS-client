import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import RoomLists from "../../components/room/RoomLists.jsx";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import {
  useGetRoomsAndHotelsQuery,
  useRoomsQuery,
} from "../../redux/room/roomAPI.js";
import { Rings } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ManageRoom = () => {
 
  const { user } = useSelector((store) => store.authSlice);
  const [keyword, setKeyword] = useState(null);
  const [forcePage, setForcePage] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const formik = useFormik({
    initialValues: {
      filter: "",
      search: "",
      // hotel_id: "",
    },
    onSubmit: (values) => {
      setKeyword(values.search);
      setCurrentPage(0);
    },
  });

  const { isLoading, data: rooms } = useRoomsQuery({
    id: formik.values.hotel_id,
    cp: currentPage,
    filter: formik.values.filter,
    search: keyword,
  });

  const pressEnter = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      formik.handleSubmit();
    }
  };

  const { data: hotelsList } = useGetRoomsAndHotelsQuery();

  useEffect(() => {
    if (formik.values.filter) {
      setCurrentPage(0);
    }
  }, [formik.values.filter]);

  return (
    <div className={`space-y-10 bg-white p-4 rounded-2xl `}>
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
      <div  className={`bg-green-slimy text-2xl text-white max-w-3xl  mx-auto py-3 px-5 rounded space-x-1.5 mb-7 text-center`}>
        <h1>Manage Room</h1>
      </div>
      <div className="flex justify-end">
        

        <div className={`flex gap-3`}>
          <div>
            <select
              name="filter"
              className="select select-sm select-bordered border-green-slimy rounded focus:outline-none"
              value={formik.values.filter}
              onChange={formik.handleChange}
            >
              <option value="">All</option>
              <option value="Available">Available</option>
              {/* <option value="Booked">Booked</option> */}
              <option value="CheckedIn">Checked In</option>
            </select>
          </div>
          <div className={`relative sm:min-w-[20rem]`}>
            <input
              type="text"
              placeholder="Search by room number..."
              name="search"
              className="input input-sm input-bordered border-green-slimy rounded w-full focus:outline-none"
              value={formik.values.search}
              onChange={formik.handleChange}
              onKeyUp={(e) => {
                e.target.value === "" &&  setForcePage(0)
                e.target.value === "" && setCurrentPage(0)
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
      {!isLoading ? (
        rooms?.data?.docs?.length ? (
          <RoomLists
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            rooms={rooms}
            forcePage={forcePage}
          />
        ) : (
          <h3 className="text-center">No data found!</h3>
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
  );
};

export default ManageRoom;

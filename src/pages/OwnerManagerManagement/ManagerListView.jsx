import React, {useEffect, useState} from "react";
import { FaArrowLeft, FaDownload, FaEdit } from "react-icons/fa";
import { BsFillArrowDownSquareFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import StatusSettings from "./StatusSettings.jsx";
import Modal from "../../components/Modal.jsx";
import img from "../../../src/../src/assets/profile.jpeg";
import { saveAs } from "file-saver";

import { FaCamera } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useGetUserQuery } from "../../redux/admin/subadmin/subadminAPI.js";
import { Rings } from "react-loader-spinner";
import { useGetHotelsQuery } from "../../redux/Owner/hotelsAPI.js";

const ManagerListView = () => {
  const { id } = useParams();

  const { data: userData, error, isLoading } = useGetUserQuery(id);
  const { data: hotels } = useGetHotelsQuery({ id, cp: 0 });
  const navigate = useNavigate();
    useEffect(() => {
        if (userData) {
            const filteredImages = Object.values(userData?.images)
                .flat()
                .filter((value) => value !== '')
        }
    }, []);

  return (
    <>
      <div>
        <div className="card w-full bg-white shadow-xl p-5">
          {/* back button */}
          <div>
            <span
              className={`inline-flex w-8 h-8 items-center justify-center bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy border border-green-slimy cursor-pointer rounded-full normal-case transition-colors duration-500`}
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft />
            </span>
          </div>

          <div></div>
          <div className="card-body">
            {!isLoading ? (
              <>
                <div>
                  <div className="group absolute -top-5 inset-x-1/2 -translate-x-1/2 border-4 border-green-slimy rounded-full h-32 w-32 overflow-hidden">
                    <img
                      src={userData?.images?.profile_img}
                      alt=""
                      className={`w-full h-full`}
                    />
                  </div>
                </div>
                <h1 className="text-2xl text-center mt-9">
                  Manager information
                </h1>
                {/* profile image end */}

                {/* personal information  */}
                <div className=" grid md:grid-cols-2 gap-4 mt-9">
                  <div>
                    <h2 className="card-title mb-3"> Personal information </h2>
                    <h6> Name : {userData?.name}</h6>
                    <h6> Address : {userData?.address}</h6>
                    <h6> Phone Number : {userData.phone_no}</h6>
                    <h6> Emergency Contact : {userData.emergency_contact}</h6>
                    <h6> Email : {userData?.email}</h6>
                  </div>
                  <div>
                    <h2 className="card-title mb-3"> Other information </h2>
                    <h6>
                      {" "}
                      Joining Date :{" "}
                      {new Date(userData?.joining_date).toLocaleDateString()}
                    </h6>
                    <h6> Salary : {userData?.salary}</h6>
                    <h6>
                      Status :{" "}
                      {userData?.status === "Active"
                        ? "In Duty"
                        : userData?.status === "Deactive"
                        ? "Resign"
                        : "Deleted"}
                    </h6>
                  </div>
                  <div>
                    <h2 className="card-title mb-3">
                      {userData?.images?.driving_lic_img?.length
                        ? "Driving Licenses"
                        : userData?.images?.nid?.length
                        ? "NID"
                        : "Passport"}
                    </h2>
                    <ul className={`list-disc list-inside`}>
                      {(userData?.images?.driving_lic_img?.length
                        ? [...userData?.images?.driving_lic_img]
                        : userData?.images?.nid?.length
                        ? [...userData?.images?.nid]
                        : [...userData?.images?.passport]
                      )?.map((img, idx) => (
                        <li>
                          <div className={`inline-flex gap-1.5`}>
                            <span className={`-mt-0.5`}>
                              Attachment {++idx}
                            </span>
                            <span
                              onClick={() =>
                                saveAs(
                                  img,
                                  new Date().toLocaleDateString() + ".jpg",
                                )
                              }
                              className={`hover:text-green-slimy transition-colors duration-500 cursor-pointer`}
                            >
                              <FaDownload />
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <h1 className="text-center text-2xl mb-4">Assigned Hotel</h1>
                <div className="overflow-x-auto">
                  <table className="table border">
                    <thead>
                      <tr>
                        <th>Sl</th>
                        <th>Name</th>
                        <th>Branch</th>
                        <th>Email</th>
                        <th>Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hotels?.map((elem, idx) => {
                        return (
                          <tr
                            className={
                              idx % 2 === 0 ? "bg-gray-100 hover" : "hover"
                            }
                          >
                            <th> {++idx}</th>
                            <td>{elem?.name}</td>
                            <td>{elem?.branch_name}</td>
                            <td>{elem?.email}</td>
                            <td>{elem?.phone_no}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
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
      </div>
    </>
  );
};

export default ManagerListView;

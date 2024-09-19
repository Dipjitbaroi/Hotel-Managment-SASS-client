import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaDownload, FaEdit } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { saveAs } from "file-saver";
import { useGetUserQuery } from "../../redux/admin/subadmin/subadminAPI.js";
import { Rings } from "react-loader-spinner";
import { getOnlyFormatDate, handleImageUrl } from "../../utils/utils.js";

const EmployeeView = () => {
  const { id } = useParams();

  const { data: userData, error, isLoading } = useGetUserQuery(id);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      const filteredImages = Object.values(userData?.images)
        .flat()
        .filter((value) => value !== "");
    }
  }, []);

  const downloadFile = async (url) => {
    const response = await fetch(handleImageUrl(url), { mode: "cors" });
    const blob = await response.blob();
    saveAs(blob, `${new Date().toLocaleDateString()}.jpg`);
  };

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
                      src={handleImageUrl(userData?.images?.profile_img)}
                      alt=""
                      className={`w-full h-full`}
                    />
                  </div>
                </div>
                <h1 className="text-2xl text-center mt-9">
                  Employee information
                </h1>
                {/* profile image end */}

                {/* personal information  */}
                <div>
                  <div className="grid lg:grid-cols-2 gap-4 mt-9">
                    <table className="w-54">
                      <tbody>
                        <tr>
                          <th className="text-start w-24">Name</th>
                          <td className="text-center">:</td>
                          <td className="break-all">{userData?.name}</td>
                        </tr>
                        <tr>
                          <th className="text-start w-24">Address</th>
                          <td className="w-4 text-center">:</td>
                          <td className="break-all">{userData?.address}</td>
                        </tr>
                        <tr>
                          <th className="text-start w-24">Phone Number</th>
                          <td className="w-4 text-center">:</td>
                          <td className="break-all">{userData?.phone_no}</td>
                        </tr>
                        <tr>
                          <th className="text-start w-24">Emergency Contact</th>
                          <td className="w-4 text-center">:</td>
                          <td className="break-all">{userData?.phone_no}</td>
                        </tr>
                        <tr>
                          <th className="text-start w-24">Email</th>
                          <td className="w-4 text-center">:</td>
                          <td className="break-all">{userData?.email}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div>
                      <h2 className="card-title mb-3"> Other information </h2>
                      <table>
                        <tbody>
                          <tr>
                            <th className="text-start">Joining Date</th>
                            <td className="w-4 text-center">:</td>
                            <td className="break-all">
                              {getOnlyFormatDate(userData?.joining_date)}
                              {/* {new Date(
                                userData?.joining_date
                              ).toLocaleDateString()} */}
                            </td>
                          </tr>
                          <tr>
                            <th className="text-start">Salary</th>
                            <td className="w-4 text-center">:</td>
                            <td className="break-all">{userData?.salary}</td>
                          </tr>
                          <tr>
                            <th className="text-start">Status</th>
                            <td className="w-4 text-center">:</td>
                            <td className="break-all">
                              {userData?.status === "Active"
                                ? "In Duty"
                                : userData?.status === "Deactive"
                                ? "Resign"
                                : "Deleted"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="">
                      <h2 className="card-title mb-3 break-all">
                        {userData?.images?.driving_lic_img[0]?.length
                          ? "Driving Licenses"
                          : userData?.images?.nid[0]?.length
                          ? "Aadhar Card"
                          : "Passport"}
                      </h2>
                      <ul className={`list-disc list-inside break-all`}>
                        {(userData?.images?.driving_lic_img[0]?.length
                          ? userData?.images?.driving_lic_img
                          : userData?.images?.nid[0]?.length
                          ? userData?.images?.nid
                          : userData?.images?.passport
                        )?.map((img, idx) => {
                          return (
                            <li key={idx}>
                              <div className={`inline-flex gap-1.5`}>
                                <span className={`-mt-0.5`}>
                                  Attachment {idx + 1}
                                </span>
                                <span
                                  onClick={() => downloadFile(img)}
                                  className={`hover:text-green-slimy transition-colors duration-500 cursor-pointer`}
                                >
                                  <FaDownload />
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
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

export default EmployeeView;

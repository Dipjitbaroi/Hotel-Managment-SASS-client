import React, { useEffect, useState } from "react";
import {
  AiOutlineFullscreen,
  AiOutlineFullscreenExit,
  AiOutlineMenu,
} from "react-icons/ai";
import profile from "../../src/assets/profile.jpeg";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../redux/auth/authSlice.js";
import { GrLicense } from "react-icons/gr";
import { useGetLicenseDateQuery } from "../redux/Owner/hotelsAPI.js";
import { getLatestDate, handleImageUrl } from "../utils/utils.js";
import moment from "moment-timezone";
const Header = ({
  isFullscreen,
  enterFullscreen,
  exitFullscreen,
  isHbMenu,
  setHbMenu,
}) => {
  const { user } = useSelector((store) => store.authSlice);
  const dispatch = useDispatch();
  const [time, setTime] = useState(moment().tz("Asia/Kolkata"));
  const { data: dateData, date: isLoading } = useGetLicenseDateQuery();

  useEffect(() => {
    const clearTime = setInterval(
      () => setTime(moment().tz("Asia/Kolkata")),
      1000
    );

    return () => clearInterval(clearTime);
  }, []);

  const latestToDate = getLatestDate(user?.extended_time);
  const latestManagerToDate = getLatestDate(dateData?.extended_time);

  return (
    <div>
      <div className="navbar bg-white justify-between">
        <div>
          <div>
            <div className="dropdown">
              <label
                tabIndex={0}
                className="md:hidden btn btn-ghost btn-circle"
                onClick={() => setHbMenu(!isHbMenu)}
              >
                <AiOutlineMenu></AiOutlineMenu>
              </label>
            </div>
          </div>
          {Math.floor(
            Math.abs(
              new Date(
                latestToDate !== null ? latestToDate?.to : user?.bill_to
              ) - new Date()
            ) /
              (24 * 60 * 60 * 1000)
          ) <= 30 && user?.role === "owner" ? (
            <h3
              className={`flex gap-1.5 text-xl font-bold animate-pulse text-yellow-500 ml-6`}
            >
              <span>
                <GrLicense />
              </span>
              <span className={`-mt-0.5  `}>
                Your license will expire in{" "}
                <span className="m-2">
                  {Math.floor(
                    Math.abs(
                      new Date(
                        latestToDate !== null ? latestToDate?.to : user?.bill_to
                      ) - new Date()
                    ) /
                      (24 * 60 * 60 * 1000)
                  )}{" "}
                </span>
                days
              </span>
            </h3>
          ) : null}

          {Math.floor(
            Math.abs(
              new Date(
                latestManagerToDate !== null
                  ? latestManagerToDate?.to
                  : dateData?.endsIn
              ) - new Date()
            ) /
              (24 * 60 * 60 * 1000)
          ) <= 30 && user?.role === "manager" ? (
            <h3
              className={`flex gap-1.5 text-xl font-bold animate-pulse text-yellow-500 ml-6`}
            >
              <span>
                <GrLicense />
              </span>
              <span className={`-mt-0.5 `}>
                Your license will expire in
                {/* {extendedTime(user?.bill_to)} */}
                <span className="m-2">
                  {Math.floor(
                    Math.abs(
                      new Date(
                        latestManagerToDate !== null
                          ? latestManagerToDate?.to
                          : dateData?.endsIn
                      ) - new Date()
                    ) /
                      (24 * 60 * 60 * 1000)
                  )}{" "}
                </span>
                days
              </span>
            </h3>
          ) : null}
        </div>
        <div>
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle text-2xl mr-3"
            onClick={isFullscreen ? exitFullscreen : enterFullscreen}
          >
            {isFullscreen ? (
              <AiOutlineFullscreenExit />
            ) : (
              <AiOutlineFullscreen />
            )}
          </label>

          {/* time setUp */}
          <div className=" justify-center border me-3 p-3 w-52  hidden md:inline-flex">
            <span className="text-2xl">{time.format("hh:mm:ss A")}</span>
          </div>
          {/* time setUp */}

          <div className="flex-none gap-2">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={
                      user?.images?.profile_img
                        ? handleImageUrl(user?.images?.profile_img)
                        : profile
                    }
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                {user?.role === "manager" ? (
                  <></>
                ) : (
                  <li>
                    <Link to="profile">Profile</Link>
                  </li>
                )}
                <li onClick={() => dispatch(signOut())}>
                  <Link to={`/`}>Logout</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MdBarChart,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp, MdManageAccounts,
  MdOutlineKitchen,
  MdOutlineLockClock,
  MdOutlineMeetingRoom,
} from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";

const AdminSBItems = ({ handleSBItems,isHbMenu,setHbMenu }) => {
  const { isUserLoading, user } = useSelector((store) => store.authSlice);
  const [subAdmin, setSubAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === "subadmin") {
        setSubAdmin(true);
      } else {
        setSubAdmin(false);
      }
    }
  }, [user]);

  return (
    <>
      <li>
        <NavLink
          to={`/dashboard/adminowner-list`}
          className={({ isActive }) =>
            "flex p-2 hover:text-green-slimy rounded-lg transition-colors duration-500" +
            (isActive ? " bg-gray-300" : "")
          }
          end
        >
          <span className={`w-5`}>
            <FaPeopleGroup />
          </span>
          <span 
           onClick={() => setHbMenu(!isHbMenu)}
          className={`-mt-0.5`}>Owner List</span>
        </NavLink>
      </li>
      <li className={`group p-2`}>
        <div
          className={`flex justify-between hover:text-green-slimy cursor-pointer transition-colors duration-500`}
          onClick={(e) => handleSBItems(e)}
        >
          <div className={`flex space-x-1.5`}>
            <span className={`w-5`}>
              <MdOutlineMeetingRoom />
            </span>
            <span className={`-mt-0.5`}>Software License and Sale </span>
          </div>
          <span className={`group-[.active]:hidden`}>
            <MdKeyboardArrowDown />
          </span>
          <span className={`hidden group-[.active]:inline`}>
            <MdKeyboardArrowUp />
          </span>
        </div>
        <ul className={`group-[.active]:block hidden`}>
          <li>
            <NavLink
              to={`/dashboard/new-license`}
              onClick={() => setHbMenu(!isHbMenu)}
              className={({ isActive }) =>
                "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                (isActive ? " bg-gray-300" : "")
              }
            >
              New License 
            </NavLink>
          </li>
          {!subAdmin || (
            <>
              <li>
                <NavLink
                  to={`/dashboard/suspend-list`}
                  onClick={() => setHbMenu(!isHbMenu)}
                  className={({ isActive }) =>
                    "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                    (isActive ? " bg-gray-300" : "")
                  }
                >
                  Suspend List
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/dashboard/expired-list`}
                  onClick={() => setHbMenu(!isHbMenu)}
                  className={({ isActive }) =>
                    "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                    (isActive ? " bg-gray-300" : "")
                  }
                >
                  Expired List
                </NavLink>
              </li>
            </>
          )}
          {subAdmin || (
            <>
              <li>
                <NavLink
                  to={`/dashboard/suspend-list`}
                  onClick={() => setHbMenu(!isHbMenu)}
                  className={({ isActive }) =>
                    "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                    (isActive ? " bg-gray-300" : "")
                  }
                >
                  Suspend List
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/dashboard/expired-list`}
                  onClick={() => setHbMenu(!isHbMenu)}
                  className={({ isActive }) =>
                    "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                    (isActive ? " bg-gray-300" : "")
                  }
                >
                  Expired List
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </li>
      {/*<li>*/}
      {/*  <NavLink*/}
      {/*      to={`/dashboard/suspend-lock-list`}*/}
      {/*      className={({ isActive }) =>*/}
      {/*          "flex p-2 hover:text-green-slimy rounded-lg transition-colors duration-500" +*/}
      {/*          (isActive ? " bg-gray-300" : "")*/}
      {/*      }*/}
      {/*      end*/}
      {/*  >*/}
      {/*    <span className={`w-5`}>*/}
      {/*      <MdOutlineLockClock />*/}
      {/*    </span>*/}
      {/*    <span className={`-mt-0.5`}>Suspend & Lock List</span>*/}
      {/*  </NavLink>*/}
      {/*</li>*/}
      {!subAdmin && (
        <li className={`group p-2`}>
          <div
            className={`flex justify-between hover:text-green-slimy cursor-pointer transition-colors duration-500`}
            onClick={(e) => handleSBItems(e)}
          >
            <div className={`flex space-x-1.5`}>
              <span className={`w-5`}>
                <MdManageAccounts />
              </span>
              <span className={`-mt-0.5`}>Sub Admin Management</span>
            </div>
            <span className={`group-[.active]:hidden`}>
              <MdKeyboardArrowDown />
            </span>
            <span className={`hidden group-[.active]:inline`}>
              <MdKeyboardArrowUp />
            </span>
          </div>
          <ul className={`group-[.active]:block hidden`}>
            <li>
              <NavLink
                to={`/dashboard/add-sub-admin`}
                onClick={() => setHbMenu(!isHbMenu)}
                className={({ isActive }) =>
                  "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                  (isActive ? " bg-gray-300" : "")
                }
              >
                Add Sub Admin
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/dashboard/sub-admin-list`}
                onClick={() => setHbMenu(!isHbMenu)}
                className={({ isActive }) =>
                  "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                  (isActive ? " bg-gray-300" : "")
                }
              >
                Sub Admin List
              </NavLink>
            </li>
          </ul>
        </li>
      )}
      <li>
        <NavLink
          to={`/dashboard/admin-report`}
          className={({ isActive }) =>
            "flex p-2 hover:text-green-slimy rounded-lg transition-colors duration-500" +
            (isActive ? " bg-gray-300" : "")
          }
          end
        >
          <span className={`w-5`}>
            <MdBarChart />
          </span>
          <span 
           onClick={() => setHbMenu(!isHbMenu)}
          className={`-mt-0.5`}>Report</span>
        </NavLink>
      </li>
    </>
  );
};

export default AdminSBItems;

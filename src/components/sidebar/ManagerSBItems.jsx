import React, { useState } from "react";
import { NavLink, useOutletContext } from "react-router-dom";
import {
  MdBarChart,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdOutlineFoodBank,
  MdOutlineInventory2,
  MdOutlineKitchen,
  MdOutlineMeetingRoom,
  MdPool,
  MdOutlineSportsGymnastics,
} from "react-icons/md";
import { FaGlassMartini, FaUsers } from "react-icons/fa";
import { SiMomenteo } from "react-icons/si";
import { TbToolsKitchen2 } from "react-icons/tb";
import { RiFileList3Fill } from "react-icons/ri";

const ManagerSbItems = ({ handleSBItems, isHbMenu, setHbMenu }) => {
  return (
    <>
      <li className={`group p-2`}>
        <div
          className={`flex justify-between hover:text-green-slimy cursor-pointer transition-colors duration-500`}
          onClick={(e) => handleSBItems(e)}
        >
          <div className={`flex space-x-1.5`}>
            <MdOutlineMeetingRoom />
            <span className={`-mt-0.5`}>Room</span>
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
              to={`/dashboard/add-room`}
              onClick={() => setHbMenu(!isHbMenu)}
              className={({ isActive }) =>
                "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                (isActive ? " bg-gray-300" : "")
              }
            >
              Add Room
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/dashboard/manage-room`}
              onClick={() => setHbMenu(!isHbMenu)}
              className={({ isActive }) =>
                "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                (isActive ? " bg-gray-300" : "")
              }
            >
              Manage Room
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/dashboard/manage-booking`}
              onClick={() => setHbMenu(!isHbMenu)}
              className={({ isActive }) =>
                "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                (isActive ? " bg-gray-300" : "")
              }
            >
              Manage Booking
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/dashboard/manage-checkin`}
              onClick={() => setHbMenu(!isHbMenu)}
              className={({ isActive }) =>
                "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                (isActive ? " bg-gray-300" : "")
              }
            >
              Manage CheckIn
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/dashboard/checkin`}
              onClick={() => setHbMenu(!isHbMenu)}
              className={({ isActive }) =>
                "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                (isActive ? " bg-gray-300" : "")
              }
            >
              Check In
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/dashboard/checkout`}
              onClick={() => setHbMenu(!isHbMenu)}
              className={({ isActive }) =>
                "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                (isActive ? " bg-gray-300" : "")
              }
            >
              Check Out
            </NavLink>
          </li>
        </ul>
      </li>
      <li className={`group p-2`}>
        <div
          className={`flex justify-between hover:text-green-slimy cursor-pointer transition-colors duration-500`}
          onClick={(e) => handleSBItems(e)}
        >
          <div className={`flex space-x-1.5`}>
            <TbToolsKitchen2 />
            <span className={`-mt-0.5`}>Restaurant</span>
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
              to={`/dashboard/restaurant-dashboard`}
              onClick={() => setHbMenu(!isHbMenu)}
              className={({ isActive }) =>
                "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                (isActive ? " bg-gray-300" : "")
              }
            >
              Restaurant Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/dashboard/add-table`}
              onClick={() => setHbMenu(!isHbMenu)}
              className={({ isActive }) =>
                "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                (isActive ? " bg-gray-300" : "")
              }
            >
              Add Table
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/dashboard/add-food`}
              onClick={() => setHbMenu(!isHbMenu)}
              className={({ isActive }) =>
                "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                (isActive ? " bg-gray-300" : "")
              }
            >
              Add Food / Beverage
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/dashboard/add-order`}
              onClick={() => setHbMenu(!isHbMenu)}
              className={({ isActive }) =>
                "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                (isActive ? " bg-gray-300" : "")
              }
            >
              Add Order
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/dashboard/current-order-list`}
              onClick={() => setHbMenu(!isHbMenu)}
              className={({ isActive }) =>
                "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                (isActive ? " bg-gray-300" : "")
              }
            >
              Current Order List
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/dashboard/order-list`}
              onClick={() => setHbMenu(!isHbMenu)}
              className={({ isActive }) =>
                "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                (isActive ? " bg-gray-300" : "")
              }
            >
              Order List
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/dashboard/add-expense`}
              onClick={() => setHbMenu(!isHbMenu)}
              className={({ isActive }) =>
                "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                (isActive ? " bg-gray-300" : "")
              }
            >
              Add Expense
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/dashboard/show-all-sell`}
              onClick={() => setHbMenu(!isHbMenu)}
              className={({ isActive }) =>
                "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                (isActive ? " bg-gray-300" : "")
              }
            >
              Restaurant Sales
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/dashboard/show-all-expense`}
              onClick={() => setHbMenu(!isHbMenu)}
              className={({ isActive }) =>
                "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                (isActive ? " bg-gray-300" : "")
              }
            >
              Restaurant Expenses
            </NavLink>
          </li>
        </ul>
      </li>
      <li className={`group p-2`}>
        <div
          onClick={(e) => handleSBItems(e)}
          className={`flex justify-between hover:text-green-slimy cursor-pointer transition-colors duration-500`}
        >
          <div className={`flex space-x-1.5`}>
            <MdOutlineInventory2 />
            <span className={`-mt-0.5`}>Inventory / Hotel Expense</span>
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
              to={`/dashboard/hotel-dashboard`}
              onClick={() => setHbMenu(!isHbMenu)}
              className={({ isActive }) =>
                "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                (isActive ? " bg-gray-300" : "")
              }
            >
              Hotel Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/dashboard/add-inventory`}
              onClick={() => setHbMenu(!isHbMenu)}
              className={({ isActive }) =>
                "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                (isActive ? " bg-gray-300" : "")
              }
            >
              Add Item
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/dashboard/all-inventory`}
              onClick={() => setHbMenu(!isHbMenu)}
              className={({ isActive }) =>
                "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                (isActive ? " bg-gray-300" : "")
              }
            >
              Manage Items
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/dashboard/add-hotel-expense`}
              onClick={() => setHbMenu(!isHbMenu)}
              className={({ isActive }) =>
                "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                (isActive ? " bg-gray-300" : "")
              }
            >
              Add Hotel Expense
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/dashboard/all-hotel-expenses`}
              onClick={() => setHbMenu(!isHbMenu)}
              className={({ isActive }) =>
                "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                (isActive ? " bg-gray-300" : "")
              }
            >
              Hotel Expenses
            </NavLink>
          </li>
        </ul>
      </li>
      <li className={`group p-2`}>
        <div
          className={`flex justify-between hover:text-green-slimy cursor-pointer transition-colors duration-500`}
          onClick={(e) => handleSBItems(e)}
        >
          <div className={`flex space-x-1.5`}>
            <FaUsers />
            <span className={`-mt-0.5`}>Employee</span>
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
              to={`/dashboard/add-employee`}
              onClick={() => setHbMenu(!isHbMenu)}
              className={({ isActive }) =>
                "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                (isActive ? " bg-gray-300" : "")
              }
            >
              Add Employee
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/dashboard/manage-employee`}
              onClick={() => setHbMenu(!isHbMenu)}
              className={({ isActive }) =>
                "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500 pl-5" +
                (isActive ? " bg-gray-300" : "")
              }
            >
              Manage Employee
            </NavLink>
          </li>
        </ul>
      </li>

      {/* Gym Reservation */}
      <li>
        <NavLink
          to={`/dashboard/gym-booking`}
          className={({ isActive }) =>
            "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500" +
            (isActive ? " bg-gray-300" : "")
          }
        >
          <div
            className={`flex space-x-1.5`}
            onClick={() => setHbMenu(!isHbMenu)}
          >
            <MdOutlineSportsGymnastics />
            <span>Gym Reservation</span>
          </div>
        </NavLink>
      </li>

      {/* Pool Reservation */}
      <li>
        <NavLink
          to={`/dashboard/pool-reservation`}
          className={({ isActive }) =>
            "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500" +
            (isActive ? " bg-gray-300" : "")
          }
        >
          <div
            onClick={() => setHbMenu(!isHbMenu)}
            className={`flex space-x-1.5`}
          >
            <MdPool />
            <span>Pool Reservation</span>
          </div>
        </NavLink>
      </li>

      {/* Report */}
      <li>
        <NavLink
          to={`/dashboard/report`}
          className={({ isActive }) =>
            "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500" +
            (isActive ? " bg-gray-300" : "")
          }
        >
          <div
            onClick={() => setHbMenu(!isHbMenu)}
            className={`flex space-x-1.5`}
          >
            <MdBarChart />
            <span>Hotel Report</span>
          </div>
        </NavLink>
      </li>

      <li>
        <NavLink
          to={`/dashboard/payment-sources`}
          className={({ isActive }) =>
            "block p-2 hover:text-green-slimy rounded-lg transition-colors duration-500" +
            (isActive ? " bg-gray-300" : "")
          }
        >
          <div
            onClick={() => setHbMenu(!isHbMenu)}
            className={`flex space-x-1.5`}
          >
            <RiFileList3Fill />
            <span>Payment Sources</span>
          </div>
        </NavLink>
      </li>
    </>
  );
};

export default ManagerSbItems;

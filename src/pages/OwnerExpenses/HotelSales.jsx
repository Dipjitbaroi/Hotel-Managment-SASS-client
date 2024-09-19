import React, { useState } from "react";
import Select from "react-select";
import { useRoomsQuery } from "../../redux/room/roomAPI.js";
import UserDashBoard from "../../components/UserDashBoard/UserDashBoard";
import { useSelector } from "react-redux";
import { useHotelsQuery } from "../../redux/Owner/hotelsAPI.js";
import { Rings } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import RestaurantExpenseShow from "../../components/OwnerExpenses/RestaurantExpenseShow.jsx";
import HotelExpensesShow from "../../components/OwnerExpenses/HotelExpensesShow.jsx";
import HotelSalesShow from "../../components/OwnerExpenses/HotelSalesShow.jsx";
import { customFilterOption } from "../../utils/utils.js";

const HotelSales = () => {
  const { user } = useSelector((store) => store.authSlice);
  const {
    isLoading,
    data: hotels,
    isError,
  } = useHotelsQuery({
    uid: user._id,
    pid: "",
    filter: "Active",
    limit: 1000,
    cp: 0,
  });
  const [selectedHotel, setselectedHotel] = useState(null);

  const handleKeyDown = (e) => {
    if (e.keyCode === 32) {
      e.preventDefault();
    }
  };

  const transformedHotel = hotels?.docs?.map((hotel) => ({
    value: hotel?.manager_acc?._id,
    hotelId: hotel?._id,
    label: `${hotel.name} - ${hotel.branch_name}`,
    hotelName: hotel.name,
    branchName: hotel.branch_name,
    managerId:hotel?.manager_acc?._id
    
  }));
  const handleReset = () => {
    setselectedHotel(null);
  };

  if (isLoading || isError) {
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
    <>
      {/* back button */}
    
      <div className="space-y-20 min-h-screen bg-white p-3 rounded-xl">
      <div className={`mb-5`}>
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
        <div className="mt-7">
          <h1 className="bg-green-slimy text-2xl text-center text-white max-w-[18rem]  mx-auto py-3 px-5 rounded space-x-1.5 mb-7">
            Hotel Sales{" "}
          </h1>
        </div>
      </div>
        {/* Select Room Section */}
        <section className="max-w-full mx-auto flex flex-col md:flex-row gap-5 items-center justify-center">
          <p>Hotel Branch Name :</p>
          <div className="flex flex-col md:flex-row gap-3">
            <Select
              placeholder="Search with hotel branch name"
              defaultValue={selectedHotel}
              value={selectedHotel}
              options={transformedHotel}
              filterOption={customFilterOption}
              isMulti={false}
              isSearchable
              onKeyDown={handleKeyDown}
              onChange={(selectedOption) => setselectedHotel(selectedOption)}
              classNames={{
                control: (state) =>
                  `!input !input-md !min-h-[3rem] !h-auto !input-bordered !bg-transparent !rounded !w-full !border-gray-500/50 focus-within:!outline-none ${
                    state.isFocused ? "!shadow-none" : ""
                  }`,
                valueContainer: () => "!p-0",
                placeholder: () => "!m-0",
              }}
            />
            <button
              onClick={handleReset}
              className={`${
                selectedHotel
                  ? "bg-green-slimy px-3 border text-white"
                  : "bg-gray-300 px-3 border"
              }`}
            >
              Reset
            </button>
          </div>
        </section>

        <section>
          {selectedHotel ? (
            <HotelSalesShow
              managerId={selectedHotel?.managerId}
              hotelId={selectedHotel?.hotelId}
              hotelName={selectedHotel.hotelName}
              branchName={selectedHotel.branchName}
            ></HotelSalesShow>
          ) : (
            <p className="text-center">Please Select your Hotel Branch !!</p>
          )}
        </section>
      </div>
    </>
  );
};

export default HotelSales;

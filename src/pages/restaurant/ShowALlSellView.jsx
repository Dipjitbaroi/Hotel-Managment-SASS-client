import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaRegEdit,
  FaRegFilePdf,
  FaRupeeSign,
} from "react-icons/fa";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useFormik } from "formik";
import EditSalesView from "./EditSalesView";
import ReactPaginate from "react-paginate";
import {
  useGetHotelByManagerIdQuery,
  useGetOrdersByDateQuery,
} from "../../redux/room/roomAPI";
import { useSelector } from "react-redux";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import RestaurantSalesHistory from "../report/RestaurantSalesHistory";
import {
  getConvertedIsoStartDate,
  getOnlyFormatDate,
  isValidUrl,
} from "../../utils/utils";
import { convertedStartDate } from "../../utils/timeZone";

const ShowALlSellView = () => {
  const [searchParams] = useSearchParams();
  const [PDF, setPdf] = useState([]);
  const dateParam = searchParams.get("date");
  const hotelId = searchParams.get("hotelId");
  const managerID = searchParams.get("managerID");


  const { user } = useSelector((store) => store.authSlice);
  // query by searchParams
  const {
    data: orderedDataByDate,
    error: orderError,
    isLoading: orderItemSuccess,
  } = useGetOrdersByDateQuery({
    date: convertedStartDate(dateParam),
    order_status: "CheckedOut",
    hotel_id: hotelId ? hotelId : user?.assignedHotel[0],
  });

  const formik = useFormik({
    initialValues: {
      startDate: "",
      endDate: "",
    },
  });
  const navigate = useNavigate();

  const [todayItem, setTodayItem] = useState([]);
  useEffect(() => {
    const todayItems = orderedDataByDate?.data?.reduce((accumulator, items) => {
      // Concatenate the items array of each bill to the accumulator array
      return accumulator.concat(
        items.items.map((item) => ({
          ...item,
          ...(items.room_id
            ? { roomNumber: items.room_id.roomNumber }
            : items.table_id
            ? { tableNumber: items.table_id.table_number }
            : {}), // Add createdAt property to each item
        }))
      );
    }, []);

    setTodayItem(todayItems);
  }, [orderedDataByDate]);
  // pagination setup for today's expenses
  const itemsPerPage = 10;
  const [currentPageItem, setCurrentPageItem] = useState(0);

  const handlePageChange = ({ selected }) => {
    setCurrentPageItem(selected);
  };
  const totalPage =
    orderedDataByDate && Math.ceil(todayItem?.length / itemsPerPage);

  const indexOfLastItem = (currentPageItem + 1) * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = todayItem?.slice(indexOfFirstItem, indexOfLastItem);

  const handleScrollToTop = () => {
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const totalPrice = todayItem?.reduce(
    (total, item) => total + item.price * item?.quantity,
    0
  );

  useEffect(() => {
    setPdf(currentItems);
  }, [todayItem]);

  const { data: hotelInfo } = useGetHotelByManagerIdQuery(
    user.role === "manager" ? user?._id : user.role === "owner" ? managerID : ""
  );


  return (
    <div className={`bg-white p-10 rounded-2xl space-y-8`}>
      <div className={`flex justify-between`}>
        <div
          className={`inline-flex bg-green-slimy text-white border border-green-slimy items-center space-x-1.5 hover:bg-transparent hover:text-green-slimy cursor-pointer px-3 py-1 rounded transition-colors duration-500 `}
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
          <span>Back</span>
        </div>

        <div className={`flex justify-end`}>
          {PDF?.length ? (
            <PDFDownloadLink
              document={
                <RestaurantSalesHistory
                  date={dateParam}
                  values={currentItems}
                  header={{
                    title: `${hotelInfo? hotelInfo[0].name: ""}`,
                    subTitle: `${hotelInfo? hotelInfo[0]?.branch_name :""}`,

                    name: "All Order Information",
                  }}
                />
              }
              fileName={`${new Date().toLocaleDateString()}.pdf`}
              className="btn btn-sm min-w-[5rem] bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case"
              onError={(error) => console.error("PDF Error", error)}
            >
              <BsFileEarmarkPdfFill />
              PDF
            </PDFDownloadLink>
          ) : null}
        </div>
      </div>
      <div>
        <h1 className="text-center text-2xl bg-green-slimy w-[17rem] mx-auto text-white p-1 rounded-md">
          {" "}
          All Order Information
        </h1>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Date</th>
              <th>Items Name</th>
              <th>
                Room / Table <br /> Number
              </th>
              <th>Surveyor Quantity</th>
              <th>Quantity</th>
              <th>Price</th>

              {/* <th>Remark</th>
                  <th>Action</th> */}
            </tr>
          </thead>
          <tbody>
            {currentItems &&
              currentItems?.map((item, idx) => {
                return (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-gray-100 hover" : "hover"}
                  >
                    <th>{++idx}</th>
                    <td>
                      {getOnlyFormatDate(dateParam)}
                      {/* {new Date(dateParam).toLocaleDateString()} */}
                    </td>
                    <td>{item?.item}</td>
                    <td>
                      {item?.roomNumber
                        ? `Room : ${item.roomNumber}`
                        : ` Table : ${item?.tableNumber}`}
                    </td>
                    <td>{item?.serveyor_quantity}</td>
                    <td>{item?.quantity}</td>
                    <td>{item?.price * item?.quantity}</td>

                    {/* <td>Remark</td> */}
                    {/* <td>
                        <button
                          className={`btn btn-sm bg-transparent hover:bg-green-slimy text-green-slimy hover:text-white !border-green-slimy rounded normal-case md:mb-2 mb-2 ms-2`}
                          onClick={() =>
                            document.getElementById("my_modal_3").showModal()
                          }
                        >
                          <FaRegEdit />
                        </button>
                        <dialog id="my_modal_3" className="modal">
                          <div className="modal-box">
                            <form method="dialog">
                              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                ✕
                              </button>
                            </form>
                           
                            <EditSalesView/>
                          </div>
                        </dialog>
                      </td> */}
                  </tr>
                );
              })}
          </tbody>
          <tfoot className={`text-[1.2rem] font-bold`}>
            <tr>
              <td colSpan={5} className={`text-end text-md font-bold`}>
                Total :
              </td>
              <td>
                <div className="flex">
                  <div>
                    <FaRupeeSign />
                  </div>
                  <div>{totalPrice}</div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="flex justify-center mt-10">
        <ReactPaginate
          containerClassName="join rounded-none"
          pageLinkClassName="join-item btn btn-md bg-transparent"
          activeLinkClassName="btn-active !bg-green-slimy text-white"
          disabledLinkClassName="btn-disabled"
          previousLinkClassName="join-item btn btn-md bg-transparent"
          nextLinkClassName="join-item btn btn-md bg-transparent"
          breakLinkClassName="join-item btn btn-md bg-transparent"
          previousLabel="<"
          nextLabel=">"
          breakLabel="..."
          pageCount={totalPage}
          pageRangeDisplayed={2}
          marginPagesDisplayed={2}
          onPageChange={handlePageChange}
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  );
};

export default ShowALlSellView;

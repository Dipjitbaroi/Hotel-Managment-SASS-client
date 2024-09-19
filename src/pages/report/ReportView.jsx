import React from "react";
import logo from "../../assets/amazon.png";
import CreateCustomerReceipt from "../../components/pdf/CreateCustomerReceipt.jsx";
import { FaArrowLeft, FaFileInvoice } from "react-icons/fa";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useNavigate } from "react-router-dom";

const ReportView = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-8">
      <div className="relative min-h-[50rem]">
        <div className={`flex justify-between`}>
          <span
            className={`btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case`}
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
          </span>
          <PDFDownloadLink
            document={<CreateCustomerReceipt />}
            fileName={`1.pdf`}
          >
            <span
              className={`btn btn-sm bg-green-slimy hover:bg-transparent text-white hover:text-green-slimy !border-green-slimy rounded normal-case`}
            >
              <FaFileInvoice />
            </span>
          </PDFDownloadLink>
        </div>
        <div className="w-44 mx-auto">
          <img src={logo} alt="Logo" className="w-full h-auto" />
        </div>
        <div className="text-center mt-5">
          <h1 className="text-xl font-bold">Customer Receipt</h1>
          <p>Date: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="mt-8">
          <div>
            <h2 className="text-xl mt-6 mb-4">Customer Information</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="w-1/6">Name</span>
              <span className="w-1/25 mr-2">:</span>
              <span>Hamid Chowdhury</span>
            </div>
            <div className="flex items-center">
              <span className="w-1/6">Email</span>
              <span className="w-1/25 mr-2">:</span>
              <span>hamid@gmail.com</span>
            </div>
            <div className="flex items-center">
              <span className="w-1/6">Phone</span>
              <span className="w-1/25 mr-2">:</span>
              <span>+880 1715738573</span>
            </div>
            <div className="flex items-center">
              <span className="w-1/6">Address</span>
              <span className="w-1/25 mr-2">:</span>
              <span>Dhaka</span>
            </div>
            <div className="flex items-center">
              <span className="w-1/6">Booking No</span>
              <span className="w-1/25 mr-2">:</span>
              <span>101</span>
            </div>
            <div className="flex items-center">
              <span className="w-1/6">Check In</span>
              <span className="w-1/25 mr-2">:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <span className="w-1/6">Check Out</span>
              <span className="w-1/25 mr-2">:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div>
            <h2 className="text-xl mt-6 mb-4">Room Information</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="w-1/6">No</span>
              <span className="w-1/25 mr-2">:</span>
              <span>101</span>
            </div>
            <div className="flex items-center">
              <span className="w-1/6">Adult</span>
              <span className="w-1/25 mr-2">:</span>
              <span>2</span>
            </div>
            <div className="flex items-center">
              <span className="w-1/6">Children</span>
              <span className="w-1/25 mr-2">:</span>
              <span>0</span>
            </div>
            <div className="flex items-center">
              <span className="w-1/6">Total cost</span>
              <span className="w-1/25 mr-2">:</span>
              <span>2000</span>
            </div>
          </div>
        </div>

        <div className="absolute left-0 bottom-0 w-full flex justify-between mt-8">
          <div>
            <p>___________________</p>
            <p className="mx-auto w-fit">Office Signature</p>
          </div>
          <div>
            <p>___________________</p>
            <p className="mx-auto w-fit">Customer Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportView;

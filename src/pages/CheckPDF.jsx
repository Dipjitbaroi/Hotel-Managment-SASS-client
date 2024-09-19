import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import CreateCustomerReceipt from "../components/pdf/CreateCustomerReceipt.jsx";
import CreateReport from "../components/pdf/CreateReport.jsx";

const CheckPdf = () => {
  return (
    <div className={`h-screen`}>
      <PDFViewer style={{ width: `100%`, height: `100%` }}>
        <CreateReport />
      </PDFViewer>
    </div>
  );
};

export default CheckPdf;

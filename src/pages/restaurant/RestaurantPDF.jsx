
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import React, { forwardRef } from 'react';
import ReactToPrint from "react-to-print";

const RestaurantPdf = ({success,ref}) => {
    const styles = StyleSheet.create({
        page: {
          flexDirection: "column",
          backgroundColor: "white",
          padding: 20,
        },
        table: {
          display: "table",
          width: "100%",
          borderStyle: "solid",
          borderWidth: 1,
          borderColor: "#e8e8e8",
        },
        tableRow: {
          flexDirection: "row",
          borderBottomWidth: 1,
          borderBottomColor: "#e8e8e8",
        },
        tableCell: {
          flex: 1,
          padding: 8,
        },
        tableHeader: {
          backgroundColor: "#f2f2f2",
        },
        text: {
          fontSize: 10,
        },
      });
    
    return (
        <ReactToPrint>
            <div ref={ref}>
          <h3  className={`mb-5 font-bold text-2xl`}>
            Order placed successfully.
          </h3>
          <div className="overflow-x-auto border">
            <table className="table" >
              <thead>
                <tr className={`text-lg`}>
                  <th>Name</th>
                  <th>
                    Surveyor <br /> Quantity
                  </th>
                  <th>Price</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {success?.items?.map((food, idx) => (
                  <tr>
                    <td>{food?.item}</td>
                    <td>{food?.serveyor_quantity}</td>
                    <td>{food?.price}</td>
                    <td>{food?.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
</div>
        </ReactToPrint>

 
    );
};

export default forwardRef(RestaurantPdf);
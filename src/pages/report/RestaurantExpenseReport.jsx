import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "../../assets/logo.png";
import {
  getFormateDateAndTime,
  getOnlyFormatDate,
  getformatDateTime,
  versionControl,
} from "../../utils/utils";

const RestaurantExpenseReport = ({ values, header, date }) => {
  // SL	Date	Items Name	Description	Quantity	Price	Action
  const desiredHeaders = [
    "Serial No",
    "date",
    "name",
    "description",
    "quantity",
    "price",
    "remark",
  ];
  const tableHeaders = [
    "Serial No",
    "Date",
    "Name",
    "Description",
    "Quantity",
    "Price",
    "Remark",
  ];

  const jsEncoderTextStyle = {
    color: "green",
    fontWeight: "bold",
  };

  const currentYear = new Date().getFullYear();

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
      textAlign: "center",
    },
    tableCell: {
      flex: 2,
      padding: 8,
      wordWrap: "break-word",
      textAlign: "center",
    },
    descriptionCell: {
      flex: 2, // Adjust the width as needed
      padding: 8,
      wordWrap: "break-word",
    },
    tableHeader: {
      textAlign: "center",
      backgroundColor: "#f2f2f2",
    },
    text: {
      fontSize: 10,
      text: "center",
    },
    footer: {
      position: "absolute",
      bottom: 20,
      left: 0,
      right: 0,
      textAlign: "center",
      fontSize: 10,
      color: "grey",
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <view>
          <Text
            style={{
              marginBottom: 15,
              textAlign: "right",
              fontSize: 8,
              color: "gray",
            }}
          >
            Service provided by Dak Hospitality Ltd
          </Text>
        </view>
        <View
          style={{
            marginBottom: 15,
            alignItems: "center",
          }}
        >
          <Image
            src={logo}
            style={{
              width: "54px",
              height: "54px",
              marginBottom: "10px",
            }}
          />
          <View>
          <Text
              style={{
                marginHorizontal: "auto",
                marginTop: 5,
                fontSize: 15,
              }}
            >
              Hotel Name : {header?.title}
            </Text>
            <Text
              style={{
                marginHorizontal: "auto",
                marginTop: 5,
                fontSize: 10,
              }}
            >
              Branch Name : {header?.subTitle}
            </Text>
            <Text
              style={{
                marginHorizontal: "auto",
                marginTop: 5,
                fontSize: 12,
              }}
            >
              {header?.name}
            </Text>
            <Text
              style={{
                marginHorizontal: "auto",
                marginTop: 5,
                fontSize: 10,
              }}
            >
              Printed Date: {getOnlyFormatDate()}
              {/* {new Date().toLocaleDateString()} */}
            </Text>
          </View>
        </View>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            {tableHeaders.map((header, index) => {
              const cellStyle =
                header === "description"
                  ? styles.descriptionCell
                  : styles.tableCell;

              return (
                <Text key={index} style={[cellStyle, styles.text]}>
                  {header}
                </Text>
              );
            })}
          </View>
          {values &&
            values.map((item, rowIndex) => (
              <View key={rowIndex} style={styles.tableRow}>
                {desiredHeaders.map((key, cellIndex) => {
                  const cellStyle =
                    key === "description"
                      ? styles.descriptionCell
                      : styles.tableCell;

                  return (
                    <Text key={cellIndex} style={[cellStyle, styles.text]}>
                      {key === "Serial No"
                        ? rowIndex + 1
                        : key === "date"
                        ? getOnlyFormatDate(date) // Use the date prop here
                        : item[key]}
                    </Text>
                  );
                })}
              </View>
            ))}
        </View>
        <View style={styles.footer}>
          <Text>
            Powered by <Text style={jsEncoderTextStyle}>JS Encoder</Text>.
            Copyright ©{currentYear}. All rights reserved. Version{" "}
            {versionControl}
          </Text>
        </View>
        {/* <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            {Object?.keys(values[0]).map((header, index) => (
              <Text key={index} style={[styles.tableCell, styles.text]}>
                {header}
              </Text>
            ))}
          </View>
          {values?.map((item, rowIndex) => (
            <View key={rowIndex} style={styles.tableRow}>
              {Object.values(item).map((cell, cellIndex) => (
                <Text key={cellIndex} style={[styles.tableCell, styles.text]}>
                  {cell}
                </Text>
              ))}
            </View>
          ))}
        </View> */}
      </Page>
    </Document>
  );
};

export default RestaurantExpenseReport;

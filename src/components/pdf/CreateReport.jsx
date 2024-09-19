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
import { getOnlyFormatDate, versionControl } from "../../utils/utils";

const CreateReport = ({ values, header }) => {

  const currentYear = new Date().getFullYear();

  const jsEncoderTextStyle = {
    color: "green",
    fontWeight: "bold",
  };

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
            <Text>{header?.title}</Text>
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
            </Text>
          </View>
        </View>
        <View style={styles.table}>
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
        </View>
        <View style={styles.footer}>
          <Text>
            Powered by <Text style={jsEncoderTextStyle}>JS Encoder</Text>.
            Copyright ©{currentYear}. All rights reserved. Version{" "}
            {versionControl}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default CreateReport;

import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "../../../assets/logo.png";
import RoomDetailsSection from "./RoomDetailsSection";

const InvoicePDF = ({ header, data }) => {
  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "white",
      padding: 20,
      fontSize: 10,
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
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View
            style={{
              position: "relative",
              height: "100%",
            }}
          >
            <View style={{ height: 40, marginHorizontal: "auto" }}>
              <Image
                src={logo}
                style={{ width: "auto", height: "100%" }}
              ></Image>
            </View>
            <View style={{ textAlign: "center", marginTop: 7 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold", marginTop: 3 }}>
                {header?.title}
              </Text>
              <Text style={{ marginTop: 3 }}>{header?.address}</Text>
              <Text style={{ marginTop: 3 }}>Customer Receipt</Text>
              <Text style={{ marginTop: 3 }}>
                Issue Date: {new Date().toLocaleDateString()}
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <Text style={{ fontWeight: "bold", fontSize: 12 }}>
                  Invoiced From
                </Text>
                <Text>{header?.title}</Text>
                <Text>+8801715-738573</Text>
                <Text>abc@email.com</Text>
              </View>
              <View>
                <Text style={{ fontWeight: "bold", fontSize: 12 }}>
                  Invoiced To
                </Text>
                <Text>S.M. Khalid Mahmud</Text>
                <Text>+8801715-738573</Text>
              </View>
            </View>
            <View>
              <RoomDetailsSection data={data} />
            </View>
            <View
              style={{
                position: "absolute",
                left: 0,
                bottom: 0,
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text>___________________</Text>
                <Text style={{ marginHorizontal: "auto" }}>
                  Office Signature
                </Text>
              </View>
              <View>
                <Text>___________________</Text>
                <Text style={{ marginHorizontal: "auto" }}>
                  Customer Signature
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;

import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "../../assets/amazon.png";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
  },
  section: {
    margin: 30,
    padding: 14,
    flexGrow: 1,
    fontSize: 12,
  },
});

const CreateCustomerReceipt = () => {
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
            <View style={{ width: 220, marginHorizontal: "auto" }}>
              <Image
                src={logo}
                style={{ width: "100%", height: "auto" }}
              ></Image>
            </View>
            <View style={{ textAlign: "center", marginTop: 14 }}>
              <Text>Customer Receipt</Text>
              <Text>Date: {new Date().toLocaleDateString()}</Text>
            </View>

            <View>
              <View>
                <Text style={{ fontSize: 16, marginTop: 30, marginBottom: 14 }}>
                  Customer Information
                </Text>
              </View>
              <View style={{ gap: 3 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ width: "14%" }}>Name</Text>
                  <Text style={{ width: "2%" }}>:</Text>
                  <Text>Hamid Chowdhury</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ width: "14%" }}>Email</Text>
                  <Text style={{ width: "2%" }}>:</Text>
                  <Text>hamid@gmail.com</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ width: "14%" }}>Phone</Text>
                  <Text style={{ width: "2%" }}>:</Text>
                  <Text>+880 1715738573</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ width: "14%" }}>Address</Text>
                  <Text style={{ width: "2%" }}>:</Text>
                  <Text>Dhaka</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ width: "14%" }}>Booking No</Text>
                  <Text style={{ width: "2%" }}>:</Text>
                  <Text>101</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ width: "14%" }}>Check In</Text>
                  <Text style={{ width: "2%" }}>:</Text>
                  <Text>{new Date().toLocaleDateString()}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ width: "14%" }}>Check Out</Text>
                  <Text style={{ width: "2%" }}>:</Text>
                  <Text>{new Date().toLocaleDateString()}</Text>
                </View>
              </View>
            </View>

            <View>
              <View>
                <Text style={{ fontSize: 16, marginTop: 30, marginBottom: 14 }}>
                  Room Information
                </Text>
              </View>
              <View style={{ gap: 3 }}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ width: "14%" }}>No</Text>
                  <Text style={{ width: "2%" }}>:</Text>
                  <Text>101</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ width: "14%" }}>Adult</Text>
                  <Text style={{ width: "2%" }}>:</Text>
                  <Text>2</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ width: "14%" }}>Children</Text>
                  <Text style={{ width: "2%" }}>:</Text>
                  <Text>0</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ width: "14%" }}>Total cost</Text>
                  <Text style={{ width: "2%" }}>:</Text>
                  <Text>2000</Text>
                </View>
              </View>
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

export default CreateCustomerReceipt;

"use client";

import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

// US LETTER Dimensions: ~612 x 792 points
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#FFFFFF",
    // increased padding to accommodate printer "non-printable" areas
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 30,
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    // REDUCED HEIGHT: 235pt.
    // Math: 235 * 3 rows = 705pt.
    // Page Height (792) - Padding (60) = 732 available.
    // 705 fits comfortably within 732.
    height: 235,
    marginBottom: 10,
    padding: 8,
    border: "1pt solid #e5e7eb",
    borderRadius: 6,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    fontSize: 9,
    color: "#db2777",
    alignSelf: "flex-start",
    fontWeight: "bold",
    marginBottom: 2,
    fontFamily: "Helvetica-Bold",
  },
  imageContainer: {
    width: "100%",
    height: 175, // Adjusted to match the shorter card height
    border: "1pt dashed #fbcfe8",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
  drawing: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  footer: {
    fontSize: 9,
    color: "#666",
    alignSelf: "flex-end",
    marginTop: 2,
  },
  cutGuide: {
    position: "absolute",
    border: "0.5pt solid #e5e5e5", // Very faint grey line
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    borderRadius: 6,
    zIndex: -1,
  },
});

interface Valentine {
  id: string;
  to: string;
  from: string;
  imageData: string;
}

export const ValentineDocument = ({ data }: { data: Valentine[] }) => (
  <Document>
    {/* Updated size to LETTER */}
    <Page size="LETTER" style={styles.page}>
      {data.map((val) => (
        <View key={val.id} style={styles.card} wrap={false}>
          <View style={styles.cutGuide} />
          <Text style={styles.header}>To: {val.to}</Text>

          <View style={styles.imageContainer}>
            <Image src={val.imageData} style={styles.drawing} />
          </View>

          <Text style={styles.footer}>From: {val.from}</Text>
        </View>
      ))}
    </Page>
  </Document>
);

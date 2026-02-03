"use client";

import React from "react";
import { Page, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#FFFFFF",
    paddingTop: 30,
    paddingHorizontal: 30,
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    height: 235,
    marginBottom: 10,
    position: "relative",
    border: "1pt solid #ddd",
  },
  // Style for BOTH layers to ensure they overlap perfectly
  layer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
});

interface Valentine {
  id: string;
  imageData: string;
}

export const ValentineDocument = ({ data }: { data: Valentine[] }) => {
  // Ensure we get the full path for the image
  const templatePath = typeof window !== "undefined" ? `${window.location.origin}/template.png` : "/template.png";

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {data.map((val) => (
          <View key={val.id} style={styles.card} wrap={false}>
            {/* FIRST: The Background (Bottom Layer) */}
            <Image
              src={templatePath}
              style={styles.layer} // Apply generalized layer style
            />

            {/* SECOND: The Drawing (Top Layer)
                Because this comes second in the code, it renders ON TOP.
            */}
            <Image src={val.imageData} style={styles.layer} />
          </View>
        ))}
      </Page>
    </Document>
  );
};

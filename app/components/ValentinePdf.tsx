import React from "react";
import { Document, Page, View, Image, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#ffffff",
    padding: 20, // ample margins for printer bleed
    alignContent: "flex-start",
  },
  card: {
    width: "46%", // Slightly less than 50% to account for gap
    height: 230, // Approx 1/3rd of the page height (11in / 3 = ~3.6in)
    margin: "2%",
    position: "relative",
    border: "1px solid #ddd", // Light border to guide cutting
  },
  layer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover", // Ensures it fills the box nicely
  },
});

interface Valentine {
  id: string;
  imageData: string;
  building: string;
  createdAt: Date;
}

export const ValentineDocument = ({ data }: { data: Valentine[] }) => {
  const templatePath = "/template.png";

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {data.map((val) => (
          <View key={val.id} style={styles.card} wrap={false}>
            {/* Background Template */}
            <Image src={templatePath} style={styles.layer} />

            {/* User Drawing */}
            <Image src={val.imageData} style={styles.layer} />

            {/* Building Text REMOVED as requested */}
          </View>
        ))}
      </Page>
    </Document>
  );
};

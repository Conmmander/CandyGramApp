import React from "react";
import { Document, Page, View, Image, StyleSheet } from "@react-pdf/renderer";

// US Letter is 612pt x 792pt
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#ffffff",
    // 30pt padding around the edge
    padding: 30,
    // Distribute space between columns automatically
    justifyContent: "space-between",
    alignContent: "flex-start",
  },
  card: {
    // Width calculation:
    // Page (612) - Padding (60) = 552pt available.
    // 552 / 2 = 276pt max per card.
    // Set to 270pt to be safe and leave a visual gap.
    width: 270,

    // Height calculation:
    // Page (792) - Padding (60) = 732pt available.
    // 732 / 3 = 244pt max per card.
    // Set to 230pt to allow for margins.
    height: 230,

    // Small margin bottom to separate rows
    marginBottom: 10,

    position: "relative",
    border: "1px dashed #cccccc", // Dashed line is better for cutting guides
  },
  layer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain", // Changed to contain to ensure full image is visible
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
          </View>
        ))}
      </Page>
    </Document>
  );
};

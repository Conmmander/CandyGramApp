import React from "react";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#ffffff",
    padding: 10,
  },
  card: {
    width: "48%",
    height: 350,
    margin: "1%",
    position: "relative",
    border: "1px solid #ccc",
  },
  layer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  text: {
    position: "absolute",
    bottom: 5,
    left: 5,
    fontSize: 10,
    color: "#888",
  },
});

// FIXED: Removed 'template' from interface
interface Valentine {
  id: string;
  imageData: string;
  building: string;
  createdAt: Date;
}

export const ValentineDocument = ({ data }: { data: Valentine[] }) => {
  // Use a hardcoded path since multi-template is removed
  const templatePath = "/template.png";

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {data.map((val) => {
          return (
            <View key={val.id} style={styles.card} wrap={false}>
              {/* Static Background */}
              {/* Note: React-PDF often needs absolute URLs or base64.
                  If '/template.png' fails in production, we might need to construct the full URL. */}
              <Image src={templatePath} style={styles.layer} />

              {/* User Drawing */}
              <Image src={val.imageData} style={styles.layer} />

              <Text style={styles.text}>{val.building}</Text>
            </View>
          );
        })}
      </Page>
    </Document>
  );
};

import React from "react";
import { Document, Page, View, Image, StyleSheet } from "@react-pdf/renderer";

// US Letter is 612pt x 792pt
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#ffffff",
    // 30pt padding on sides leaves 552pt printable width
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 10, // slightly less right padding to accommodate flex wrap oddities
    paddingBottom: 20,
  },
  card: {
    // Width: (552 / 2) - gap = approx 270pt
    width: 270,
    // Height: We need to fit 3 in 740pt. 740/3 = 246. Let's start with 230 to be safe.
    height: 230,
    marginBottom: 10,
    marginRight: 20, // Create horizontal gap
    position: "relative",
    border: "1px solid #ddd",
  },
  layer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
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

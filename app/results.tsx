import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver"; 

export default function ResultsScreen() {
  const { data } = useLocalSearchParams();
  const processedData = data ? JSON.parse(data as string) : [];

  // Apply acceptance logic
  const finalData = processedData.map((item: any) => {
    const accepted =
      item.Length &&
      item.Width &&
      item.Error &&
      Math.abs(item.Length - item.ExpectedLength) <= item.Error &&
      Math.abs(item.Width - item.ExpectedWidth) <= item.Error;

    return {
      ...item,
      Status: accepted ? "✅ Accepted" : "❌ Declined",
    };
  });

  // ✅ Generate and Download PDF
  const generatePDF = async () => {
    try {
      if (!finalData.length) {
        Alert.alert("No Data", "There is no data to generate a PDF.");
        return;
      }

      const html = `
        <html>
          <head>
            <style>
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid black; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h2>Measurement Results</h2>
            <table>
              <tr>
                <th>Length</th>
                <th>Width</th>
                <th>Error</th>
                <th>Expected Length</th>
                <th>Expected Width</th>
                <th>Status</th>
              </tr>
              ${finalData
                .map(
                  (item) => `
                <tr>
                  <td>${item.Length}</td>
                  <td>${item.Width}</td>
                  <td>${item.Error}</td>
                  <td>${item.ExpectedLength}</td>
                  <td>${item.ExpectedWidth}</td>
                  <td>${item.Status}</td>
                </tr>
              `
                )
                .join("")}
            </table>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });

      if (Platform.OS !== "web") {
        await Sharing.shareAsync(uri);
      } else {
        saveAs(uri, "Results.pdf");
      }
    } catch (error) {
      console.error("PDF Generation Error:", error);
      Alert.alert("Error", "Failed to generate the PDF.");
    }
  };

  // ✅ Export to Excel (Cross-platform)
  const generateExcel = async () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(finalData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

      if (Platform.OS === "web") {
        // 🌐 Web: Use file-saver to download the file
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "Results.xlsx");
      } else {
        // 📱 Mobile: Use expo-file-system & expo-sharing
        const fileUri = FileSystem.documentDirectory + "results.xlsx";
        const excelBase64 = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "base64",
        });

        await FileSystem.writeAsStringAsync(fileUri, excelBase64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await Sharing.shareAsync(fileUri);
      }
    } catch (error) {
      console.error("Excel Export Error:", error);
      Alert.alert("Error", "Failed to export to Excel.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Results</Text>
      <ScrollView horizontal>
        <View>
          <View style={styles.row}>
            <Text style={styles.header}>Length</Text>
            <Text style={styles.header}>Width</Text>
            <Text style={styles.header}>Error</Text>
            <Text style={styles.header}>Expected Length</Text>
            <Text style={styles.header}>Expected Width</Text>
            <Text style={styles.header}>Status</Text>
          </View>
          {finalData.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.cell}>{item.Length}</Text>
              <Text style={styles.cell}>{item.Width}</Text>
              <Text style={styles.cell}>{item.Error}</Text>
              <Text style={styles.cell}>{item.ExpectedLength}</Text>
              <Text style={styles.cell}>{item.ExpectedWidth}</Text>
              <Text style={styles.cell}>{item.Status}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <Button title="Download as Excel" onPress={generateExcel} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 8,
  },
  header: {
    flex: 1,
    fontWeight: "bold",
    padding: 8,
    backgroundColor: "#ddd",
    textAlign: "center",
  },
  cell: {
    flex: 1,
    padding: 8,
    textAlign: "center",
  },
});

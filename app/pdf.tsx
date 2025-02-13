import React from "react";
import { View, Button, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export default function PdfScreen() {
  const { data } = useLocalSearchParams();
  const processedData = data ? JSON.parse(data as string) : [];

  const generatePDF = async () => {
    try {
      const html = `
        <html>
          <head>
            <style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid black; padding: 8px; text-align: center; }</style>
          </head>
          <body>
            <h2>Measurement Report</h2>
            <table><tr><th>Expected</th><th>Actual</th><th>Status</th></tr>
            ${processedData
              .map(
                (item) =>
                  `<tr><td>${item.ExpectedLength}x${item.ExpectedWidth}</td><td>${item.ActualLength}x${item.ActualWidth}</td><td>${item.Status}</td></tr>`
              )
              .join("")}
            </table>
          </body>
        </html>`;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert("Error", "Failed to generate PDF.");
    }
  };

  return (
    <View>
      <Button title="Generate PDF" onPress={generatePDF} />
    </View>
  );
}

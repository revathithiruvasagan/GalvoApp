import React from "react";
import { View, Button, Alert ,Image ,StyleSheet ,Text} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as XLSX from "xlsx";
import { useRouter } from "expo-router";
import uploadimg from "../assets/images/pic.png";
import topSide from "../assets/images/bg2.png"

export default function UploadScreen() {
  const router = useRouter();

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        processExcel(fileUri);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while picking the file.");
      console.error("File picking error:", error);
    }
  };

  const processExcel = async (fileUri: string) => {
    try {
      if (typeof window !== "undefined") {
        // 📌 Web: Use FileReader
        const response = await fetch(fileUri);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsBinaryString(blob);
        reader.onload = (e) => {
          const binaryStr = e.target?.result;
          processBinaryExcel(binaryStr as string);
        };
      } else {
        const { readAsStringAsync } = await import("expo-file-system");
        const fileContent = await readAsStringAsync(fileUri, {
          encoding: "base64",
        });
        processBinaryExcel(fileContent);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to process the file.");
      console.error("Excel processing error:", error);
    }
  };

  const processBinaryExcel = (binaryStr: string) => {
    const workbook = XLSX.read(binaryStr, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const parsedData = XLSX.utils.sheet_to_json(sheet);

    // Example Processing
    const processedData = parsedData.map((item: any) => ({
      ExpectedLength: item.Length,
      ExpectedWidth: item.Width,
      Error: item.Error,
      Status: "Pending",
    }));

    // Navigate to Results Page
    router.push({
      pathname: "/bluetooth",
      params: { data: encodeURIComponent(JSON.stringify(processedData)) },
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center",backgroundColor:"#292D32" ,height:'100%'}}>
      <View style={styles.topContainer}>
        <Image source={topSide}  style={styles.image1}/>
        <Image source={uploadimg} style={styles.image2} />

      </View>
      <View  style={{marginBottom:50 , width:'80%'}}>
        <Text style={styles.txt}>Upload an Excel sheet containing product measurements(Length, Width, Error)
           to process and determine acceptance status based on expected values .</Text>
      <Button title="Upload Excel File" onPress={pickFile} color="#f4247c"/>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  topContainer:{
    position:'relative' ,
    width:'100%',
    height:'50%'
  },
  image1:{
    position:'absolute',
    width:'100%',
    top:0,
    left:0,
    right:0
    
  },
  txt:{
    color:"white",
    fontSize:12,
    textAlign:'center',
    marginBottom:15
  },
  image2:{
    position:'absolute',
    top:'40%',
    left:'20%'
  }

}) 
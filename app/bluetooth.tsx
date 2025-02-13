import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function ManualInputScreen() {
  const router = useRouter();
  const { data } = useLocalSearchParams();
  const initialData = data ? JSON.parse(data as string) : [];

  const [measurements, setMeasurements] = useState(initialData);

  const handleChange = (index: number, key: string, value: string) => {
    const updatedData = [...measurements];
    updatedData[index][key] = value;
    setMeasurements(updatedData);
  };

  const submitData = () => {
    // Navigate to results page with processed data
    router.push({
      pathname: "/results",
      params: { data: JSON.stringify(measurements) },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manual Input</Text>
      <FlatList
        data={measurements}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text>📏 Expected Length:</Text>
            <TextInput
              style={styles.input}
              value={item.Length?.toString()}
              onChangeText={(text) => handleChange(index, "Length", text)}
              keyboardType="numeric"
            />
            <Text>📐 Expected Width:</Text>
            <TextInput
              style={styles.input}
              value={item.Width?.toString()}
              onChangeText={(text) => handleChange(index, "Width", text)}
              keyboardType="numeric"
            />
            <Text>⚠️ Error:</Text>
            <TextInput
              style={styles.input}
              value={item.Error?.toString()}
              onChangeText={(text) => handleChange(index, "Error", text)}
              keyboardType="numeric"
            />
          </View>
        )}
      />
      <Button title="Submit" onPress={submitData} />
    </View>
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
  },
  item: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    marginTop: 5,
  },
});

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   FlatList,
//   StyleSheet,
//   PermissionsAndroid,
//   Platform,
// } from "react-native";
// import { BleManager } from "react-native-ble-plx";
// import { useRouter } from "expo-router";

// const bleManager = new BleManager();

// export default function ManualInputScreen() {
//   const router = useRouter();
//   const [measurements, setMeasurements] = useState([]);
//   const [device, setDevice] = useState(null);

//   useEffect(() => {
//     requestPermissions();
//     scanForDevices();
//   }, []);

//   // Request permissions for Bluetooth (Android)
//   const requestPermissions = async () => {
//     if (Platform.OS === "android") {
//       await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//         PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
//       ]);
//     }
//   };

//   // Scan for nearby BLE devices
//   const scanForDevices = () => {
//     bleManager.startDeviceScan(null, null, (error, scannedDevice) => {
//       if (error) {
//         console.error("Scan Error:", error);
//         return;
//       }

//       // Connect to a specific ESP32 device (replace with actual device name)
//       if (scannedDevice?.name === "ESP32-Device") {
//         bleManager.stopDeviceScan();
//         setDevice(scannedDevice);
//         connectToDevice(scannedDevice);
//       }
//     });
//   };

//   // Connect to the ESP32 device
//   const connectToDevice = async (device) => {
//     try {
//       const connectedDevice = await device.connect();
//       await connectedDevice.discoverAllServicesAndCharacteristics();
//       console.log("Connected to:", connectedDevice.name);

//       // Start listening for data
//       readMeasurementData(connectedDevice);
//     } catch (error) {
//       console.error("Connection Error:", error);
//     }
//   };

//   // Read real-time measurements from ESP32
//   const readMeasurementData = async (device) => {
//     const SERVICE_UUID = "your-service-uuid"; // Replace with your ESP32 service UUID
//     const CHARACTERISTIC_UUID = "your-characteristic-uuid"; // Replace with ESP32 characteristic UUID

//     device.monitorCharacteristicForService(
//       SERVICE_UUID,
//       CHARACTERISTIC_UUID,
//       (error, characteristic) => {
//         if (error) {
//           console.error("Read Error:", error);
//           return;
//         }

//         if (characteristic?.value) {
//           const decodedValue = atob(characteristic.value); // Decode Base64
//           const [length, width, errorMargin] = decodedValue
//             .split(",")
//             .map(parseFloat);

//           const newMeasurement = {
//             Length: length,
//             Width: width,
//             Error: errorMargin,
//           };
//           setMeasurements((prev) => [...prev, newMeasurement]);
//         }
//       }
//     );
//   };

//   const submitData = () => {
//     router.push({
//       pathname: "/results",
//       params: { data: JSON.stringify(measurements) },
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Real-Time Bluetooth Input</Text>
//       <FlatList
//         data={measurements}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.item}>
//             <Text>📏 Length: {item.Length} mm</Text>
//             <Text>📐 Width: {item.Width} mm</Text>
//             <Text>⚠️ Error: {item.Error} mm</Text>
//           </View>
//         )}
//       />
//       <Button
//         title="Submit"
//         onPress={submitData}
//         disabled={measurements.length === 0}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#f8f8f8",
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   item: {
//     backgroundColor: "#fff",
//     padding: 10,
//     marginVertical: 5,
//     borderRadius: 5,
//   },
// });

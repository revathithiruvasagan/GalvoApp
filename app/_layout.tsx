import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown:false}} />
      <Stack.Screen name="Excel" options={{headerShown:false}} />
      <Stack.Screen name="bluetooth" options={{headerShown:false}} />
      <Stack.Screen name="results" options={{headerShown:false}} />


    </Stack>
  );
}

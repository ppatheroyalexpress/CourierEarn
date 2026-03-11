import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const API_BASE_URL = 'https://courier-earn.vercel.app/api';

export default function App() {
  const [status, setStatus] = useState('Loading...');
  const [data, setData] = useState(null);

  useEffect(() => {
    async function testFetch() {
      try {
        const response = await fetch(`${API_BASE_URL}/dashboard/summary`);
        setStatus(`${response.status} ${response.statusText}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        setStatus('Error: ' + error.message);
      }
    }
    testFetch();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CourierEarn Mobile</Text>
      <Text>API Status: {status}</Text>
      {data && <Text>Response: {JSON.stringify(data)}</Text>}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

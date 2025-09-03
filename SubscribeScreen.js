import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import axios from 'axios';
const API = "https://YOUR_BACKEND_URL_OR_TUNNEL";

export default function SubscribeScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('weekday-breakfast');
  const [msg, setMsg] = useState(null);

  const submit = async () => {
    setMsg(null);
    try {
      const res = await axios.post(`${API}/subscribe`, { name, email, plan });
      if (res.status === 201) setMsg('Subscribed — welcome to Joevis Elite!');
    } catch (e) {
      setMsg('Error subscribing. Please check email and try again.');
    }
  };

  return (
    <View style={{ padding: 12 }}>
      <TextInput label="Name" value={name} onChangeText={setName} style={{ marginBottom: 8 }} />
      <TextInput label="Email" value={email} onChangeText={setEmail} style={{ marginBottom: 8 }} keyboardType="email-address" />
      <TextInput label="Plan (e.g. weekday-breakfast)" value={plan} onChangeText={setPlan} style={{ marginBottom: 12 }} />
      <Button mode="contained" onPress={submit}>Subscribe</Button>
      {msg ? <HelperText type="info">{msg}</HelperText> : null}
    </View>
  );
}
import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, HelperText } from 'react-native-paper';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const API = "https://joevis-backend.onrender.com";
const ADMIN_PW = "adminpass"; // same as backend env for quick start

export default function AdminScreen() {
  const [items, setItems] = useState([]);
  const [name,setName] = useState('');
  const [desc,setDesc] = useState('');
  const [price,setPrice] = useState('');
  const [mealType,setMealType] = useState('weekday-breakfast');
  const [msg,setMsg] = useState('');

  useEffect(()=>{ load(); }, []);

  const load = async () => {
    try {
      const r = await axios.get(`${API}/menus`);
      setItems(r.data.items || []);
    } catch(e) {}
  };

  const create = async () => {
    try {
      const payload = { name, description: desc, price: parseFloat(price), meal_type: mealType };
      const r = await axios.post(`${API}/admin/menu`, payload, { headers: { 'x-admin-pw': ADMIN_PW } });
      setMsg('Added'); setName(''); setDesc(''); setPrice('');
      load();
    } catch (e) { setMsg('Error'); }
  };

  const pickAndUpload = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { setMsg('Permission required'); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.7, base64: false });
    if (res.cancelled) return;
    const form = new FormData();
    const uriParts = res.uri.split('.');
    const ext = uriParts[uriParts.length-1];
    form.append('file', { uri: res.uri, name: `photo.${ext}`, type: `image/${ext}` });
    try {
      const r = await fetch(`${API}/admin/upload`, {
        method: 'POST',
        headers: { 'x-admin-pw': ADMIN_PW, 'Content-Type': 'multipart/form-data' },
        body: form
      });
      const data = await r.json();
      setMsg('Image uploaded: ' + data.url);
    } catch (e) {
      setMsg('Upload failed');
    }
  };

  return (
    <ScrollView style={{ padding: 12 }}>
      <Title>Admin — Joevis</Title>
      <TextInput label="Name" value={name} onChangeText={setName} style={{ marginBottom:8 }} />
      <TextInput label="Description" value={desc} onChangeText={setDesc} style={{ marginBottom:8 }} />
      <TextInput label="Price" value={price} onChangeText={setPrice} keyboardType="numeric" style={{ marginBottom:8 }} />
      <TextInput label="Meal Type" value={mealType} onChangeText={setMealType} style={{ marginBottom:8 }} />
      <Button mode="contained" onPress={create}>Add Menu Item</Button>
      <Button mode="outlined" onPress={pickAndUpload} style={{ marginTop: 8 }}>Pick & Upload Image</Button>
      <HelperText>{msg}</HelperText>

      <Title style={{ marginTop: 18 }}>Existing Items</Title>
      {items.map(it => (
        <Card key={it.id} style={{ marginVertical: 8 }}>
          {it.image_url ? <Card.Cover source={{ uri: API + it.image_url }} /> : null}
          <Card.Content>
            <Title>{it.name} — ₦{it.price}</Title>
            <Paragraph>{it.description}</Paragraph>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );

}

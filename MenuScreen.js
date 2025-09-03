import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import axios from 'axios';
const API = "https://joevis-backend.onrender.com";

export default function MenuScreen() {
  const [menus, setMenus] = useState([]);
  useEffect(() => {
    axios.get(`${API}/menus`).then(r => setMenus(r.data.items)).catch(()=>{});
  }, []);
  return (
    <ScrollView style={{ padding: 12 }}>
      {menus.map(it => (
        <Card key={it.id} style={{ marginVertical: 8 }}>
          {it.image_url ? <Card.Cover source={{ uri: API + it.image_url }} /> : null}
          <Card.Content>
            <Title>{it.name} — ₦{it.price}</Title>
            <Paragraph>{it.description}</Paragraph>
            <Paragraph style={{fontStyle:'italic', fontSize:12}}>{it.meal_type}</Paragraph>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );

}

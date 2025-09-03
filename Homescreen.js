import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import axios from 'axios';

const API = "https://YOUR_BACKEND_URL_OR_TUNNEL"; // replace with backend address

export default function HomeScreen({ navigation }) {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    axios.get(`${API}/menus`).then(res => {
      setMenus(res.data.items || []);
    }).catch(() => {});
  }, []);

  const breakfast = menus.filter(i => i.meal_type.includes('breakfast'));
  const lunch = menus.filter(i => i.meal_type.includes('lunch'));

  return (
    <ScrollView style={{ padding: 12 }}>
      <Title>Joevis Meal Plans</Title>
      <Paragraph>Authentic Nigerian flavours delivered with style.</Paragraph>

      <Button mode="contained" onPress={() => navigation.navigate('Menu') } style={{ marginTop: 12 }}>View Full Menu</Button>
      <Button mode="outlined" onPress={() => navigation.navigate('Subscribe') } style={{ marginTop: 8 }}>Subscribe</Button>
      <Button onPress={() => navigation.navigate('Admin')} style={{ marginTop: 8 }}>Admin</Button>

      <Title style={{ marginTop: 18 }}>Breakfast</Title>
      {breakfast.map(it => (
        <Card key={it.id} style={{ marginVertical: 8 }}>
          {it.image_url ? <Card.Cover source={{ uri: API + it.image_url }} /> : null}
          <Card.Content>
            <Title>{it.name} — ₦{it.price}</Title>
            <Paragraph>{it.description}</Paragraph>
          </Card.Content>
        </Card>
      ))}

      <Title style={{ marginTop: 12 }}>Lunch</Title>
      {lunch.map(it => (
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
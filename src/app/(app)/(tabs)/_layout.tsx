import { Tabs } from 'expo-router';
import React from 'react';

export default function AppTabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="dashboard" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="new-record" options={{ title: 'Nuevo Registro' }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}

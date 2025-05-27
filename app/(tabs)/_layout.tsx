import TabBar from '@/components/TabBar';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="beatmaps" />
      <Tabs.Screen name="index" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

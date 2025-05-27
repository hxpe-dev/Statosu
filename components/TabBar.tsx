import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const MARGIN_BORDER = 64
const TAB_WIDTH = (width - MARGIN_BORDER * 2) / 3;
const SLIDER_WIDTH = 30;

const tabs: {
  name: string;
  icon: 'home-outline' | 'musical-notes-outline' | 'person-outline';
  route: string;
}[] = [
  { name: 'Beatmaps', icon: 'musical-notes-outline', route: 'beatmaps' },
  { name: 'Home', icon: 'home-outline', route: 'index' },
  { name: 'Profile', icon: 'person-outline', route: 'profile' },
];

type TabBarProps = {
  state: any;
  descriptors: any;
  navigation: any;
};

export default function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const styles = getStyles(theme);

  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: (state.index - 1) * TAB_WIDTH,
      useNativeDriver: true,
    }).start();
  }, [state.index, translateX]);

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <Animated.View
          style={[
            styles.slider,
            { transform: [{ translateX }] },
          ]}
        />
        {tabs.map((tab, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: state.routes[index].key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(tab.route);
            }
          };

          return (
            <TouchableOpacity
              key={tab.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.tab}
              activeOpacity={0.8}
              hitSlop={20}
            >
              <Ionicons
                name={tab.icon}
                size={20}
                color={isFocused ? theme.text : theme.secondaryText}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const getStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 32,
      left: MARGIN_BORDER,
      right: MARGIN_BORDER,
      height: 50,
      borderRadius: 24,
      backgroundColor: theme.surfaceHigh,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
      elevation: 8,
      overflow: 'hidden',
    },
    tabBar: {
      flexDirection: 'row',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'space-around',
      position: 'relative',
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    slider: {
      position: 'absolute',
      bottom: 8,
      height: 4,
      width: SLIDER_WIDTH,
      backgroundColor: theme.text,
      borderRadius: 2,
    },
  });

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { BottomTabParamList } from './types';
import { PostListScreen } from '../screens/PostListScreen';
import { PostCreateScreen } from '../screens/PostCreateScreen';
import { ShowcaseScreen } from '../screens/ShowcaseScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

interface BottomTabNavigatorProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

/**
 * 【1. 底部 Tab 导航器 (BottomTabNavigator)】
 * 负责平级切换三个主要视图：文章列表、发文章、UI 组件大厅 (支持多语言实时切换)
 */
export const BottomTabNavigator: React.FC<BottomTabNavigatorProps> = ({
  isDarkMode,
  onToggleTheme,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
      }}
    >
      <Tab.Screen
        name="Posts"
        component={PostListScreen}
        options={{
          tabBarLabel: t('nav.posts'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="newspaper-variant-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={PostCreateScreen}
        options={{
          tabBarLabel: t('nav.create'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Showcase"
        options={{
          tabBarLabel: t('nav.showcase'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="palette-outline"
              size={size}
              color={color}
            />
          ),
        }}
      >
        {() => (
          <ShowcaseScreen
            isDarkMode={isDarkMode}
            onToggleTheme={onToggleTheme}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

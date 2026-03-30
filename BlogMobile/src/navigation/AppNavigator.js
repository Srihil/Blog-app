import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator }     from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, ActivityIndicator, View } from 'react-native';

import { useAuth } from '../context/AuthContext';

import LoginScreen      from '../screens/LoginScreen';
import RegisterScreen   from '../screens/RegisterScreen';
import HomeScreen       from '../screens/HomeScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import EditPostScreen   from '../screens/EditPostScreen';
import ProfileScreen    from '../screens/ProfileScreen';

const Stack  = createStackNavigator();
const Tab    = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor:   '#6C63FF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { paddingBottom: 5, height: 60 },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Feed', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🏠</Text> }}
      />
      <Tab.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ tabBarLabel: 'New Post', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>✏️</Text> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>👤</Text> }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="MainTabs"   component={MainTabs} />
            <Stack.Screen name="PostDetail" component={PostDetailScreen}
              options={{ headerShown: true, title: 'Post', headerBackTitle: 'Back',
                headerTintColor: '#6C63FF' }} />
            <Stack.Screen name="EditPost"   component={EditPostScreen}
              options={{ headerShown: true, title: 'Edit Post', headerBackTitle: 'Back',
                headerTintColor: '#6C63FF' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login"    component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
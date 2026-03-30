  import React, { useState } from 'react';
  import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Dimensions, KeyboardAvoidingView,
    Platform, ActivityIndicator, Alert
  } from 'react-native';
  import { useAuth } from '../context/AuthContext';

  const { width } = Dimensions.get('window');

  export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading,  setLoading]  = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
      if (!username || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      setLoading(true);
      try {
        await login(username, password);
      } catch (error) {
        Alert.alert('Login Failed', error.response?.data?.message?.detail || 'Invalid credentials');
      } finally {
        setLoading(false);
      }
    };

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.inner}>

          <View style={styles.header}>
            <Text style={styles.emoji}>📝</Text>
            <Text style={styles.title}>BlogApp</Text>
            <Text style={styles.subtitle}>Welcome back</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.buttonText}>Login</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>
                Don't have an account? <Text style={styles.linkBold}>Register</Text>
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8F9FA',
    },
    inner: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: width * 0.08,
    },
    header: {
      alignItems: 'center',
      marginBottom: 40,
    },
    emoji: {
      fontSize: 60,
      marginBottom: 10,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#1A1A2E',
    },
    subtitle: {
      fontSize: 16,
      color: '#666',
      marginTop: 5,
    },
    form: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: '#333',
      marginBottom: 6,
      marginTop: 12,
    },
    input: {
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 10,
      padding: 14,
      fontSize: 15,
      backgroundColor: '#FAFAFA',
      color: '#1A1A2E',
    },
    button: {
      backgroundColor: '#6C63FF',
      borderRadius: 10,
      padding: 16,
      alignItems: 'center',
      marginTop: 24,
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    link: {
      textAlign: 'center',
      marginTop: 16,
      color: '#666',
      fontSize: 14,
    },
    linkBold: {
      color: '#6C63FF',
      fontWeight: 'bold',
    },
  });
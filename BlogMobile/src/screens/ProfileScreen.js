import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  ActivityIndicator, Dimensions, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [profile,  setProfile]  = useState(null);
  const [posts,    setPosts]    = useState([]);
  const [loading,  setLoading]  = useState(true);

  

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    if (!user) return;
  
    try {
      const [profileRes, postsRes] = await Promise.all([
        api.get('/profile/'),
        api.get(`/posts/?author__username=${user.username}`),
      ]);
  
      setProfile(profileRes.data);
      setPosts(postsRes.data.results || []);
    } catch (err) {
      console.log('Profile load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout }
    ]);
  };

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#6C63FF" /></View>;
  }

  return (
    <ScrollView style={styles.container}>

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.bigAvatar}>
        <Text style={styles.bigAvatarText}>
          {user?.username ? user.username[0].toUpperCase() : ''}
        </Text>
        </View>
        <Text style={styles.username}>{user?.username || ''}</Text>
        <Text style={styles.email}>{profile?.email}</Text>

        {profile?.profile?.bio && (
          <Text style={styles.bio}>{profile.profile.bio}</Text>
        )}
        {profile?.profile?.location && (
          <Text style={styles.location}>📍 {profile.profile.location}</Text>
        )}

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{posts.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
        </View>
      </View>

      {/* My Posts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Posts</Text>
        {posts.length === 0
          ? <Text style={styles.emptyText}>No posts yet. Start writing!</Text>
          : posts.map(post => (
            <View key={post.id} style={styles.postItem}>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postDate}>
                {new Date(post.created_at).toLocaleDateString()}
              </Text>
            </View>
          ))
        }
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#F8F9FA' },
  centered:       { flex: 1, justifyContent: 'center', alignItems: 'center' },
  profileHeader:  { backgroundColor: '#fff', alignItems: 'center',
                    paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20,
                    borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  bigAvatar:      { width: 80, height: 80, borderRadius: 40, backgroundColor: '#6C63FF',
                    justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  bigAvatarText:  { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  username:       { fontSize: 22, fontWeight: 'bold', color: '#1A1A2E' },
  email:          { fontSize: 14, color: '#999', marginTop: 4 },
  bio:            { fontSize: 14, color: '#555', marginTop: 10, textAlign: 'center' },
  location:       { fontSize: 13, color: '#888', marginTop: 6 },
  stats:          { flexDirection: 'row', marginTop: 20 },
  stat:           { alignItems: 'center', paddingHorizontal: 30 },
  statNum:        { fontSize: 22, fontWeight: 'bold', color: '#6C63FF' },
  statLabel:      { fontSize: 12, color: '#999', marginTop: 2 },
  section:        { margin: 16 },
  sectionTitle:   { fontSize: 18, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 12 },
  postItem:       { backgroundColor: '#fff', borderRadius: 12, padding: 14,
                    marginBottom: 10, borderLeftWidth: 3, borderLeftColor: '#6C63FF' },
  postTitle:      { fontSize: 15, fontWeight: '600', color: '#1A1A2E' },
  postDate:       { fontSize: 12, color: '#999', marginTop: 4 },
  emptyText:      { color: '#999', fontSize: 14, textAlign: 'center', paddingVertical: 20 },
  logoutBtn:      { margin: 16, marginTop: 8, backgroundColor: '#FFF0F0',
                    borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 40 },
  logoutText:     { color: '#E53E3E', fontSize: 16, fontWeight: '600' },
});
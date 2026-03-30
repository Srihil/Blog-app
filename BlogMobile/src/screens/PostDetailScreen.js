import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/axios";

const { width } = Dimensions.get("window");

export default function PostDetailScreen({ route, navigation }) {
  const { postId } = route.params;

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    loadData();
    AsyncStorage.getItem("username").then((u) => setCurrentUser(u || ""));
  }, []);

  const loadData = async () => {
    try {
      const [postRes, commentRes] = await Promise.all([
        api.get(`/posts/${postId}/`),
        api.get(`/posts/${postId}/comments/`),
      ]);
      setPost(postRes.data);
      setComments(commentRes.data.results || commentRes.data);
    } catch (err) {
      Alert.alert("Error", "Could not load post");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Post", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await api.delete(`/posts/${postId}/`);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/posts/${postId}/comments/`, {
        content: newComment,
      });
      setComments((prev) => [res.data, ...prev]);
      setNewComment("");
    } catch (err) {
      Alert.alert("Error", "Could not post comment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  const isAuthor = post?.author === currentUser;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        {/* Post Content */}
        <View style={styles.postCard}>
          <Text style={styles.title}>{post.title}</Text>
          <View style={styles.meta}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {post.author[0].toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.author}>{post.author}</Text>
              <Text style={styles.date}>
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>
          <Text style={styles.content}>{post.content}</Text>

          {/* Author Actions */}
          {isAuthor && (
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => navigation.navigate("EditPost", { post })}
              >
                <Text style={styles.editBtnText}>✏️ Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                <Text style={styles.deleteBtnText}>🗑️ Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>
            💬 Comments ({comments.length})
          </Text>

          {/* Add comment */}
          <View style={styles.commentInput}>
            <TextInput
              style={styles.input}
              placeholder="Write a comment..."
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendBtn, submitting && { opacity: 0.6 }]}
              onPress={handleAddComment}
              disabled={submitting}
            >
              <Text style={styles.sendBtnText}>
                {submitting ? "..." : "Post"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Comment list */}
          {comments.map((comment) => (
            <View key={comment.id} style={styles.comment}>
              <Text style={styles.commentUser}>{comment.user}</Text>
              <Text style={styles.commentContent}>{comment.content}</Text>
              <Text style={styles.commentDate}>
                {new Date(comment.created_at).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  postCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A2E",
    marginBottom: 16,
  },
  meta: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  author: { fontSize: 14, fontWeight: "600", color: "#1A1A2E" },
  date: { fontSize: 12, color: "#999" },
  content: { fontSize: 15, color: "#444", lineHeight: 24 },
  actions: { flexDirection: "row", marginTop: 20, gap: 10 },
  editBtn: {
    flex: 1,
    backgroundColor: "#EEF2FF",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  editBtnText: { color: "#6C63FF", fontWeight: "600" },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#FFF0F0",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  deleteBtnText: { color: "#E53E3E", fontWeight: "600" },
  commentsSection: { margin: 16, marginTop: 0 },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A2E",
    marginBottom: 14,
  },
  commentInput: { flexDirection: "row", gap: 10, marginBottom: 16 },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 14,
  },
  sendBtn: {
    backgroundColor: "#6C63FF",
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  sendBtnText: { color: "#fff", fontWeight: "bold" },
  comment: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#6C63FF",
  },
  commentUser: { fontWeight: "bold", color: "#1A1A2E", fontSize: 13 },
  commentContent: { color: "#444", fontSize: 14, marginTop: 4, lineHeight: 20 },
  commentDate: { color: "#999", fontSize: 11, marginTop: 6 },
});

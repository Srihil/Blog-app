import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

function HighlightedText({ text, highlight, style, numberOfLines }) {
  if (!highlight || highlight.trim() === "") {
    return (
      <Text style={style} numberOfLines={numberOfLines}>
        {text}
      </Text>
    );
  }

  const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex   = new RegExp(`(${escaped})`, "gi");   
  const parts   = text.split(regex);
  return (
    <Text style={style} numberOfLines={numberOfLines}>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <Text key={index} style={styles.highlight}>
            {part}
          </Text>
        ) : (
          <Text key={index}>{part}</Text>
        )
      )}
    </Text>
  );
}


export default function PostCard({ post, onPress, searchQuery = "" }) {
  const preview =
    post.content.length > 120
      ? post.content.substring(0, 120) + "..."
      : post.content;

  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {post.author[0].toUpperCase()}
          </Text>
        </View>
        <View>
          <Text style={styles.author}>{post.author}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>

      <HighlightedText
        text={post.title}
        highlight={searchQuery}
        style={styles.title}
      />

      <HighlightedText
        text={preview}
        highlight={searchQuery}
        style={styles.preview}
        numberOfLines={3}
      />

      <View style={styles.footer}>
        <Text style={styles.readMore}>Read more →</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius:    14,
    padding:         18,
    marginHorizontal: width * 0.04,
    marginBottom:    14,
    shadowColor:     "#000",
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.06,
    shadowRadius:    6,
    elevation:       2,
  },
  topRow:     { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  avatar: {
    width:           36,
    height:          36,
    borderRadius:    18,
    backgroundColor: "#6C63FF",
    justifyContent:  "center",
    alignItems:      "center",
    marginRight:     10,
  },
  avatarText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  author:     { fontSize: 14, fontWeight: "600", color: "#1A1A2E" },
  date:       { fontSize: 12, color: "#999", marginTop: 1 },
  title:      { fontSize: 18, fontWeight: "bold", color: "#1A1A2E", marginBottom: 8 },
  preview:    { fontSize: 14, color: "#555", lineHeight: 21 },
  footer:     { marginTop: 12, alignItems: "flex-end" },
  readMore:   { color: "#6C63FF", fontSize: 13, fontWeight: "600" },

  highlight: {
    backgroundColor: "#FFF176",   
    color:           "#1A1A2E",
    borderRadius:    3,
    overflow:        "hidden",    
    fontWeight:      "700",
  },
});
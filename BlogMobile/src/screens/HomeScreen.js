import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  TextInput,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../api/axios";
import PostCard from "../components/PostCard";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const debounceTimer = useRef(null);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (search.trim() === "") {
      fetchPosts();
      return;
    }

    debounceTimer.current = setTimeout(() => {
      searchPosts(search.trim());
    }, 100);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [search]);

  const fetchPosts = async (url = "/posts/") => {
    try {
      setLoading(true);
      setIsSearching(false);
      const res = await api.get(url);
      setPosts(res.data.results);
      setNextPage(res.data.next);
    } catch (err) {
      console.log("Fetch posts error:", err);
    } finally {
      setLoading(false);
    }
  };

  const searchPosts = async (query) => {
    try {
      setIsSearching(true);
      setLoading(true);
      const res = await api.get(`/posts/?search=${encodeURIComponent(query)}`);
      setPosts(res.data.results);
      setNextPage(res.data.next);
    } catch (err) {
      console.log("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearch("");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (search.trim()) {
      await searchPosts(search.trim());
    } else {
      await fetchPosts();
    }
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (!nextPage || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await api.get(nextPage);
      setPosts((prev) => [...prev, ...res.data.results]);
      setNextPage(res.data.next);
    } catch (err) {
      console.log("Load more error:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>📝 Blog Feed</Text>
          <Text style={styles.headerSub}>
            {isSearching
              ? `${posts.length} result${
                  posts.length !== 1 ? "s" : ""
                } for "${search}"`
              : `${posts.length} posts`}
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search posts by title or content..."
            placeholderTextColor="#AAAAAA"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="never"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6C63FF" />
          {isSearching && (
            <Text style={styles.searchingText}>Searching...</Text>
          )}
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              searchQuery={search.trim()} 
              onPress={() =>
                navigation.navigate("PostDetail", { postId: item.id })
              }
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#6C63FF"
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                color="#6C63FF"
                style={{ marginVertical: 20 }}
              />
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              {isSearching ? (
                <>
                  <Text style={styles.emptyEmoji}>🔎</Text>
                  <Text style={styles.emptyText}>No results found</Text>
                  <Text style={styles.emptySubText}>
                    Try different keywords
                  </Text>
                  <TouchableOpacity
                    style={styles.clearSearchBtn}
                    onPress={clearSearch}
                  >
                    <Text style={styles.clearSearchBtnText}>Clear Search</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.emptyEmoji}>📭</Text>
                  <Text style={styles.emptyText}>No posts yet</Text>
                  <Text style={styles.emptySubText}>
                    Be the first to write something!
                  </Text>
                </>
              )}
            </View>
          }
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchingText: { marginTop: 10, color: "#6C63FF", fontSize: 14 },

  header: {
    backgroundColor: "#fff",
    paddingHorizontal: width * 0.05,
    paddingTop: 60,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTop: { marginBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#1A1A2E" },
  headerSub: { fontSize: 13, color: "#999", marginTop: 2 },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F8",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: "#EBEBEB",
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1A1A2E",
    paddingVertical: 0,
  },
  clearBtn: { padding: 4, marginLeft: 6 },
  clearBtnText: { fontSize: 13, color: "#999", fontWeight: "600" },

  empty: { alignItems: "center", paddingTop: 80 },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  emptySubText: { fontSize: 14, color: "#999", marginTop: 6 },
  clearSearchBtn: {
    marginTop: 20,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  clearSearchBtnText: { color: "#6C63FF", fontWeight: "600", fontSize: 14 },
});

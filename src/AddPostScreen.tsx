import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import {NavigationStackScreenProps} from 'react-navigation-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AddPostProps extends NavigationStackScreenProps {}

const AddPostScreen: React.FC<AddPostProps> = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [localPosts, setLocalPosts] = useState([]);

  const fetchLocalPosts = async () => {
    try {
      const existingPosts = await AsyncStorage.getItem('posts');
      if (existingPosts) {
        const posts = JSON.parse(existingPosts);
        setLocalPosts(posts.reverse()); // Show newest post first
      }
    } catch (error) {
      console.error('Error fetching local posts:', error);
    }
  };

  useEffect(() => {
    fetchLocalPosts();
  }, []); // Fetch local posts on component mount

  const handleAddPost = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Input Error', 'Please enter both title and body properly.');
      return;
    }

    setLoading(true);

    const newPost = {
      userId: 1,
      id: Date.now(),
      title,
      body,
    };

    try {
      const existingPosts = await AsyncStorage.getItem('posts');
      const posts = existingPosts ? JSON.parse(existingPosts) : [];
      const updatedPosts = [...posts, newPost];
      await AsyncStorage.setItem('posts', JSON.stringify(updatedPosts));
      setLoading(false);
      fetchLocalPosts(); // Fetch and update local posts after adding a new post
      setTitle(''); // Clear input fields
      setBody('');
    } catch (error) {
      console.error('Error saving post:', error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Add a New Post</Text>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={text => setTitle(text)}
        style={styles.input}
        placeholderTextColor={'grey'}
      />
      <TextInput
        placeholder="Body"
        value={body}
        onChangeText={text => setBody(text)}
        multiline
        style={styles.input}
        placeholderTextColor={'grey'}
      />
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <View style={styles.buttonContainer}>
          <Button
            title="Add Post"
            onPress={handleAddPost}
            disabled={!title.trim() || !body.trim()}
          />
        </View>
      )}
      <Text style={styles.localPostsHeaderText}>Locally Stored Posts:</Text>
      <FlatList
        data={localPosts}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.localPostContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.text}>{item.body}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: '5%',
    paddingBottom: '3%',
  },
  headerText: {
    color: 'blue',
    fontSize: 20,
    fontWeight: '700',
    marginVertical: '5%',
  },
  input: {
    backgroundColor: 'lightgrey',
    marginBottom: '5%',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginHorizontal: '25%',
    marginVertical: '5%',
  },
  localPostsHeaderText: {
    marginTop: '5%',
    color: 'blue',
    fontSize: 18,
    fontWeight: '700',
  },
  localPostContainer: {
    marginTop: '1%',
  },
  title: {
    color: '#848884',
    fontSize: 20,
    fontWeight: '800',
  },
  text: {
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
    paddingTop: 2,
    paddingBottom: 5,
  },
});

export default AddPostScreen;

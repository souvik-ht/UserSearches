import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native';
import {NavigationStackScreenProps} from 'react-navigation-stack';
import {getPosts} from './api';
import {Post} from './types';

interface PostListProps extends NavigationStackScreenProps {}

const PostListScreen: React.FC<PostListProps> = ({navigation}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        // Handle error
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <View style={styles.addButtonContainer}>
        <Button
          title="Add Post"
          onPress={() => navigation.navigate('AddPost')}
        />
      </View>

      <TextInput
        placeholder="Search"
        value={searchText}
        onChangeText={text => setSearchText(text)}
        style={styles.searchInput}
        placeholderTextColor={'black'}
      />
      <FlatList
        data={filteredPosts}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.postContainer}>
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.bodyText}>{item.body}</Text>
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
    paddingHorizontal: '3%',
  },
  addButtonContainer: {
    marginHorizontal: '20%',
    borderRadius: 80,
    marginVertical: '5%',
  },
  searchInput: {
    backgroundColor: 'lightgrey',
    marginBottom: '5%',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  postContainer: {
    // paddingTop: 10,
    paddingBottom: 15,
  },
  titleText: {
    color: '#848884',
    fontSize: 18,
    fontWeight: '800',
  },
  bodyText: {
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
    paddingTop: 5,
  },
});

export default PostListScreen;

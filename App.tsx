// src/App.tsx
import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import PostListScreen from './src/PostListScreen';
import AddPostScreen from './src/AddPostScreen';

const AppNavigator = createStackNavigator(
  {
    PostList: {
      screen: PostListScreen,
      navigationOptions: {
        title: 'Post List',
      },
    },
    AddPost: {
      screen: AddPostScreen,
      navigationOptions: {
        title: 'Add Post',
      },
    },
  },
  {
    initialRouteName: 'PostList',
  },
);

export default createAppContainer(AppNavigator);

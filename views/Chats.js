import {Platform, StyleSheet, SafeAreaView, View} from 'react-native';
import PropTypes from 'prop-types';
import ChatList from '../components/ChatList';
import {Divider, Text} from '@rneui/themed';
import {StatusBar} from 'react-native';
import {appId, baseUrl, categoryList, primaryColour} from '../utils/variables';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {loadMediaById, useComments, useMedia} from '../hooks/ApiHooks';

const Chats = ({navigation}) => {
  const {user, updateMessage, setUpdateMessage} = useContext(MainContext);
  const {getCommentsByFileId} = useComments();
  const {mediaArray} = useMedia();
  const [allComments, setAllComments] = useState([]);

  const getAllComment = async () => {
    try {
      console.log('This function is called');

      const comments = await Promise.all(
        mediaArray.map(async (media) => {
          const response = await getCommentsByFileId(media.file_id);
          media.comments = await response;
          return media;
        })
      );

      const tempAllComment = [];

      comments.forEach((file) => {
        file.comments.forEach((element) => {
          const {message, receiverId} = JSON.parse(element.comment);

          if (element.user_id === user.user_id || receiverId === user.user_id) {
            tempAllComment.push({
              commentId: element.comment_id,
              fileId: element.file_id,
              senderId: element.user_id,
              receiverId: receiverId,
              message: message,
              commentAddedTime: element.time_added,
            });
          }
        });
      });
      tempAllComment.sort((a, b) => a.comment_id - b.comment_id);

      // grouping the data based on sender, receiver and file id
      const groupedData = tempAllComment.reduce((result, item) => {
        const {senderId, receiverId, fileId} = item;

        const key1 = `${senderId}-${receiverId}-${fileId}`;
        const key2 = `${receiverId}-${senderId}-${fileId}`;

        if (!result[key1] && !result[key2]) {
          result[key1] = [];
        }

        if (!result[key1]) {
          result[key2].push(item);
        } else {
          result[key1].push(item);
        }

        return result;
      }, {});

      const arrayList = Object.values(groupedData).map((chatGroup) => ({
        chatGroup,
      }));

      arrayList.forEach((chat) => {
        mediaArray.forEach((item) => {
          if (item.file_id === chat.chatGroup[0].fileId) {
            chat.file = item;
          }
        });
      });
      setAllComments(arrayList);
      // console.log('Allcomments', arrayList);
    } catch (error) {
      throw new Error('getAllComment error: ' + error.message);
    }
  };

  /*   useEffect(() => {
    const interval = setInterval(() => {
      getAllComment();
    }, 10000);
    return () => clearInterval(interval);
  }, []); */

  useEffect(() => {
    getAllComment();
  }, [mediaArray, updateMessage]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Chats</Text>
      </View>
      <Divider />
      <ChatList navigation={navigation} allComments={allComments} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  titleBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },

  title: {
    marginVertical: 25,
    marginHorizontal: 25,
    fontSize: 25,
    fontWeight: 'bold',
    color: primaryColour,
  },
});

Chats.propTypes = {
  navigation: PropTypes.object,
};

export default Chats;

import {
  Platform,
  StyleSheet,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import PropTypes from 'prop-types';
import {Button, Divider, Icon, Image, Input, Text} from '@rneui/themed';
import {StatusBar} from 'react-native';
import {
  inputBackground,
  primaryColour,
  uploadsUrl,
  appId,
  messageId,
} from '../utils/variables';
import MessageList from '../components/MessageList';
import {Controller, useForm} from 'react-hook-form';
import {useContext, useEffect, useState} from 'react';
import {useComments, useMedia, useTag} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';

const Message = ({navigation, route}) => {
  const {file, owner} = route.params;
  const {user} = useContext(MainContext);
  // const [senderId, setSenderId] = useState();
  console.log('File:::', file);

  const senderId = user.user_id === file.user_id ? owner.user_id : file.user_id;
  const userId = user.user_id;
  const fileId = file.file_id;

  // console.log('chatGroup, ', chatGroup);
  const {title} = JSON.parse(file.description);
  const {postComment, getCommentsByFileId} = useComments();
  const {token, updateMessage, setUpdateMessage} = useContext(MainContext);
  const assetImage = Image.resolveAssetSource(
    require('../assets/avatar.png')
  ).uri;
  const commentImage = Image.resolveAssetSource(
    require('../assets/comment.png')
  ).uri;
  const {getFilesByTag} = useTag();
  const [senderAvatar, setSenderAvatar] = useState(assetImage);
  const [receiverAvatar, setReceiverAvatar] = useState(assetImage);
  const {postMedia, searchMedia} = useMedia();
  const {postTag} = useTag();
  // const [chatGroupList, setChatGroupList] = useState();
  const [groupName, setGroupName] = useState();
  const [allMessage, setAllMessage] = useState();
  const [existChatGroup, setExistChatGroup] = useState(false);

  const {control, handleSubmit, reset} = useForm({
    defaultValues: {message: ''},
    mode: 'onBlur',
  });

  const sendAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + senderId);
      if (avatarArray.length > 0) {
        setSenderAvatar(uploadsUrl + avatarArray.pop().filename);
      }
    } catch (error) {
      console.error('sender Avatar fetch failed', error.message);
    }
  };

  // getting user avatar
  const receiveAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + userId);
      if (avatarArray.length > 0) {
        setReceiverAvatar(uploadsUrl + avatarArray.pop().filename);
      }
    } catch (error) {
      console.error('sender Avatar fetch failed', error.message);
    }
  };

  const loadAllMessage = async () => {
    try {
      if (groupName != undefined) {
        const searchResponse = await searchMedia(groupName, token);
        console.log('Response length: ', searchResponse.length);

        if (searchResponse.length > 0) {
          // console.log('Hahaha: ', searchResponse);
          const commentResponse = await getCommentsByFileId(
            searchResponse[0].file_id
          );

          setAllMessage(commentResponse);
        }
      }
    } catch (error) {
      throw new Error('loadAllMessage error: ' + error.message);
    }
  };

  const searchSetGroupName = async () => {
    const name1 =
      senderId + messageId + '_' + userId + messageId + '_' + fileId;
    const name2 =
      userId + messageId + '_' + senderId + messageId + '_' + fileId;

    try {
      const response = await getFilesByTag(appId + messageId);

      if (response.length > 0) {
        response.forEach((element) => {
          if (element.title === name1) {
            setGroupName(name1);
            setExistChatGroup(true);
          } else {
            if (element.title === name2) {
              setExistChatGroup(true);
            }
            setGroupName(name2);
          }
        });
      } else {
        setGroupName(name2);
      }
    } catch (error) {
      throw new Error('searchSetGroupName error: ' + error.message);
    }
  };

  console.log('Group Name: ', groupName);

  console.log('All message', allMessage);

  const sendMessage = async (data) => {
    try {
      if (!existChatGroup) {
        console.log(
          'Create a media item with specificTag,  title and description'
        );

        const formData = new FormData();
        formData.append('file', {
          uri: commentImage,
          name: 'commentFile',
          type: 'image/png',
        });
        formData.append('title', groupName);

        const result = await postMedia(formData, token);
        const appTag = {
          file_id: result.file_id,
          tag: appId + messageId,
        };
        await postTag(appTag, token);
      }
      console.log('Group Name: ', groupName);

      // find the file with title with chatGroupName
      const ChatGroupFile = await searchMedia(groupName, token);
      console.log('CHatGroup: ', ChatGroupFile);

      // post a comment / message
      const send = await postComment(
        token,
        ChatGroupFile[0].file_id,
        data.message
      );

      console.log('message send', send);
      reset();
      setUpdateMessage(!updateMessage);
    } catch (error) {
      throw new Error('sendMessage error: ' + error.message);
    }
  };

  // console.log('All message: ', allMessage);

  useEffect(() => {
    sendAvatar();
    receiveAvatar();
    searchSetGroupName();
  }, []);

  useEffect(() => {
    loadAllMessage();
  }, [groupName, updateMessage]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <View style={styles.backIcon}>
          <Button
            type="solid"
            buttonStyle={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" color="black" />
          </Button>

          {/*          <Icon
            onPress={() => {
              navigation.goBack();
            }}
            name="arrow-back"
            color="black"
          /> */}
        </View>
        <View style={styles.itemContainer}>
          <Image
            onPress={() => {
              navigation.navigate('ProductDetails', file);
            }}
            style={styles.itemPicture}
            source={{uri: uploadsUrl + file.filename}}
          />
          <Text style={styles.itemTitle}>{title}</Text>
        </View>
      </View>

      <Divider />
      <MessageList
        navigation={navigation}
        singleItem={allMessage}
        senderAvatar={senderAvatar}
        receiverAvatar={receiverAvatar}
      />
      <Divider />
      <KeyboardAvoidingView>
        <View style={styles.sendMessage}>
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
              },
              minLength: {
                value: 1,
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.inputStyle}
                placeholder={'Message'}
                multiline={true}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="message"
          />
          <View style={styles.sendIcon}>
            <Button
              containerStyle={{
                width: 50,
                height: 30,
                borderRadius: 15,
              }}
              buttonStyle={{
                backgroundColor: primaryColour,
              }}
              titleStyle={{fontSize: 10}}
              title="Send"
              onPress={handleSubmit(sendMessage)}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
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
    justifyContent: 'center',
    alignItems: 'baseline',
    position: 'relative',
  },

  backIcon: {
    position: 'absolute',
    top: '30%',
    left: '10%',
  },

  backBtn: {
    borderRadius: 25,
    backgroundColor: '#81C784',
  },

  itemContainer: {
    alignItems: 'center',
  },

  itemPicture: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },

  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  title: {
    marginVertical: 25,
    marginHorizontal: 25,
    fontSize: 25,
    fontWeight: 'bold',
    color: primaryColour,
  },

  sendMessage: {
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
    position: 'relative',
  },

  inputContainerStyle: {
    borderBottomWidth: 0,
    backgroundColor: inputBackground,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginTop: 5,
  },

  inputStyle: {
    textAlign: 'left',
    textAlignVertical: 'center',
    fontSize: 14,
  },

  sendIcon: {
    position: 'absolute',
    right: -50,
    top: 10,
  },
});

Message.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default Message;

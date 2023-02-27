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
  vw,
} from '../utils/variables';
import MessageList from '../components/MessageList';
import {Controller, useForm} from 'react-hook-form';
import {useContext, useState} from 'react';
import {useComments} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';

const Message = ({navigation, route}) => {
  const {
    title,
    description,
    filename,
    file_id: fileId,
    time_added: timeAdded,
    user_id: userId,
  } = route.params;

  const receiverId = 2702;

  const item = {
    title: title,
    description: description,
    filename: filename,
    file_id: fileId,
    time_added: timeAdded,
    user_id: userId,
  };
  const [loading, setLoading] = useState(false);
  const {postComment} = useComments();
  const {token} = useContext(MainContext);

  const goToItemSingle = () => {
    navigation.navigate('Single', item);
  };

  const {control, handleSubmit} = useForm({
    defaultValues: {message: ''},
    mode: 'onBlur',
  });

  const sendMessage = async (data) => {
    console.log('Send clicked');

    console.log('data: ', data.message);

    setLoading(true);
    console.log('Loading', loading);

    const commentObj = {
      message: data.message,
      receiverId: receiverId,
    };

    console.log('commentObject: ', commentObj);
    try {
      // const send = await postComment(token, item.file_id, commentObj);
      setLoading(false);
      console.log('Loading', loading);
    } catch (error) {
      throw new Error('sendMessage error, ' + error.message);
    }
  };

  /*
  const moreData = {
    message: 'Hey is this item available?',
    receiverId: 2685,
  };

 const formData = new FormData();

  formData.append('description', JSON.stringify(moreData));

  console.log('Form Data Comment: ', formData);

  const allData = JSON.parse(formData._parts[0][1]);
  const message = allData.message;
  const someData = allData.receiverId;

  console.log('messgae: ', message);
  console.log('receiverId: ', someData); */

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <View style={styles.backIcon}>
          <Icon
            onPress={() => {
              navigation.goBack();
            }}
            name="arrow-back"
            color="black"
          />
        </View>
        <View style={styles.itemContainer}>
          <Image
            onPress={goToItemSingle}
            style={styles.itemPicture}
            source={{uri: uploadsUrl + filename}}
          />
          <Text style={styles.itemTitle}>{title}</Text>
        </View>
      </View>

      <Divider />
      <MessageList navigation={navigation} />
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
                // autoCapitalize="none"
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

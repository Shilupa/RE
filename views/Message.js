import {Platform, StyleSheet, SafeAreaView, View} from 'react-native';
import PropTypes from 'prop-types';
import {Divider, Icon, Image, Input, Text} from '@rneui/themed';
import {StatusBar} from 'react-native';
import {
  inputBackground,
  primaryColour,
  uploadsUrl,
  vw,
} from '../utils/variables';
import MessageList from '../components/MessageList';
import {Controller, useForm} from 'react-hook-form';

const Message = ({navigation, route}) => {
  const {
    title,
    description,
    filename,
    file_id: fileId,
    time_added: timeAdded,
    user_id: userId,
  } = route.params;

  const item = {
    title: title,
    description: description,
    filename: filename,
    file_id: fileId,
    time_added: timeAdded,
    user_id: userId,
  };

  const {control} = useForm({
    mode: 'onBlur',
  });

  const goToItemSingle = () => {
    navigation.navigate('Single', item);
  };

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
  console.log('receiverId: ', someData);

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
      <View style={styles.sendMessage}>
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              inputContainerStyle={styles.inputContainerStyle}
              inputStyle={styles.inputStyle}
              placeholder={'Message'}
              onBlur={onBlur}
              onChange={onChange}
              multiline={true}
              value={value}
              autoCapitalize="none"
            />
          )}
          name="username"
        />
        <View style={styles.sendIcon}>
          <Icon name="send" color="black" />
        </View>
      </View>
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
    width: '90%',
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
    right: -30,
    top: 10,
    transform: [{rotateZ: '-30deg'}],
  },
});

Message.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default Message;

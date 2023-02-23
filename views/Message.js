import {Platform, StyleSheet, SafeAreaView, View} from 'react-native';
import PropTypes from 'prop-types';
import {Divider, Icon, Input, Text} from '@rneui/themed';
import {StatusBar} from 'react-native';
import {inputBackground, primaryColour, vw} from '../utils/variables';
import MessageList from '../components/MessageList';
import {Controller, useForm} from 'react-hook-form';

const Message = ({navigation}) => {
  const {control} = useForm({
    mode: 'onBlur',
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <Icon
          onPress={() => {
            navigation.goBack();
          }}
          name="arrow-back"
          color="black"
        />
        <Text style={styles.title}>Message</Text>
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

        <Icon name="send" color="black" />
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
    justifyContent: 'flex-start',
    alignItems: 'baseline',
    marginStart: 25,
  },

  title: {
    marginVertical: 25,
    marginHorizontal: 25,
    fontSize: 25,
    fontWeight: 'bold',
    color: primaryColour,
  },

  sendMessage: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
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
});

Message.propTypes = {
  navigation: PropTypes.object,
};

export default Message;

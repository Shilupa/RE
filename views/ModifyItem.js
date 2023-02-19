import React, {useContext, useState} from 'react';
import {primaryColour, uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {Card, Icon, Text} from '@rneui/themed';
import {
  StyleSheet,
  View,
  Image,
  Platform,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Controller, useForm} from 'react-hook-form';
import FormInput from '../components/formComponent/FormInput';
import FormButton from '../components/formComponent/FormButton';
import {useMedia} from '../hooks/ApiHooks';

const ModifyItem = ({navigation, route}) => {
  const {file} = route.params;
  const [loading, setLoading] = useState(false);
  const {setIsLoggedIn} = useContext(MainContext);
  const {putMedia} = useMedia();
  const {update, setUpdate} = useContext(MainContext);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {title: file.title, description: file.description},
    mode: 'onChange',
  });

  const modifyFile = async (data) => {
    // create form data and post it
    setLoading(true);
    console.log('data', data);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const result = await putMedia(file.file_id, data, token);

      Alert.alert('Success', result.message, [
        {
          text: 'OK',
          onPress: () => {
            setUpdate(!update);
            navigation.navigate('Profile');
          },
        },
      ]);
    } catch (error) {
      console.error('file modify failed', error);
    } finally {
      setLoading(false);
    }
  };

  const logOut = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      {
        text: 'Yes',
        onPress: () => {
          setIsLoggedIn(false);
        },
      },
      {text: 'No'},
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <Icon style={styles.logOut} name="arrow-back" color="black" />
        <Text style={styles.title}>Modify Item</Text>
        <Icon
          style={styles.logOut}
          onPress={logOut}
          name="power-settings-new"
          color="red"
        />
      </View>
      <Card.Divider />

      <ScrollView>
        <View style={styles.box}>
          <Image
            style={styles.image}
            source={{uri: uploadsUrl + file.filename}}
          />
        </View>

        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'This is required'},
            minLength: {
              value: 3,
              message: 'min 3 characters.',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <FormInput
              placeholder="Enter a title for the item"
              label="Title"
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              error={errors.title && errors.title.message}
            />
          )}
          name="title"
        />
        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: 'min 5 characters',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <FormInput
              label="Description"
              placeholder="Enter a description for the item"
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              numberOfLines={8}
              error={errors.description && errors.description.message}
            />
          )}
          name="description"
        />
        <FormButton
          text="Modify"
          submit={modifyFile}
          handleSubmit={handleSubmit}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  titleBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginVertical: 25,
    marginHorizontal: 25,
    fontSize: 25,
    fontWeight: 'bold',
    color: primaryColour,
  },
  logOut: {
    marginVertical: 25,
    marginHorizontal: 25,
    color: primaryColour,
  },
  image: {
    resizeMode: 'cover',
    height: 300,
    borderRadius: 6,
    width: '90%',
    alignSelf: 'center',
  },
  box: {
    marginTop: 10,
    width: '90%',
    maxHeight: 310,
    alignSelf: 'center',
    borderColor: '#C0C0C0',
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 10,
  },
});

ModifyItem.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default ModifyItem;

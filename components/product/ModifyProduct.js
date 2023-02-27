import React, {useContext, useState} from 'react';
import {appId, primaryColour, uploadsUrl} from '../../utils/variables';
import PropTypes from 'prop-types';
import {Button, Card, Icon, Text} from '@rneui/themed';
import {
  StyleSheet,
  View,
  Image,
  Platform,
  SafeAreaView,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import {MainContext} from '../../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Controller, useForm} from 'react-hook-form';
import {useMedia} from '../../hooks/ApiHooks';
import FormInput from '../formComponent/FormInput';
import FormButton from '../formComponent/FormButton';

const ModifyProduct = ({navigation, route}) => {
  const {file} = route.params;
  const [loading, setLoading] = useState(false);
  const {setIsLoggedIn, token} = useContext(MainContext);
  const {putMedia, deleteMedia} = useMedia();
  const {update, setUpdate} = useContext(MainContext);
  // Converting json string to json object
  const descriptionObj = JSON.parse(file.description);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: descriptionObj.title,
      description: descriptionObj.detail,
      condition: descriptionObj.condition,
      status: descriptionObj.status,
    },
    mode: 'onChange',
  });

  const modifyFile = async (data) => {
    const mediaDescription = {
      detail: data.description,
      condition: data.condition,
      status: data.status,
      title: data.title,
    };
    // Converting json object to string
    const jsonObj = JSON.stringify(mediaDescription);

    const newDataObj = {
      description: jsonObj,
    };
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('userToken');
      const result = await putMedia(file.file_id, newDataObj, token);
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

  const deleteFile = async () => {
    try {
      const result = await deleteMedia(file.file_id, token);
      Alert.alert('Success', result.message, [
        {
          text: 'Go Profile',
          onPress: () => {
            setUpdate(!update);
            navigation.navigate('Profile');
          },
        },
        {
          text: 'Go Home',
          onPress: () => {
            setUpdate(!update);
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      throw new Error('deleteFile error, ' + error.message);
    }
  };

  const deleteItem = () => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      {
        text: 'Yes',
        onPress: () => {
          deleteFile();
        },
      },
      {text: 'No'},
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <Icon
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.back}
          name="arrow-back"
          color="black"
        />
        <Text style={styles.title}>Modify Item</Text>
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
            required: {value: true, message: 'This is required'},
            minLength: {
              value: 3,
              message: 'min 3 characters.',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <FormInput
              placeholder="Enter a condition for the item"
              label="Condition"
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              error={errors.condition && errors.condition.message}
            />
          )}
          name="condition"
        />
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
              placeholder="Enter a status of the item"
              label="Status"
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              error={errors.status && errors.status.message}
            />
          )}
          name="status"
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
              multiline={true}
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
        <Button
          buttonStyle={styles.deleteButtonStyle}
          titleStyle={styles.deleteTitleStyle}
          containerStyle={styles.deleteContainerStyle}
          title="Delete"
          onPress={deleteItem}
        />
      </ScrollView>
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
    alignItems: 'center',
  },
  title: {
    marginVertical: 25,
    marginHorizontal: 25,
    fontSize: 25,
    fontWeight: 'bold',
    color: primaryColour,
  },
  back: {
    marginVertical: 25,
    marginHorizontal: 25,
    color: primaryColour,
  },
  image: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  box: {
    marginTop: 10,
    width: '90%',
    maxHeight: 200,
    alignSelf: 'center',
    borderColor: '#C0C0C0',
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 10,
  },
  deleteButtonStyle: {
    backgroundColor: 'red',
    borderRadius: 25,
    height: 50,
  },
  deleteTitleStyle: {fontWeight: '300', fontSize: 20},
  deleteContainerStyle: {
    marginHorizontal: '10%',
    marginVertical: 10,
  },
});

ModifyProduct.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default ModifyProduct;

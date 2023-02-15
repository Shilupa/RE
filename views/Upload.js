import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  View,
  Keyboard,
} from 'react-native';
import PropTypes from 'prop-types';
import {useContext, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import FormInput from '../components/formComponent/FormInput';
import {Dropdown} from 'react-native-element-dropdown';
import FormButton from '../components/formComponent/FormButton';
import {useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import * as ImagePicker from 'expo-image-picker';
import {Image, Text} from '@rneui/themed';

const Upload = ({navigation}) => {
  const [mediafile, setMediafile] = useState({});
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const {
    control,
    handleSubmit,
    trigger,
    formState: {errors},
  } = useForm({
    defaultValues: {title: '', description: ''},
    mode: 'onBlur',
  });
  const pickFile = async () => {
    try {
      // No permissions request is necessary for launching the image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.5,
      });

      console.log(result);

      if (!result.canceled) {
        setMediafile(result.assets[0]);
        // validate form
        trigger();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const category = [
    {
      label: 'Select a category',
      value: '',
    },
    {
      label: 'Clothing',
      value: 'Clothing',
    },
    {
      label: 'Furniture',
      value: 'Furniture',
    },
    {
      label: 'Misc',
      value: 'Misc',
    },
  ];

  const renderLabel = () => {
    return <Text style={[styles.label]}>Category</Text>;
  };

  return (
    <ScrollView>
      <TouchableOpacity onPress={() => Keyboard.dismiss()} activeOpacity={1}>
        <View style={styles.box}>
          <Image
            style={styles.image}
            source={{
              uri: mediafile.uri || 'https://placekitten.com/g/200/300',
            }}
            onPress={pickFile}
          ></Image>
        </View>
      </TouchableOpacity>
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
            style={styles.FormInput}
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
            error={errors.description && errors.description.message}
            numberOfLines={10}
          />
        )}
        name="description"
      />
      <View style={styles.container}>
        {renderLabel()}
        <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={category}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select a category' : '...'}
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setValue(item.value);
            setIsFocus(false);
          }}
        />
      </View>
      <FormButton text="Publish" submit={Upload} handleSubmit={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  box: {
    marginTop: 10,
    width: '80%',
    alignSelf: 'center',
  },
  image: {
    flex: 1,
    height: 200,
    borderRadius: 6,
  },
  input: {
    width: '90%',
    alignSelf: 'center',
    margin: 10,
    backgroundColor: '#e5e5e5',
    borderRadius: 8,
  },
  dropdown: {
    height: 50,
    backgroundColor: '#e5e5e5',
    borderRadius: 8,
    borderWidth: 0.5,
    paddingHorizontal: 8,
    borderColor: 'transparent',
    marginTop: 10,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    left: 16,
    top: 8,
    marginBottom: 10,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 10,
    color: 'grey',
  },
  placeholderStyle: {
    fontSize: 16,
    paddingLeft: 10,
    color: 'grey',
  },
  selectedTextStyle: {
    fontSize: 16,
    paddingLeft: 10,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;

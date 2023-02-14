import {
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {useContext, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import FormInput from '../components/formComponent/FormInput';
import {Dropdown} from 'react-native-element-dropdown';
import FormButton from '../components/formComponent/FormButton';
import {useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';

const Upload = ({navigation}) => {
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
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {title: '', description: ''},
    mode: 'onBlur',
  });
  return (
    <ScrollView>
      <TouchableOpacity>
        <View style={styles.box}>
          <Image
            style={styles.image}
            source={{
              uri: 'https://placekitten.com/g/200/300',
            }}
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
        name="Title"
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
        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
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
    padding: 10,
  },
  box: {
    marginTop: 10,
    width: '80%',
    alignSelf: 'center',
  },
  image: {
    flex: 1,
    minHeight: 300,
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
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: '#e5e5e5',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
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

import {Text} from '@rneui/themed';
import {TextInput, View} from 'react-native';
import PropTypes from 'prop-types';

const Input = ({title, secureTextEntry, placeholder, value, onChange}) => {
  return (
    <View>
      <Text> {title}</Text>
      <TextInput
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        autoCorrect={false}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
};

Input.propTypes = {
  secureTextEntry: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  title: PropTypes.string,
  onChange: PropTypes.bool,
};

export default Input;

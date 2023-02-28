import {Button} from '@rneui/themed';
import {StyleSheet} from 'react-native';
import {vw} from '../utils/variables';
import PropTypes from 'prop-types';

const Availibility = (props) => {
  const buttonStyles = [
    styles.button,
    props.text === 'Available' && styles.available,
    props.text === 'Reserved' && styles.reserved,
    props.text === 'Unavailable' && styles.unavailable,
  ];
  return (
    <Button
      type="solid"
      disabledStyle={buttonStyles}
      title={props.text}
      disabledTitleStyle={styles.title}
      disabled={true}
    ></Button>
  );
};

Availibility.propTypes = {
  text: PropTypes.string,
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    padding: 0,
    marginTop: 10,
    width: 30 * vw,
    height: 30,
    right: -35 * vw,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    position: 'relative',
  },
  available: {
    backgroundColor: '#81C784',
  },
  reserved: {
    backgroundColor: '#F7B500',
  },
  unavailable: {
    backgroundColor: '#B81D13',
  },
  title: {
    marginRight: 15,
    color: 'white',
  },
});

export default Availibility;

import {Button, Icon} from '@rneui/themed';
import {StyleSheet} from 'react-native';
import {vw} from '../utils/variables';
import PropTypes from 'prop-types';

const Availibility = (props) => {
  return (
    <Button
      type="solid"
      buttonStyle={styles.availibityBtn}
      title={props.text}
      disabled={true}
    ></Button>
  );
};

Availibility.propTypes = {
  text: PropTypes.string,
};

const styles = StyleSheet.create({
  availibityBtn: {
    borderRadius: 25,
    padding: 0,
    marginTop: 10,
    width: 40 * vw,
    height: 30,
    right: -35 * vw,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#81C784',
    elevation: 10,
    position: 'relative',
  },
});

export default Availibility;

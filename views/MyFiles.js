import PropTypes from 'prop-types';
import SecondaryList from '../components/SecondaryList';

const MyFiles = ({navigation}) => {
  return <SecondaryList navigation={navigation} myFilesOnly={true} />;
};

MyFiles.propTypes = {
  navigation: PropTypes.object,
};

export default MyFiles;

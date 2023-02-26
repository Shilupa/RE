import {Dimensions} from 'react-native';

const baseUrl = 'https://media.mw.metropolia.fi/wbma/';
const uploadsUrl = 'https://media.mw.metropolia.fi/wbma/uploads/';
// const appId = 'Trinity-recycle-app';
const appId = 'abjfjabjdvcuayvavsuc';

const primaryColour = '#2DCC70';
const primaryColourDark = '#238D50';
const inputBackground = '#F2F3F7';

const {width, height} = Dimensions.get('window');
const vw = width / 100.0;
const vh = height / 100.0;

const categoryList = ['Clothing', 'Furniture', 'Electronics', 'Miscellaneous'];

export {
  baseUrl,
  uploadsUrl,
  appId,
  primaryColour,
  primaryColourDark,
  inputBackground,
  vw,
  vh,
  categoryList,
};

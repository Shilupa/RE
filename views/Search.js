import {
  Platform,
  StyleSheet,
  SafeAreaView,
  View,
  StatusBar,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import {Card, Icon, SearchBar, Tab, TabView, Text} from '@rneui/themed';
import {categoryList, primaryColour} from '../utils/variables';
import {useContext, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import SearchList from '../components/SearchList';

const Search = ({navigation}) => {
  const [searchIndex, setSearchIndex] = useState(0);
  const {isLoggedIn} = useContext(MainContext);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSortOptions, setSelectedSortoptions] = useState('Newest');

  const updateSearch = (search) => {
    setSearch(search);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Discover</Text>
        {!isLoggedIn && (
          <Text
            style={styles.logIn}
            onPress={() => navigation.navigate('Login')}
          >
            Sign In
          </Text>
        )}
      </View>
      <View style={{marginBottom: 10}}>
        {/* <Tab
          value={searchIndex}
          scrollable={true}
          onChange={(e) => {
            setSearchIndex(e);
          }}
          indicatorStyle={{
            backgroundColor: 'green',
            height: 3,
          }}
        >
          <Tab.Item title="All" titleStyle={{fontSize: 12, color: 'black'}} />
          <Tab.Item
            title="Furniture"
            titleStyle={{fontSize: 12, color: 'black'}}
          />
          <Tab.Item
            title="Clothing"
            titleStyle={{fontSize: 12, color: 'black'}}
          />
          <Tab.Item
            title="Electronics"
            titleStyle={{fontSize: 12, color: 'black'}}
          />
          <Tab.Item
            title="Miscellaneous"
            titleStyle={{fontSize: 12, color: 'black'}}
          />
        </Tab> */}
      </View>

      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}
      >
        <SearchBar
          lightTheme={true}
          round={true}
          showCancel={true}
          containerStyle={{
            width: '80%',
            backgroundColor: 'white',
            borderBottomWidth: 0,
            borderTopWidth: 0,
          }}
          inputContainerStyle={{borderRadius: 30, backgroundColor: '#F2F0F0'}}
          placeholder="Search"
          onChangeText={updateSearch}
          value={search}
        />
        <Icon
          name="sort"
          size={30}
          onPress={() => setModalVisible(true)}
        ></Icon>
      </View>

      <Card.Divider />
      <SearchList
        navigation={navigation}
        search={search}
        setSearch={setSearch}
        selectedSortOption={selectedSortOptions}
        category={''}
      />
      {/* <TabView
        value={searchIndex}
        onChange={setSearchIndex}
        animationType="spring"
      >
        <TabView.Item style={{width: '100%'}}>
          <SearchList
            navigation={navigation}
            search={search}
            setSearch={setSearch}
            selectedSortOption={selectedSortOptions}
            category={''}
          />
        </TabView.Item>
        <TabView.Item style={{backgroundColor: 'none', width: '100%'}}>
          <SearchList
            navigation={navigation}
            search={search}
            setSearch={setSearch}
            selectedSortOption={selectedSortOptions}
            category={categoryList[1]}
          />
        </TabView.Item>
        <TabView.Item style={{backgroundColor: 'none', width: '100%'}}>
          <SearchList
            navigation={navigation}
            search={search}
            setSearch={setSearch}
            selectedSortOption={selectedSortOptions}
            category={categoryList[0]}
          />
        </TabView.Item>
        <TabView.Item style={{backgroundColor: 'none', width: '100%'}}>
          <SearchList
            navigation={navigation}
            search={search}
            setSearch={setSearch}
            selectedSortOption={selectedSortOptions}
            category={categoryList[2]}
          />
        </TabView.Item>
        <TabView.Item style={{backgroundColor: 'none', width: '100%'}}>
          <SearchList
            navigation={navigation}
            search={search}
            setSearch={setSearch}
            selectedSortOption={selectedSortOptions}
            category={categoryList[3]}
          />
        </TabView.Item>
      </TabView> */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        style={{flex: 1}}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setModalVisible(false);
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          >
            <View
              style={{
                width: '80%',
                height: 300,
                borderRadius: 10,
                backgroundColor: '#fff',
              }}
            >
              <TouchableOpacity
                style={styles.sortOptions}
                onPress={() => {
                  setSelectedSortoptions('Newest');
                  setModalVisible(false);
                }}
              >
                <Text
                  style={selectedSortOptions === 'Newest' && styles.selected}
                >
                  Newest
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sortOptions}
                onPress={() => {
                  setSelectedSortoptions('Oldest');
                  setModalVisible(false);
                }}
              >
                <Text
                  style={selectedSortOptions === 'Oldest' && styles.selected}
                >
                  Oldest
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sortOptions}
                onPress={() => {
                  setSelectedSortoptions('titleAsc');
                  setModalVisible(false);
                }}
              >
                <Text
                  style={selectedSortOptions === 'titleAsc' && styles.selected}
                >
                  Title (A-Z)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sortOptions}
                onPress={() => {
                  setSelectedSortoptions('titleDesc');
                  setModalVisible(false);
                }}
              >
                <Text
                  style={selectedSortOptions === 'titleDesc' && styles.selected}
                >
                  Title (Z-A)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sortOptions}
                onPress={() => {
                  setSelectedSortoptions('Most-popular');
                  setModalVisible(false);
                }}
              >
                <Text
                  style={
                    selectedSortOptions === 'Most-popular' && styles.selected
                  }
                >
                  Most popular
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sortOptions}
                onPress={() => {
                  setSelectedSortoptions('Least-popular');
                  setModalVisible(false);
                }}
              >
                <Text
                  style={
                    selectedSortOptions === 'Least-popular' && styles.selected
                  }
                >
                  Least popular
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  title: {
    marginTop: 25,
    marginBottom: 15,
    marginHorizontal: 25,
    fontSize: 25,
    fontWeight: 'bold',
    color: primaryColour,
  },
  logIn: {
    marginTop: 25,
    marginBottom: 15,
    marginHorizontal: 25,
    color: primaryColour,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sortOptions: {
    width: '100%',
    height: 50,
    borderBottomWidth: 0.5,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  selected: {
    color: primaryColour,
  },
});

Search.propTypes = {
  navigation: PropTypes.object,
};

export default Search;

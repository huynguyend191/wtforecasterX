import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, Modal, TouchableWithoutFeedback, TouchableOpacity, AsyncStorage, RefreshControl, ScrollView, ActivityIndicator} from 'react-native';
import SearchCity from './SearchCity';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CityWeather from './CityWeather';

class Multi extends Component {
  state = {
    showSearch: false,
    cities: [],
    loading: false
  }
  componentDidMount() {
    this.getCityList();
  }
  
  showSearch = () => {
    this.setState({
      showSearch: true
    })
  }
  hideSearch =() => {
    this.setState({
      showSearch: false
    })
  }
  getCityList = async () => {
    this.setState({
      loading: true
    })
    try {
      const cities = await AsyncStorage.getItem('cities');
      if (cities) {
        this.setState({
          cities: JSON.parse(cities)
        })
      }
      this.setState({
        loading: false
      });
    } catch {
      this.setState({
        loading: false
      });
    }
  }
  removeCity = async (index) => {
    const cities = this.state.cities;
    const newCities = cities.slice(0, index).concat(cities.slice(index + 1, cities.length));
    await AsyncStorage.clear();
    await AsyncStorage.setItem('cities', JSON.stringify(newCities));
    this.setState({
      cities: newCities
    })
  }


  render() {
    let displayWeatherInfo = null;
    if (!this.state.loading) {
      if (this.state.cities.length === 0) {
        displayWeatherInfo = <Text style={styles.noLocationText}>No location added</Text>
      } else {
        const cities = this.state.cities;
        displayWeatherInfo = (
          <FlatList 
            data={cities}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) =>
              <TouchableOpacity onLongPress={() => this.removeCity(index)}>
                <CityWeather 
                  city={item.city}
                  coords={item.coordinate}
                />
              </TouchableOpacity> 
            }
          />
        )
      }
    }
    return (
      <View style={styles.container}>
        <ScrollView 
          refreshControl={
            <RefreshControl
              onRefresh={this.getCityList}
              refreshing={this.state.loading}
            />
          }
        >
          <TouchableOpacity onPress={this.showSearch}> 
            <View style={styles.addLocation}>
              <Icon name="plus" color="white" size={19} />
              <Text style={styles.addLocationText}>Add location</Text>
            </View>
          </TouchableOpacity>
          <Modal
            animationType="fade"
            transparent
            visible={this.state.showSearch}
            onRequestClose={this.hideSearch}
          > 
            <TouchableWithoutFeedback onPress={this.hideSearch}>
              <View style={styles.modalContent}>
                <SearchCity onAddCity={this.hideSearch} onReload={this.getCityList} />
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          {displayWeatherInfo}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 10,
    flex: 1,
  },
  modalContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080'
  },
  addLocation: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
    padding: 5,
    borderColor: 'white',
    borderWidth: 1,
    alignSelf: 'flex-end',
    borderRadius: 5,
    marginBottom: 20
  },
  addLocationText: {
    color: 'white',
    marginLeft: 5
  },
  noLocationText: {
    color: 'white',
    fontSize: 18,
    alignSelf: 'center',
    marginTop: '60%'
  }
});


export default Multi;

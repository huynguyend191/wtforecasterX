import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, AsyncStorage} from 'react-native';
import cityList from '../../../utils/world_coor.json';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class SearchCity extends Component {
  state = {
    value: "",
    data: cityList
  }
  searchFilterFunction = text => {
    this.setState({
      value: text,
    });
    const newData = cityList.filter(item => {
      const itemData = `${item.city.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      data: newData,
    });
  };
  renderItem = ({item}) => (
    <TouchableOpacity onPress={() => this.selectCity(item)}>
      <View style={styles.cityContainer}>
        <Text style={styles.cityName}>{item.city}</Text>
      </View>
    </TouchableOpacity> 
  )
            
  selectCity = async (city) => {
    try {
      let newCities = [];
      const cities = await AsyncStorage.getItem('cities');
      if(cities != null) {
        newCities = JSON.parse(cities);
        newCities.push(city);
        await AsyncStorage.clear();
        await AsyncStorage.setItem('cities', JSON.stringify(newCities));
        this.props.onReload();
        this.props.onAddCity();
      } else {
        newCities.push(city);
        await AsyncStorage.setItem('cities', JSON.stringify(newCities));
        this.props.onReload();
        this.props.onAddCity();    
      }
    } catch (error) {
      // Error saving data
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <Icon name="magnify" color="gray" size={19} />
          <TextInput        
            placeholder="Type city name here"        
            round        
            onChangeText={text => this.searchFilterFunction(text)}
            autoCorrect={false}         
            value={this.state.value}    
          />   
        </View>
       
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={this.state.data}
          renderItem={this.renderItem}
          getItemLayout={(data, index) => (
            {length: 40, offset: 40 * index, index}
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 400,
    width: 300,
    backgroundColor: '#fff', padding: 20,
    borderRadius: 10
  },
  cityContainer: {
    padding: 2,
    borderTopColor: 'gray',
    borderTopWidth: 1,
    height: 40,
    display: 'flex',
    justifyContent: 'center'
  },
  cityName: {
    fontSize: 14
  },
  searchBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
});


export default SearchCity;
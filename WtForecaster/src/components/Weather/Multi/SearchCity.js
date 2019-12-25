import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, AsyncStorage} from 'react-native';
import cityList from '../../../utils/world_coor.json';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import darkTheme from '../../../utils/constants.js';
import {connect} from 'react-redux'
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
    let styles = this.props.theme == 'light' ? lightStyles : darkStyles;
    let iconColor = this.props.theme === "light" ? '#263144' : darkTheme.textColor;
    return (
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <Icon name="magnify" color="gray" size={19} />
          <TextInput        
            placeholder="Type city name here"      
            placeholderTextColor={iconColor}  
            round        
            onChangeText={text => this.searchFilterFunction(text)}
            autoCorrect={false}         
            value={this.state.value}   
            style={{width: '100%'}} 
          />   
        </View>
       
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={this.state.data}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.selectCity(item)}>
              <View style={styles.cityContainer}>
                <Text style={styles.cityName}>{item.city}</Text>
              </View>
            </TouchableOpacity>
          )}
          getItemLayout={(data, index) => (
            {length: 40, offset: 40 * index, index}
          )}
        />
      </View>
    );
  }
}

const lightStyles = StyleSheet.create({
  container: {
    height: 400,
    width: 320,
    backgroundColor: '#f5f6f6', 
    padding: 20,
    borderRadius: 10
  },
  textInput: {
    width: '100%',
  },
  cityContainer: {
    padding: 2,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
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
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingLeft: 10,
    paddingVertical: 0,
    height: 40,
    borderWidth: 1,
    borderColor: '#ced4e7'
  }
});
const darkStyles = StyleSheet.create({
  container: {
    height: 400,
    width: 320,
    backgroundColor: darkTheme.backgroundColor,
    padding: 20,
    borderRadius: 10
  },
  cityContainer: {
    padding: 2,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    height: 40,
    display: 'flex',
    justifyContent: 'center'
  },
  textInput: {
    width: '100%',
    color: 'white'
  },
  cityName: {
    fontSize: 14,
    color: darkTheme.textColor
  },
  searchBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 18,
    paddingLeft: 10,
    paddingVertical: 0,
    height: 40,
    borderWidth: 1,
    borderColor: '#ced4e7'
  }
});


const mapStateToProps = state => {
  return {
    theme: state.weatherReducer.theme
  }
}
export default connect(mapStateToProps,null)(SearchCity);
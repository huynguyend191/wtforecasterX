import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { fetchCurrentWeather, getCurrentCity } from '../../../store/actions';
import WeatherIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import weatherIconName from '../../../utils/weatherIconName';
import {convertTemp, convertWindSpeed} from '../../../utils/convertUnit';
import darkTheme from '../../../utils/constants';

class Current extends Component {

  componentDidMount() {
    this.onFetchCurrentWeather();
  }

  onFetchCurrentWeather = () => {
    navigator.geolocation.getCurrentPosition(positon => {
      const coords =  {
        latitude: positon.coords.latitude,
        longitude: positon.coords.longitude
      };
      this.props.getCurrentCity(coords);
      this.props.fetchCurrentWeather(coords);
    }, error => {
      alert('Please turn on your GPS and Internet connection!');
    })
  }

  render() {
    let styles = this.props.theme === "light" ? lightStyles : darkStyles;
    let iconColor = this.props.theme === "light" ? '#263144' : darkTheme.textColor;
    let displayWeatherInfo = (
      <View>
        <Text style={styles.loadingText}>Fetching weather...</Text>
        <ActivityIndicator size="large" color={iconColor} />
      </View>
    );
    let currentLocation = (
      <View style={styles.locationContainer}></View>
    )
    if (!this.props.loadingCurrentCity) {
      if (this.props.currentCity) {
        const currentCity = this.props.currentCity;
        currentLocation = (
          <View style={styles.locationContainer}>
            <WeatherIcon name="map-marker" size={19} color={iconColor}  />
            <Text style={styles.location}>{currentCity}</Text>
          </View>      
        )
      }
    }
    if (!this.props.loadingCurrentWeather ) {
      if (this.props.currentWeather) {
        const currentWeather = this.props.currentWeather;
        displayWeatherInfo = (
          <ScrollView
            refreshControl={
              <RefreshControl
                onRefresh={this.onFetchCurrentWeather}
              />
            }
            style={styles.weather}
          >
            {currentLocation}
            <Text style={styles.date}>{new Date(currentWeather.current.time).toDateString()}</Text>
            <View style={styles.mainDisplay}>
              <View style={styles.displayTemp}>
                <Text style={styles.temp}>{convertTemp(currentWeather.current.temp, this.props.tempUnit)}&#176;</Text>
                <View><WeatherIcon name={weatherIconName[currentWeather.current.icon]} size={60} color={iconColor}  /></View>
              </View>
              <View style={styles.displayRtemp}>
                <Text style={styles.realTemp}>Real Feel: {convertTemp(currentWeather.current.apparentTemp, this.props.tempUnit)}&#176;</Text>
                <Text style={styles.summary}>{currentWeather.current.summary}</Text>
              </View>
            </View>
            <View style={styles.detailInfo}>
              <View style={styles.detailItem}>
                <View style={styles.detailLabel}> 
                  <WeatherIcon name="water-percent" color={iconColor}  size={19} />
                  <Text style={styles.detailLabelText}>Humidity</Text>
                </View>
                <Text style={styles.detailData}>{Math.round(Number(currentWeather.current.humidity) * 100)}%</Text>
              </View>
              <View style={styles.detailItem}>
                <View style={styles.detailLabel}> 
                  <WeatherIcon name="white-balance-sunny" color={iconColor}  size={19} />
                  <Text style={styles.detailLabelText}>UV index</Text>
                </View>
                <Text style={styles.detailData}>{currentWeather.current.uvIndex}</Text>
              </View>
              <View style={styles.detailItem}>
                <View style={styles.detailLabel}> 
                  <WeatherIcon name="wind-turbine" color={iconColor}  size={19} />
                  <Text style={styles.detailLabelText}>Wind speed</Text>
                </View>
                <Text style={styles.detailData}>{convertWindSpeed(currentWeather.current.windSpeed,this.props.speedUnit)} {this.props.speedUnit}</Text>
              </View>
              <View style={styles.detailItem}>
                <View style={styles.detailLabel}>  
                  <WeatherIcon name="weather-rainy" color={iconColor}  size={19} />
                  <Text style={styles.detailLabelText}>Rain probability</Text>
                </View>
                <Text style={styles.detailData}>{Math.round(Number(currentWeather.current.precipProbability) * 100)}%</Text>
              </View>
              <View style={styles.detailItem}>
                <View style={styles.detailLabel}> 
                  <WeatherIcon name="gauge" color={iconColor}  size={19} />
                  <Text style={styles.detailLabelText}>Pressure</Text>
                </View>
                <Text style={styles.detailData}>{currentWeather.current.pressure} Pa</Text>
              </View>
            </View>
          </ScrollView>
        )
      } else {
        displayWeatherInfo = (
          <ScrollView
            refreshControl={
              <RefreshControl
                onRefresh={this.onFetchCurrentWeather}
              />
            }
            style={styles.weather}
          >
            <View>
              <Text style={styles.error}>Error connection. Please refresh.</Text>
            </View>
          </ScrollView>
          
        )
      }
    }
    return (
      <View style={styles.weatherContainer}>
        {displayWeatherInfo}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentWeather: state.weatherReducer.currentWeather,
    loadingCurrentWeather: state.weatherReducer.loadingCurrentWeather,
    currentCity: state.placesReducer.currentCity,
    loadingCurrentCity: state.placesReducer.loadingCurrentCity,
    tempUnit: state.weatherReducer.tempUnit,
    speedUnit: state.weatherReducer.speedUnit,
    theme: state.weatherReducer.theme
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchCurrentWeather: (coords) => dispatch(fetchCurrentWeather(coords)),
    getCurrentCity: (coords) => dispatch(getCurrentCity(coords))
  }
}

const lightStyles = StyleSheet.create({
  weatherContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    // paddingHorizontal: 20
  },
  weather: {
    flex: 1
  },
  mainDisplay: {
    display: 'flex',
    marginVertical: 20,
    marginHorizontal: 20,
    flex: 1,
    width: 324,
    backgroundColor: '#f7f7f7',
    elevation: 5,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  temp: {
    color: '#263144',
    fontSize: 87,
    padding: 0,
    includeFontPadding: false
  },
  summary: {
    color: '#263144',
    fontSize: 14
  },
  realTemp: {
    color: '#263144',
    fontSize: 14
  },
  detailInfo: {
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 60
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  detailLabel: {
    display: 'flex',
    flexDirection: 'row'
  },
  detailLabelText: {
    color: '#263144',
    marginLeft: 5
  },
  detailData: {
    color: '#263144',
  },
  date: {
    color: '#263144',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 30,
  },
  locationContainer: {
    height: 25,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 45
  },
  location: {
    color: '#263144',
    fontSize: 20,
    marginLeft: 3,
    fontWeight: 'bold'
  },
  error: {
    color: '#263144',
    fontSize: 18,
    marginTop: 250,
    textAlign: 'center'
  },
  loadingText: {
    color: '#263144',
    marginBottom: 5,
    textAlign: 'center'
  },
  displayTemp: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  displayRtemp: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
const darkStyles = StyleSheet.create({
  weatherContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    // paddingHorizontal: 20
  },
  weather: {
    flex: 1
  },
  mainDisplay: {
    display: 'flex',
    marginVertical: 20,
    marginHorizontal: 20,
    flex: 1,
    width: 324,
    backgroundColor: darkTheme.cardColor,
    elevation: 5,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  temp: {
    color: darkTheme.textColor,
    fontSize: 87,
    padding: 0,
    includeFontPadding: false
  },
  summary: {
    color: darkTheme.textColor,
    fontSize: 14
  },
  realTemp: {
    color: darkTheme.textColor,
    fontSize: 14
  },
  detailInfo: {
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 60
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  detailLabel: {
    display: 'flex',
    flexDirection: 'row'
  },
  detailLabelText: {
    color: darkTheme.textColor,
    marginLeft: 5
  },
  detailData: {
    color: darkTheme.textColor ,
  },
  date: {
    color: darkTheme.textColor ,
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 30,
  },
  locationContainer: {
    height: 25,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 45
  },
  location: {
    color: darkTheme.textColor,
    fontSize: 20,
    marginLeft: 3,
    fontWeight: 'bold'
  },
  error: {
    color: darkTheme.textColor ,
    fontSize: 18,
    marginTop: 250,
    textAlign: 'center'
  },
  guide: {
    color: 'white',
    fontSize: 14,
    marginTop: 12
  },    
  loadingText: {
    color: darkTheme.textColor ,
    marginBottom: 5,
    textAlign: 'center'
  },
  displayTemp: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  displayRtemp: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Current);

import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { fetchCurrentWeather, getCurrentCity } from '../../../store/actions';
import WeatherIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import weatherIconName from '../../../utils/weatherIconName';
import {convertTemp} from '../../../utils/convertTemp';

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
    let displayWeatherInfo = (
      <View>
        <Text style={styles.loadingText}>Fetching weather...</Text>
        <ActivityIndicator size="large" color="white" />
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
            <WeatherIcon name="map-marker" size={19} color="white" />
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
              <WeatherIcon name={weatherIconName[currentWeather.current.icon]} size={120} color="white" />
              <Text style={styles.temp}>{convertTemp(currentWeather.current.temp, this.props.unit)}&#176;</Text>
            </View>
            <Text style={styles.realTemp}>Real Feel: {convertTemp(currentWeather.current.apparentTemp, this.props.unit)}&#176;</Text>
            <Text style={styles.summary}>{currentWeather.current.summary}</Text>
            <View style={styles.detailInfo}>
              <View style={styles.detailItem}>
                <View style={styles.detailLabel}> 
                  <WeatherIcon name="water-percent" color="white" size={19} />
                  <Text style={styles.detailLabelText}>Humidity</Text>
                </View>
                <Text style={styles.detailData}>{Math.round(Number(currentWeather.current.humidity) * 100)}%</Text>
              </View>
              <View style={styles.detailItem}>
                <View style={styles.detailLabel}> 
                  <WeatherIcon name="white-balance-sunny" color="white" size={19} />
                  <Text style={styles.detailLabelText}>UV index</Text>
                </View>
                <Text style={styles.detailData}>{currentWeather.current.uvIndex}</Text>
              </View>
              <View style={styles.detailItem}>
                <View style={styles.detailLabel}> 
                  <WeatherIcon name="wind-turbine" color="white" size={19} />
                  <Text style={styles.detailLabelText}>Wind speed</Text>
                </View>
                <Text style={styles.detailData}>{currentWeather.current.windSpeed} mph</Text>
              </View>
              <View style={styles.detailItem}>
                <View style={styles.detailLabel}> 
                  <WeatherIcon name="weather-rainy" color="white" size={19} />
                  <Text style={styles.detailLabelText}>Rain probability</Text>
                </View>
                <Text style={styles.detailData}>{Math.round(Number(currentWeather.current.precipProbability) * 100)}%</Text>
              </View>
              <View style={styles.detailItem}>
                <View style={styles.detailLabel}> 
                  <WeatherIcon name="gauge" color="white" size={19} />
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
              <Text style={styles.error}>Something went wrong</Text>
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
    unit: state.weatherReducer.unit
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchCurrentWeather: (coords) => dispatch(fetchCurrentWeather(coords)),
    getCurrentCity: (coords) => dispatch(getCurrentCity(coords))
  }
}

const styles = StyleSheet.create({
  weatherContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  weather: {
    flex: 1
  },
  mainDisplay: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20
  },
  temp: {
    color: 'white',
    fontSize: 90,
    marginLeft: 20
  },
  summary: {
    color: 'white',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 18
  },
  realTemp: {
    color: 'white',
    textAlign: 'right',
    fontSize: 13
  },
  detailInfo: {
    borderTopWidth: 1,
    borderTopColor: 'white',
    marginTop: 30,
    paddingVertical: 20
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
    color: 'white',
    marginLeft: 5
  },
  detailData: {
    color: 'white',
  },
  date: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
  },
  locationContainer: {
    height: 25,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 45
  },
  location: {
    color: 'white',
    fontSize: 18,
    marginLeft: 3
  },
  error: {
    color: 'white',
    fontSize: 18,
    marginTop: 250
  },
  loadingText: {
    color: 'white',
    marginBottom: 5
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Current);
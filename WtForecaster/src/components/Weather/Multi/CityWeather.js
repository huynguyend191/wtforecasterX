import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import WeatherIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import weatherIconName from '../../../utils/weatherIconName';
import { connect } from 'react-redux';
import {convertTemp} from '../../../utils/convertTemp';
import axios from '../../../utils/axiosConfig';

class CityWeather extends Component {
  state = {
    scaleValue: new Animated.Value(0.01),
    weather: {
      date: null,
      temp: null,
      humidity: null,
      summary: null,
      rainProb: null,
      uvIndex: null,
      windSpeed: null,
      icon: 'partly-cloudy-day'
    }
  }
  componentDidMount() {
    Animated.timing(this.state.scaleValue, {
        toValue: 1,
        duration : 600,
        delay: this.props.index * 650
    }).start();
    this.fetchCurrentWeather();
  }
  fetchCurrentWeather = () => {
    const coords = this.props.coords;
    axios.get(`/weather/Current?longitude=${coords.longitude}&latitude=${coords.latitude}`)
    .then(result => {
      const data = result.data.weatherInfor.current;
      this.setState({
        weather: {
          date: new Date(data.time).toDateString(),
          temp: data.temp,
          icon: data.icon,
          humidity: data.humidity,
          rainProb: data.precipProbability,
          summary: data.summary,
          uvIndex: data.uvIndex,
          windSpeed: data.windSpeed
        }
      })
    })
    .catch(error => {
      
    })
  }
  render() {
    const weather = this.state.weather;
    return (
      <Animated.View style={[styles.dailyItem, { opacity: this.state.scaleValue }]}>
        <View style={styles.locationContainer}>
          <WeatherIcon name="map-marker" size={19} color="white" />
          <Text style={styles.location}>{this.props.city}</Text>
          </View>      
        <Text style={styles.date}>{weather.date}</Text>
        <View style={styles.mainDisplay}>
          <WeatherIcon name={weatherIconName[weather.icon]} size={50} color="white" />
          <Text style={styles.temp}>{convertTemp(weather.temp, this.props.unit)}&#176;</Text>
        </View>
        <Text style={styles.summary}>{weather.summary}</Text>
        <View style={styles.detailContainer}>
          <View style={styles.detailRow}>
            <WeatherIcon name="weather-rainy" color="white" size={19} />
            <Text style={styles.detailText}>{Math.round(Number(weather.rainProb) * 100)}%</Text>
          </View>
          <View style={styles.detailRow}>
            <WeatherIcon name="water-percent" color="white" size={19} />
            <Text style={styles.detailText}>{Math.round(Number(weather.humidity) * 100)}%</Text>
          </View>
        </View>
        <View style={styles.detailContainer}>
          <View style={styles.detailRow}>
            <WeatherIcon name="wind-turbine" color="white" size={19} />
            <Text style={styles.detailText}>{weather.windSpeed} mph</Text>
          </View>
          <View style={styles.detailRow}> 
            <WeatherIcon name="white-balance-sunny" color="white" size={19} />
            <Text style={styles.detailText}>{weather.uvIndex}</Text>
          </View>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  dailyItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    marginHorizontal: 10
  },
  date: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold'
  },
  summary: {
    textAlign: 'center',
    fontSize: 12,
    color: 'white',
    marginVertical: 3
  },
  mainDisplay: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  temp: {
    color: 'white',
    fontSize: 35,
    marginLeft: 20
  },
  detailContainer: {
    alignItems: 'center',
    margin: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'    
  },
  detailRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '25%'
  },
  detailText: {
    color: 'white',
    marginLeft: 10
  },
  locationContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5
  },
  location: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 3
  },
})

const mapStateToProps = state => {
  return {
    unit: state.weatherReducer.unit
  }
}

export default connect(mapStateToProps, null)(CityWeather);
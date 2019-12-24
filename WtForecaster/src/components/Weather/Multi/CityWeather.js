import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import WeatherIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import weatherIconName from '../../../utils/weatherIconName';
import { connect } from 'react-redux';
import {convertTemp, convertWindSpeed} from '../../../utils/convertUnit';
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
      icon: 'partly-cloudy-day',
      apparentTemp: null
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
          windSpeed: data.windSpeed,
          apparentTemp: data.apparentTemp
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
          <WeatherIcon name="map-marker" size={19} color="#263144" />
          <Text style={styles.location}>{this.props.city}</Text>
          </View>      
        <View style={styles.mainDisplay}>
          <WeatherIcon name={weatherIconName[weather.icon]} size={65} color="#263144" />
          <View style={styles.info}>
            <Text style={styles.date}>{weather.date}</Text>
            <View style={styles.tempContainer}>
              <Text style={styles.tempMax}>{convertTemp(weather.temp, this.props.tempUnit)}&#176;</Text>
              <Text style={styles.tempMin}>{convertTemp(weather.apparentTemp, this.props.tempUnit)}&#176;</Text>
            </View>
            <View>
              <Text style={styles.summary}>{weather.summary}</Text>
            </View>
          </View>
        </View>
        <View style={styles.detailContainer}>
          <View style={styles.detailRow}>
            <WeatherIcon name="weather-rainy" color="#263144" size={19} />
            <Text style={styles.detailText}>{Math.round(Number(weather.rainProb) * 100)}%</Text>
          </View>
          <View style={styles.detailRow}>
            <WeatherIcon name="water-percent" color="#263144" size={19} />
            <Text style={styles.detailText}>{Math.round(Number(weather.humidity) * 100)}%</Text>
          </View>
          <View style={styles.detailRow}>
            <WeatherIcon name="wind-turbine" color="#263144" size={19} />
            <Text style={styles.detailText}>{convertWindSpeed(weather.windSpeed,this.props.speedUnit)} {this.props.speedUnit}</Text>
          </View>
          <View style={styles.detailRow}> 
            <WeatherIcon name="white-balance-sunny" color="#263144" size={19} />
            <Text style={styles.detailText}>{weather.uvIndex}</Text>
          </View>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  dailyItem: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 5,
    padding: 10,
    elevation: 5
  },
  date: {
    fontSize: 16,
    color: '#263144',
    fontWeight: 'bold'
  },
  summary: {
    fontSize: 12,
    color: '#263144',
    marginVertical: 3,
    fontWeight: '100'
  },
  mainDisplay: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 5
  },
  tempMax: {
    color: '#263144',
    fontSize: 48,
  },
  tempMin: {
    color: '#ced4e7',
    fontSize: 48,
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
    marginHorizontal: 10
  },
  detailText: {
    color: '#263144',
    marginLeft: 3
  },
  locationContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5
  },
  location: {
    color: '#263144',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 3
  },
  info: {
    width: 147
  },
  tempContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
})

const mapStateToProps = state => {
  return {
    tempUnit: state.weatherReducer.tempUnit,
    speedUnit: state.weatherReducer.speedUnit
  }
}

export default connect(mapStateToProps, null)(CityWeather);
import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import WeatherIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import weatherIconName from '../../../utils/weatherIconName';

class DailyItem extends Component {
  state = {
    scaleValue: new Animated.Value(0.01)
  }
  componentDidMount() {
    Animated.timing(this.state.scaleValue, {
        toValue: 1,
        duration : 600,
        delay: this.props.index * 650
    }).start();
  }
  render() {
    return (
      <Animated.View style={[styles.dailyItem, { opacity: this.state.scaleValue }]}>
        <Text style={styles.date}>{this.props.date}</Text>
        <View style={styles.mainDisplay}>
          <WeatherIcon name={weatherIconName[this.props.icon]} size={50} color="white" />
          <Text style={styles.temp}>{this.props.tempMax}&#176; | {this.props.tempMin}&#176;</Text>
        </View>
        <Text style={styles.summary}>{this.props.summary}</Text>
        <View style={styles.detailContainer}>
          <View style={styles.detailRow}>
            <WeatherIcon name="weather-rainy" color="white" size={19} />
            <Text style={styles.detailText}>{Math.round(Number(this.props.rainProb) * 100)}%</Text>
          </View>
          <View style={styles.detailRow}>
            <WeatherIcon name="water-percent" color="white" size={19} />
            <Text style={styles.detailText}>{Math.round(Number(this.props.humidity) * 100)}%</Text>
          </View>
        </View>
        <View style={styles.detailContainer}>
          <View style={styles.detailRow}>
            <WeatherIcon name="wind-turbine" color="white" size={19} />
            <Text style={styles.detailText}>{this.props.windSpeed} mph</Text>
          </View>
          <View style={styles.detailRow}> 
            <WeatherIcon name="white-balance-sunny" color="white" size={19} />
            <Text style={styles.detailText}>{this.props.uvIndex}</Text>
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
  }
})

export default DailyItem;
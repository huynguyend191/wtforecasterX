import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import WeatherIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import weatherIconName from '../../../utils/weatherIconName';

class HourlyItem extends Component {
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
      <Animated.View style={[styles.hourlyItem, { opacity: this.state.scaleValue }]}>
        <Text style={styles.hour}>{this.props.time}</Text>
        <View style={styles.tempContainer}>
          <WeatherIcon name={weatherIconName[this.props.icon]} size={40} color="#263144" />
          <Text style={styles.temp}>{this.props.temp}&#176;</Text>
        </View>
        <View style={styles.detailRow}>
            <WeatherIcon name="weather-rainy" color="gray" size={19} />
            <Text style={styles.detailText}>{Math.round(Number(this.props.rainProb) * 100)}%</Text>
          </View>
        <View style={styles.detailRow}>
          <WeatherIcon name="water-percent" color="gray" size={19} />
          <Text style={styles.detailText}>{Math.round(Number(this.props.humidity) * 100)}%</Text>
        </View>
        <View style={styles.detailRow}>
          <WeatherIcon name="wind-turbine" color="gray" size={19} />
          <Text style={styles.detailText}>{this.props.windSpeed} {this.props.speedUnit}</Text>
        </View>
        <View style={styles.detailRow}> 
          <WeatherIcon name="white-balance-sunny" color="gray" size={19} />
          <Text style={styles.detailText}>{this.props.uvIndex}</Text>
        </View>
        <View style={styles.summaryContainer}>
          <Text style={styles.summary}>{this.props.summary}</Text>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  hourlyItem: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    marginHorizontal: 3,
    width: 110,
    paddingVertical: 10,
    elevation: 5,
  },
  hour: {
    textAlign: 'center',
    color: '#263144',
    marginBottom: 20,
    fontSize: 16,
    fontWeight: 'bold'
  },
  tempContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
    paddingBottom: 20,
    marginBottom: 20
  },
  temp: {
    color: '#263144',
    fontSize: 28,
    marginLeft: 3
  },
  detailRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7
  },
  detailText: {
    color: 'gray'
  },
  summaryContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ffffff',
    marginTop: 13,
    paddingTop: 15
  },
  summary: {
    color: '#263144',
    textAlign: 'center'
  }
})

export default HourlyItem;
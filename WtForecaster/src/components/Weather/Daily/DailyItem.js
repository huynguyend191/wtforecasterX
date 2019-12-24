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
        <View style={styles.mainDisplay}>
          <WeatherIcon name={weatherIconName[this.props.icon]} size={65} color="#263144" />
          <View style={styles.info}>
            <Text style={styles.date}>{this.props.date}</Text>
            <View style={styles.tempContainer}>
              <Text style={styles.tempMax}>{this.props.tempMax}&#176;</Text>
              <Text style={styles.tempMin}>{this.props.tempMin}&#176;</Text>
            </View>
            <View>
              <Text style={styles.summary}>{this.props.summary}</Text>
            </View>
          </View>
        </View>
        <View style={styles.detailContainer}>
          <View style={styles.detailRow}>
            <WeatherIcon name="weather-rainy" color="#263144" size={19} />
            <Text style={styles.detailText}>{Math.round(Number(this.props.rainProb) * 100)}%</Text>
          </View>
          <View style={styles.detailRow}>
            <WeatherIcon name="water-percent" color="#263144" size={19} />
            <Text style={styles.detailText}>{Math.round(Number(this.props.humidity) * 100)}%</Text>
          </View>
          <View style={styles.detailRow}>
            <WeatherIcon name="wind-turbine" color="#263144" size={19} />
            <Text style={styles.detailText}>{this.props.windSpeed} {this.props.speedUnit}</Text>
          </View>
          <View style={styles.detailRow}> 
            <WeatherIcon name="white-balance-sunny" color="#263144" size={19} />
            <Text style={styles.detailText}>{this.props.uvIndex}</Text>
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
    marginBottom: 10,
    padding: 20,
    marginHorizontal: 5,
    marginVertical: 5,
    width: 312,
    elevation: 5
  },
  date: {
    fontSize: 18,
    color: '#263144',
    fontWeight: 'bold'
  },
  summary: {
    fontSize: 12,
    color: '#263144',
    marginVertical: 3,
    flexWrap: 'wrap',
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
    marginRight: 10
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
    justifyContent: 'center'    
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
  tempContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  info: {
    width: 147
  }
})

export default DailyItem;
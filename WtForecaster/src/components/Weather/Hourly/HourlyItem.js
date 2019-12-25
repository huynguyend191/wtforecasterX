import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import WeatherIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import weatherIconName from '../../../utils/weatherIconName';
import {connect} from 'react-redux'
import darkTheme from '../../../utils/constants';
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
    let styles = this.props.theme === 'light' ? lightStyles : darkStyles;
    let iconColor = this.props.theme === 'light' ? '#263144' : darkTheme.textColor;
    return (
      <Animated.View style={[styles.hourlyItem, { opacity: this.state.scaleValue }]}>
        <Text style={styles.hour}>{this.props.time}</Text>
        <View style={styles.tempContainer}>
          <WeatherIcon name={weatherIconName[this.props.icon]} size={40} color={iconColor} />
          <Text style={styles.temp}>{this.props.temp}&#176;</Text>
        </View>
        <View style={styles.detailRow}>
          <WeatherIcon name="weather-rainy" color={iconColor} size={19} />
            <Text style={styles.detailText}>{Math.round(Number(this.props.rainProb) * 100)}%</Text>
          </View>
        <View style={styles.detailRow}>
          <WeatherIcon name="water-percent" color={iconColor} size={19} />
          <Text style={styles.detailText}>{Math.round(Number(this.props.humidity) * 100)}%</Text>
        </View>
        <View style={styles.detailRow}>
          <WeatherIcon name="wind-turbine" color={iconColor} size={19} />
          <Text style={styles.detailText}>{this.props.windSpeed} {this.props.speedUnit}</Text>
        </View>
        <View style={styles.detailRow}> 
          <WeatherIcon name="white-balance-sunny" color={iconColor} size={19} />
          <Text style={styles.detailText}>{this.props.uvIndex}</Text>
        </View>
        <View style={styles.summaryContainer}>
          <Text style={styles.summary}>{this.props.summary}</Text>
        </View>
      </Animated.View>
    );
  }
}
const mapStateToProps = state => {
  return {
    theme: state.weatherReducer.theme
  }
}
const lightStyles = StyleSheet.create({
  hourlyItem: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    marginVertical: 10,
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
    borderBottomColor: '#ced4e7',
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
    color: '#263144',
    fontWeight: '100'
  },
  summaryContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ced4e7',
    marginTop: 5,
    paddingTop: 15
  },
  summary: {
    color: '#263144',
    textAlign: 'center'
  }
})
const darkStyles = StyleSheet.create({
  hourlyItem: {
    backgroundColor: darkTheme.cardColor,
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
    marginHorizontal: 3,
    width: 110,
    paddingVertical: 10,
    elevation: 5,
  },
  hour: {
    textAlign: 'center',
    color: darkTheme.textColor,
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
    borderBottomColor: '#ced4e7',
    paddingBottom: 20,
    marginBottom: 20
  },
  temp: {
    color: darkTheme.textColor,
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
    color: darkTheme.textColor,
    fontWeight: '100'
  },
  summaryContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ced4e7',
    marginTop: 5,
    paddingTop: 15
  },
  summary: {
    color: darkTheme.textColor,
    textAlign: 'center'
  }
})

export default connect(mapStateToProps, null)(HourlyItem);
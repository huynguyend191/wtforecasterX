import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, RefreshControl, ScrollView, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { fetchHourlyWeather } from '../../../store/actions';
import WeatherIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import weatherIconName from '../../../utils/weatherIconName';
import HourlyItem from './HourlyItem';
import { convertTemp, convertWindSpeed, convertTimeFormat } from '../../../utils/convertUnit';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryArea } from 'victory-native';
import {getHourlyData, getHourlyLabel} from '../../../utils/getChartData';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import darkTheme from '../../../utils/constants';
class Hourly extends Component {
  componentDidMount() {
    this.onFetchHourlyWeather();
  }
  onFetchHourlyWeather = () => {
    navigator.geolocation.getCurrentPosition(positon => {
      const coords =  {
        latitude: positon.coords.latitude,
        longitude: positon.coords.longitude
      };
      this.props.fetchHourlyWeather(coords);
    }, error => {
      alert('Please turn on your GPS and Internet connection!');
    })
  }
  render() {
    let styles = this.props.theme === 'light' ? lightStyles : darkStyles;
    let iconColor = this.props.theme === "light" ? '#263144' : darkTheme.textColor;
    let stopColor = this.props.theme === 'light' ? '#1E93FA' : darkTheme.stopColor;
    let displayWeatherInfo = (
      <View>
        <Text style={styles.loadingText}>Fetching weather...</Text>
        <ActivityIndicator size="large" color={iconColor} />
      </View>
    );
    if (!this.props.loadingHourlyWeather ) {
      if (this.props.hourlyWeather) {
        const hourlyWeather = this.props.hourlyWeather;
        const chartData = getHourlyData(hourlyWeather.hourlyForecast.filter((a,i)=>i%2===0), this.props.tempUnit);
        const chartLabel = getHourlyLabel(hourlyWeather.hourlyForecast.filter((a,i)=>i%2===0), this.props.timeFormat);
        displayWeatherInfo = (
          <ScrollView
            refreshControl={
              <RefreshControl
                onRefresh={this.onFetchHourlyWeather}
              />
            }
            style={styles.weather}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.hourlySummary}>
              <View style={styles.summaryTitleContainer}>
                <WeatherIcon name="clock-outline" size={19} color={iconColor} />
                <Text style={styles.summaryTitle}>HOURLY SUMMARY</Text>
              </View>    
              <View style={styles.summaryContent}>
                <Text style={styles.summary}>{hourlyWeather.hourlySummary}</Text>
                <WeatherIcon name={weatherIconName[hourlyWeather.hourlyIcon]} size={50} color={iconColor} />
              </View>
            </View>
            <FlatList 
              // showsHorizontalScrollIndicator={false}
              horizontal
              data={hourlyWeather.hourlyForecast.filter((a,i)=>i%2===0)} //take every 2 hour
              keyExtractor={(item, index) => item.time}
              indicatorStyle={iconColor}
              renderItem={({item}) => 
                <HourlyItem 
                  time={convertTimeFormat(item.time, this.props.timeFormat)}
                  summary={item.summary}
                  icon={item.icon}
                  rainProb={item.precipProbability}
                  humidity={item.humidity}
                  windSpeed={convertWindSpeed(item.windSpeed,this.props.speedUnit)}
                  speedUnit={this.props.speedUnit}
                  uvIndex={item.uvIndex}
                  temp={convertTemp(item.temp, this.props.tempUnit)}
                  index={item.index}
                />
              }
            />
            <View style={styles.container} pointerEvents='none'>
              <View style={styles.chartNameContainer}>
                <WeatherIcon name="chart-line" size={17} color={iconColor} />
                <Text style={styles.chartName}>Temperature Chart</Text>
              </View>   
              <VictoryChart>
                <Defs>
                  <LinearGradient id="gradientStroke"
                    x1="0%"
                    x2="0%"
                    y1="0%"
                    y2="100%"
                  >
                    <Stop offset="0%" stopColor={stopColor} stopOpacity="0.5" />
                    <Stop offset="70%" stopColor={stopColor} stopOpacity="0.1" />
                  </LinearGradient>
                </Defs>
                <VictoryArea
                  style={{
                    data: { stroke: stopColor,color: iconColor, fill: "url(#gradientStroke)"},
                  }}
                  data={chartData}
                  categories={chartLabel}
                />
                <VictoryAxis
                  style={{
                    axis: {stroke: "none"},
                    tickLabels: {fontSize: 10, fill: iconColor},
                  }}
                />
                <VictoryAxis dependentAxis
                  style={{
                    axis: {stroke: "none"},
                    tickLabels: {fontSize: 10, fill: iconColor}
                  }}
                />
                
              </VictoryChart>
            </View>
         
          </ScrollView>
        )
      } else {
        displayWeatherInfo = (
          <ScrollView
            refreshControl={
              <RefreshControl
                onRefresh={this.onFetchHourlyWeather}
              />
            }
            style={styles.errorContainer}
          >
            <View>
              <Text style={styles.error}>Error connection. Please try again</Text>
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
    hourlyWeather: state.weatherReducer.hourlyWeather,
    loadingHourlyWeather: state.weatherReducer.loadingHourlyWeather,
    tempUnit: state.weatherReducer.tempUnit,
    speedUnit: state.weatherReducer.speedUnit,
    timeFormat: state.weatherReducer.timeFormat,
    theme: state.weatherReducer.theme
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchHourlyWeather: (coords) => dispatch(fetchHourlyWeather(coords))
  }
}

const lightStyles = StyleSheet.create({
  weatherContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 20
  },
  weather: {
    flex: 1,
  },
  hourlySummary: {
    marginVertical: 15,
    width: '100%',
    flex: 1,
    display: 'flex',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  summaryTitle: {
    color: '#263144',
    fontSize: 18,
    textAlign: 'center',
    marginLeft: 4
  },
  summaryContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  summary: {
    color: '#263144',
    flexWrap: 'wrap',
    width: '80%',
  },
  error: {
    color: '#263144',
    fontSize: 18,
    marginTop: 250
  },
  loadingText: {
    color: '#263144',
    marginBottom: 5
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    marginBottom: 20,
    marginTop: 18
  },
  summaryTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  chartName: {
    textAlign: 'center',
    color: '#263144',
    fontSize: 16,
    marginLeft: 3
  },
  chartNameContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  }
});
const darkStyles = StyleSheet.create({
  weatherContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 20
  },
  weather: {
    flex: 1,
  },
  hourlySummary: {
    marginVertical: 15,
    width: '100%',
    flex: 1,
    display: 'flex',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  summaryTitle: {
    color: darkTheme.textColor,
    fontSize: 18,
    textAlign: 'center',
    marginLeft: 4
  },
  summaryContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  summary: {
    color: darkTheme.textColor,
    flexWrap: 'wrap',
    width: '80%',
  },
  error: {
    color: darkTheme.textColor,
    fontSize: 18,
    marginTop: 250
  },
  loadingText: {
    color: '#263144',
    marginBottom: 5
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    marginBottom: 20,
    marginTop: 18
  },
  summaryTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  chartName: {
    textAlign: 'center',
    color: darkTheme.textColor,
    fontSize: 16,
    marginLeft: 3
  },
  chartNameContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  guide: {
    color: 'white',
    fontSize: 14,
    marginTop: 12
  },    
  errorView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(Hourly);
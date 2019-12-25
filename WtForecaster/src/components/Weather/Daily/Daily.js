import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, RefreshControl, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { fetchDailyWeather } from '../../../store/actions';
import WeatherIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import weatherIconName from '../../../utils/weatherIconName';
import DailyItem from './DailyItem';
import {convertTemp, convertWindSpeed} from '../../../utils/convertUnit';
import { VictoryChart, VictoryAxis, VictoryArea } from 'victory-native';
import { getDailyDataMax, getDailyDataMin, getDailyLabel } from '../../../utils/getChartData';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import darkTheme from '../../../utils/constants';

class Daily extends Component {
  componentDidMount() {
    this.onFetchDailyWeather();
  }
  onFetchDailyWeather = () => {
    navigator.geolocation.getCurrentPosition(positon => {
      const coords =  {
        latitude: positon.coords.latitude,
        longitude: positon.coords.longitude
      };
      this.props.fetchDailyWeather(coords);
    }, error => {
      alert('Please turn on your GPS and Internet connection!');
    })
    
  }
  render() {
    let styles = this.props.theme === 'light' ? lightStyles : darkStyles;
    let iconColor = this.props.theme === "light" ? '#263144' : darkTheme.textColor;
    let stopColor = this.props.theme === 'light' ? '#1E93FA' : darkTheme.stopColor;
    console.log("Daily " + this.props.theme)
    let displayWeatherInfo = (
      <View>
        <Text style={styles.loadingText}>Fetching weather...</Text>
        <ActivityIndicator size="large" color={iconColor} />
      </View>
    );
    if (!this.props.loadingDailyWeather ) {
      if (this.props.dailyWeather) {
        const dailyWeather = this.props.dailyWeather;
        const maxTempData = getDailyDataMax(dailyWeather.dailyForecast, this.props.tempUnit);
        const minTempData = getDailyDataMin(dailyWeather.dailyForecast, this.props.tempUnit);
        const chartLabel = getDailyLabel(dailyWeather.dailyForecast);
        displayWeatherInfo = (
          <ScrollView
            refreshControl={
              <RefreshControl
                onRefresh={this.onFetchDailyWeather}
              />
            }
            style={styles.weather}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.dailySummary}>
              <View style={styles.summaryTitleContainer}>
                <WeatherIcon name="calendar-week" size={19} color={iconColor} />
                <Text style={styles.summaryTitle}>DAILY SUMMARY</Text>
              </View>    
              <View style={styles.summaryContent}>
                <Text style={styles.summary}>{dailyWeather.dailySummary}</Text>
                <WeatherIcon name={weatherIconName[dailyWeather.dailyIcon]} size={50} color={iconColor} />
              </View>
            </View>
            <FlatList 
              extraData={this.props}
              data={dailyWeather.dailyForecast}
              keyExtractor={(item, index) => item.date}
              // showsHorizontalScrollIndicator={false}
              indicatorStyle={iconColor}
              horizontal
              renderItem={({item}) => 
                <DailyItem 
                  date={item.date}
                  summary={item.summary}
                  icon={item.icon}
                  rainProb={item.precipProbability}
                  humidity={item.humidity}
                  windSpeed={convertWindSpeed(item.windSpeed, this.props.speedUnit)}
                  uvIndex={item.uvIndex}
                  tempMax={convertTemp(item.temperatureMax, this.props.tempUnit)}
                  tempMin={convertTemp(item.temperatureMin, this.props.tempUnit)}
                  speedUnit={this.props.speedUnit}
                  index={item.index}
                />
              }
            />
            <View style={styles.container} pointerEvents='none'>
              <View style={styles.chartNameContainer}>
                <WeatherIcon name="chart-areaspline" size={17} color={iconColor} />
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
                    data: { stroke: "#ea8655", color: iconColor, fill: this.props.theme === 'light' ? '#f5f6f6' : darkTheme.backgroundColor}, 
                  }}
                  categories={chartLabel}
                  data={maxTempData}
                />
                 <VictoryArea
                  style={{
                    data: { stroke: {stopColor},color: iconColor, fill: "url(#gradientStroke)"},
                  }}
                  data={minTempData}
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
                onRefresh={this.onFetchDailyWeather}
              />
            }
            style={styles.weather}
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
    dailyWeather: state.weatherReducer.dailyWeather,
    loadingDailyWeather: state.weatherReducer.loadingDailyWeather,
    tempUnit: state.weatherReducer.tempUnit,
    speedUnit: state.weatherReducer.speedUnit,
    theme: state.weatherReducer.theme
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchDailyWeather: (coords) => dispatch(fetchDailyWeather(coords))
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
  dailySummary: {
    marginVertical: 15,
    width: '100%',
    flex: 1,
    display: 'flex',
    paddingVertical: 15,
    paddingHorizontal: 10
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
    marginTop: 5
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
  dailySummary: {
    marginVertical: 15,
    width: '100%',
    flex: 1,
    display: 'flex',
    paddingVertical: 15,
    paddingHorizontal: 10
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
    color: darkTheme.textColor,
    marginBottom: 5
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    marginBottom: 20,
    marginTop: 5
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
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(Daily);
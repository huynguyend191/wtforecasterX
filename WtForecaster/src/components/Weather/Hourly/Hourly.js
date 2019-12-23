import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, RefreshControl, ScrollView, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { fetchHourlyWeather } from '../../../store/actions';
import WeatherIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import weatherIconName from '../../../utils/weatherIconName';
import HourlyItem from './HourlyItem';
import { convertTemp, convertWindSpeed, convertTimeFormat } from '../../../utils/convertUnit';
import { VictoryLine, VictoryChart, VictoryAxis } from 'victory-native';
import {getHourlyData, getHourlyLabel} from '../../../utils/getChartData';

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
    console.log("render " + this.props.timeFormat)
    let displayWeatherInfo = (
      <View>
        <Text style={styles.loadingText}>Fetching weather...</Text>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
    if (!this.props.loadingHourlyWeather ) {
      if (this.props.hourlyWeather) {
        const hourlyWeather = this.props.hourlyWeather;
        const chartData = getHourlyData(hourlyWeather.hourlyForecast.filter((a,i)=>i%2===0), this.props.tempUnit);
        const chartLabel = getHourlyLabel(hourlyWeather.hourlyForecast.filter((a,i)=>i%2===0));
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
                <WeatherIcon name="clock-outline" size={19} color="white" />
                <Text style={styles.summaryTitle}>HOURLY SUMMARY</Text>
              </View>    
              <View style={styles.summaryContent}>
                <Text style={styles.summary}>{hourlyWeather.hourlySummary}</Text>
                <WeatherIcon name={weatherIconName[hourlyWeather.hourlyIcon]} size={50} color="white" />
              </View>
            </View>
            <FlatList 
              // showsHorizontalScrollIndicator={false}
              horizontal
              data={hourlyWeather.hourlyForecast.filter((a,i)=>i%2===0)} //take every 2 hour
              keyExtractor={(item, index) => item.time}
              indicatorStyle="white"
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
                <WeatherIcon name="chart-line" size={17} color="white" />
                <Text style={styles.chartName}>Temperature Chart</Text>
              </View>   
              <VictoryChart>
                <VictoryLine
                  style={{
                    data: { stroke: "white", color: "white" },
                  }}
                  data={chartData}
                  categories={chartLabel}
                />
                <VictoryAxis
                  style={{
                    axis: {stroke: "white"},
                    tickLabels: {fontSize: 10, fill: "white"},
                  }}
                />
                <VictoryAxis dependentAxis
                  style={{
                    axis: {stroke: "white"},
                    tickLabels: {fontSize: 10, fill: "white"}
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
    hourlyWeather: state.weatherReducer.hourlyWeather,
    loadingHourlyWeather: state.weatherReducer.loadingHourlyWeather,
    tempUnit: state.weatherReducer.tempUnit,
    speedUnit: state.weatherReducer.speedUnit,
    timeFormat: state.weatherReducer.timeFormat
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchHourlyWeather: (coords) => dispatch(fetchHourlyWeather(coords))
  }
}

const styles = StyleSheet.create({
  weatherContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 5
  },
  weather: {
    flex: 1,
  },
  hourlySummary: {
    marginVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    width: '100%',
    flex: 1,
    display: 'flex',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  summaryTitle: {
    color: 'white',
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
    color: 'white',
    flexWrap: 'wrap',
    width: '80%',
  },
  error: {
    color: 'white',
    fontSize: 18,
    marginTop: 250
  },
  loadingText: {
    color: 'white',
    marginBottom: 5
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: 'white',
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
    color: 'white',
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

export default connect(mapStateToProps, mapDispatchToProps)(Hourly);
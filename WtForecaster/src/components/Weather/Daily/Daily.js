import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, RefreshControl, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { fetchDailyWeather } from '../../../store/actions';
import WeatherIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import weatherIconName from '../../../utils/weatherIconName';
import DailyItem from './DailyItem';
import {convertTemp} from '../../../utils/convertTemp';
import { VictoryLine, VictoryChart, VictoryAxis } from 'victory-native';
import {getDailyDataMax, getDailyDataMin, getDailyLabel} from '../../../utils/getChartData';

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
    let displayWeatherInfo = (
      <View>
        <Text style={styles.loadingText}>Fetching weather...</Text>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
    if (!this.props.loadingDailyWeather ) {
      if (this.props.dailyWeather) {
        const dailyWeather = this.props.dailyWeather;
        const maxTempData = getDailyDataMax(dailyWeather.dailyForecast, this.props.unit);
        const minTempData = getDailyDataMin(dailyWeather.dailyForecast, this.props.unit);
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
              <Text style={styles.summaryTitle}>DAILY SUMMARY</Text>
              <View style={styles.summaryContent}>
                <Text style={styles.summary}>{dailyWeather.dailySummary}</Text>
                <WeatherIcon name={weatherIconName[dailyWeather.dailyIcon]} size={50} color="white" />
              </View>
            </View>
            <View style={styles.container} pointerEvents='none'>
              <VictoryChart>
                <VictoryLine
                  style={{
                    data: { stroke: "white", color: "white" },
                  }}
                  categories={chartLabel}
                  data={maxTempData}
                />
                 <VictoryLine
                  style={{
                    data: { stroke: "white", color: "white" },
                  }}
                  data={minTempData}
                />
                <VictoryAxis
                  label="Temperature Chart"
                  style={{
                    axis: {stroke: "white"},
                    tickLabels: {fontSize: 10, fill: "white"},
                    axisLabel: {fontSize: 14, padding: 30, fill:"white"}
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
            <FlatList 
              extraData={this.props}
              data={dailyWeather.dailyForecast}
              keyExtractor={(item, index) => item.date}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => 
                <DailyItem 
                  date={item.date}
                  summary={item.summary}
                  icon={item.icon}
                  rainProb={item.precipProbability}
                  humidity={item.humidity}
                  windSpeed={item.windSpeed}
                  uvIndex={item.uvIndex}
                  tempMax={convertTemp(item.temperatureMax, this.props.unit)}
                  tempMin={convertTemp(item.temperatureMin, this.props.unit)}
                  index={item.index}
                />
              }
            />
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
    dailyWeather: state.weatherReducer.dailyWeather,
    loadingDailyWeather: state.weatherReducer.loadingDailyWeather,
    unit: state.weatherReducer.unit,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchDailyWeather: (coords) => dispatch(fetchDailyWeather(coords))
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
  dailySummary: {
    marginVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    width: '100%',
    flex: 1,
    display: 'flex',
    paddingVertical: 15,
    paddingHorizontal: 10
  },
  summaryTitle: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10
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
    marginBottom: 20
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Daily);
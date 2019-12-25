import React, {Component} from 'react';
import {StyleSheet, View, ActivityIndicator, FlatList, RefreshControl, Text} from 'react-native';
import { connect } from 'react-redux';
import { fetchNews } from '../../store/actions';
import NewsItem from './NewsItem';
import darkTheme from '../../utils/constants';

class News extends Component {
  componentDidMount() {
    this.onRefresh();
  }
  onRefresh = () => {
    this.props.fetchNews();
  }
  render() {
    let styles = this.props.theme === 'light' ? lightStyles : darkStyles;
    let displayNews = (
      <View>
        <Text style={styles.loadingText}>Fetching news...</Text>
        <ActivityIndicator size="large" color={this.props.theme === 'light' ? "#263144" : darkTheme.textColor} />
      </View>
    )
    if (!this.props.loadingNews) {
      if (this.props.news) {
        displayNews = (
          <FlatList 
            refreshControl={
              <RefreshControl
                onRefresh={this.onRefresh}
              />
            }
            data={this.props.news}
            keyExtractor={(item, index) => item.link}
            renderItem={({item}) => 
              <NewsItem 
                thumbnail={item.thumbnail} 
                summary={item.summary}
                url={item.link}
                index={item.index}
              />
            }
          />
        )
      }
    }
    return (
      <View style={styles.newsContainer}>
        {displayNews}
      </View>
    );
  }
}

const lightStyles = StyleSheet.create({
  newsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingTop: 26,
    paddingHorizontal: 14
  },
  loadingText: {
    color: '#263144',
    marginBottom: 5
  }
});
const darkStyles = StyleSheet.create({
  newsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingTop: 26,
    paddingHorizontal: 14
  },
  loadingText: {
    color: darkTheme.textColor,
    marginBottom: 5
  }
});
const mapStateToProps = state => {
  return {
    news: state.newsReducer.news,
    loadingNews: state.newsReducer.loadingNews,
    theme: state.weatherReducer.theme
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchNews: () => dispatch(fetchNews())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(News);

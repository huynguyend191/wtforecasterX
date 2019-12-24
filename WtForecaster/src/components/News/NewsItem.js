import React, {Component} from 'react';
import { View, Text, StyleSheet, TouchableHighlight , Image, Linking, Animated } from 'react-native';

class NewsItem extends Component {
  state = {
    scaleValue: new Animated.Value(0.01)
  }
  componentDidMount() {
    Animated.timing(this.state.scaleValue, {
        toValue: 1,
        duration : 600,
        delay: this.props.index * 450
    }).start();
  }
  render() {
    return (
      <TouchableHighlight  onPress={ () => {Linking.openURL(this.props.url)}} underlayColor="white">
        <Animated.View style={[styles.newsItem, { opacity: this.state.scaleValue }]}>
          <Text style={styles.summary}>{this.props.summary}</Text>
          <Image source={{uri: this.props.thumbnail}} style={styles.thumbnail} />
        </Animated.View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  newsItem: {
    display: 'flex',
    flexDirection: 'row',
    width: '99%',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 10,
    height: 140,
    elevation: 5,
    marginHorizontal: 2
  },
  thumbnail: {
    width: '40%',
    height: '96%'
  },
  summary: {
    flexWrap: 'wrap',
    width: '60%',
    padding: 5,
    color: '#263144'
  }
})

export default NewsItem;
import React, {Component} from 'react';
import { View, Text, StyleSheet , Image, Animated, TouchableWithoutFeedback, FlatList, TouchableOpacity } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Comment from './Comment';
import { connect } from 'react-redux';
import darkTheme from '../../utils/constants';
class PlaceItem extends Component {
  state = {
    scaleValue: new Animated.Value(0.01),
    isExpanding: false
  }
  componentDidMount() {
    Animated.timing(this.state.scaleValue, {
        toValue: 1,
        duration : 600,
        delay: this.props.index * 450
    }).start();
  }
  expandInfo = () => {
    this.setState(prevState => ({
      isExpanding: !prevState.isExpanding
    }));
  }
  addComment = (place) => {
    this.props.onAddComment(place);
  }
 
  render() {
    let styles = this.props.theme === "light" ? lightStyles : darkStyles;
    let iconColor = this.props.theme === "light" ? '#263144' : darkTheme.textColor;
    const place = this.props.placeInfo;
    let expandSection = null;
    if (this.state.isExpanding) {
      expandSection = (
        <View styles={styles.expandSection}>
          <Text style={styles.description}>Description</Text>
          <Text style={styles.descriptionContent}>{place.description}</Text>
          <Text style={styles.description}>Comments</Text>
          <FlatList
            extraData={this.props.email}
            data={place.comments}
            keyExtractor={(item, index) => item._id}
            renderItem={({item}) => 
              <Comment email={this.props.email} comment={item} placeId={this.props.placeInfo._id} onReload={this.props.onReload}/>
            }
          />
          <TouchableOpacity onPress={() => this.addComment(place)}>
            <View style={styles.addCmtButton}>
              <Text style={{color: iconColor, textAlign: 'center', fontWeight: 'bold'}}>ADD COMMENT</Text>
            </View>
          </TouchableOpacity>
         

        </View>
      )
    } else {
      expandSection = null;
    }
    
    return (
      <TouchableWithoutFeedback onPress={this.expandInfo}>
        <Animated.View style={[styles.placeItem, { opacity: this.state.scaleValue }]}>
          <View style={styles.mainDisplay}>
            <Image source={{uri: place.image.link}} style={styles.image} />
            <View style={styles.title}>
              <Text style={styles.placeName}>{place.name}</Text>
              <Text style={styles.address}>{place.address.detail}</Text>
              <AirbnbRating
                showRating={false}
                size={20}
                defaultRating={place.rate}
                isDisabled={true}
              />
              <View style={styles.commentCount}>
                <Icon name="comment-account-outline" size={20} color={iconColor} />              
                <Text style={{color: iconColor}}>{place.peopleRated}</Text>
              </View>
            </View>
          </View>
          {expandSection}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

const lightStyles = StyleSheet.create({
  placeItem: {
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 18,
    width: '97%',
    elevation: 5,
    marginHorizontal: 5,
    marginBottom: 5
  },
  mainDisplay: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5
  },
  image: {
    width: 90,
    height: 90
  },
  title: {
    width: '70%',
    marginLeft: 10,
    alignItems: 'flex-start'
  },
  placeName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#263144',
  },
  commentCount: {
    paddingRight: 10,
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    color: '#263144',
  },
  description: {
    fontSize: 14,
    marginVertical: 3,
    fontWeight: '500',
    padding: 5,
    color: '#263144',
  },
  descriptionContent: {
    color: '#263144',
    textAlign: 'justify',
    padding: 5
  },
  address: {
    color: '#263144',
    fontSize: 12
  },
  expandSection: {
    alignItems: 'center'
  },
  addCmtButton: {
    width: 180,
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    height: 40,
    borderWidth: 1,
    borderColor: '#263144',
    justifyContent: 'center'
  }
})
const darkStyles = StyleSheet.create({
  placeItem: {
    backgroundColor: darkTheme.cardColor,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 18,
    width: '97%',
    elevation: 5,
    marginHorizontal: 5,
    marginBottom: 5
  },
  mainDisplay: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5
  },
  image: {
    width: 90,
    height: 90
  },
  title: {
    width: '70%',
    marginLeft: 10,
    alignItems: 'flex-start'
  },
  placeName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: darkTheme.textColor,
  },
  commentCount: {
    paddingRight: 10,
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    color: darkTheme.textColor,
  },
  description: {
    fontSize: 14,
    marginVertical: 3,
    fontWeight: '500',
    padding: 5,
    color: darkTheme.textColor,
  },
  descriptionContent: {
    color: darkTheme.textColor,
    textAlign: 'justify',
    padding: 5
  },
  address: {
    color: darkTheme.textColor,
    fontSize: 12
  },
  expandSection: {
    alignItems: 'center'
  },
  addCmtButton: {
    width: 180,
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: darkTheme.cardColor,
    height: 40,
    borderWidth: 1,
    borderColor: darkTheme.textColor,
    justifyContent: 'center'
  }
})
const mapStateToProps = state => {
  return {
    theme: state.weatherReducer.theme
  }
}
export default connect(mapStateToProps,null)(PlaceItem);
import React, {Component} from 'react';
import { View, Text, StyleSheet , TouchableWithoutFeedback, Alert } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import axios from '../../utils/axiosConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class Comment extends Component {


  deleteComment = (id) => {
    Alert.alert(
      'Confirm Deletion',
      'Delete this comment?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes', 
          onPress: () => {
            axios.delete(`/places/remove/comment/${this.props.placeId}/${id}`)
            .then(result => {
              this.props.onReload();
            })
            .catch(error => {
              alert('Delete item failed')
            })
          },
          style: 'destructive'
        },
      ],
    );
  }

  reportComment = () => {
    Alert.alert(
      'Report violation',
      'Report this comment?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes', 
          onPress: () => {
            Alert.alert(
              'Submitted',
              'Reported to Admin.',
              [
                {
                  text: 'OK',
                  style: 'cancel',
                },
              ],
            );
          },
          style: 'destructive'
        },
      ],
    );
  }

  expandComment = () => {
    if (this.props.comment.email === this.props.email) {
      this.setState(prevState => ({
        isExpanding: !prevState.isExpanding
      }));
    }
  }

  render() {
    const comment = this.props.comment;
    return (
        <View style={styles.comment}>
            <View style={styles.commentHeader}>
                <Text style={styles.username}>{comment.email === this.props.email ? `${comment.user}(You)` : comment.user}</Text>
                <View style={{display: 'flex', flexDirection: 'row',}}>
                  <AirbnbRating 
                    showRating={false}
                    size={15}
                    defaultRating={comment.rate}
                    isDisabled={true}
                  />
                   {comment.email === this.props.email ? 
                    <Icon name="delete" size={20} color="#ff5253" onPress={() => this.deleteComment(comment.commentId)}/> :
                    <Icon name="flag-outline" size={20} color="#263144" onPress={() => this.reportComment()} />
                    }
                </View>
            </View>
            
            <View style={styles.commentContent}>
              <Text>{comment.content}</Text>
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  comment: {
    borderRadius: 20,
    marginTop: 5,
  },
  commentHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginHorizontal: 5,
  },
  username: {
    fontSize: 14,
    color: '#263144',
    marginRight: 10
  },
  commentContent: {
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20
  },
  deleteComment: {
    color: 'red',
    textAlign: 'center',
    marginTop: 5,
    fontWeight: '700'
  }
})

export default Comment;
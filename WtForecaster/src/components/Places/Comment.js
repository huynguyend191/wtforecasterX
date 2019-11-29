import React, {Component} from 'react';
import { View, Text, StyleSheet , TouchableWithoutFeedback } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import axios from '../../utils/axiosConfig';

class Comment extends Component {
  state = {
    isExpanding: false
  }

  deleteComment = (id) => {
    axios.delete(`/places/remove/comment/${this.props.placeId}/${id}`)
    .then(result => {
      this.props.onReload();
    })
    .catch(error => {
      alert('Delete item failed')
    })
  }

  expandComment = () => {
    if (this.props.comment.email === this.props.email) {
      this.setState(prevState => ({
        isExpanding: !prevState.isExpanding
      }));
    }
  }

  render() {
    let expandSection = null;
    const comment = this.props.comment;
    if (this.state.isExpanding) {
      expandSection = (
        <TouchableWithoutFeedback onPress={() => this.deleteComment(comment.commentId)}>
          <Text style={styles.deleteComment}>Delete</Text> 
        </TouchableWithoutFeedback>
      )
    }
    return (
      <TouchableWithoutFeedback onPress={this.expandComment}>
        <View style={styles.comment}>
            <View style={styles.commentHeader}>
              <Text style={styles.username}>{comment.email === this.props.email ? `You (${comment.user})` : comment.user}</Text>
              <AirbnbRating 
                showRating={false}
                size={15}
                defaultRating={comment.rate}
                isDisabled={true}
              />
            </View>
            <View style={styles.commentContent}>
              <Text>{comment.content}</Text>
            </View>
            {expandSection}
        </View>
      </TouchableWithoutFeedback>
      
    );
  }
}

const styles = StyleSheet.create({
  comment: {
    marginHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
    padding: 10
  },
  commentHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginHorizontal: 10,
  },
  username: {
    fontSize: 14,
    fontWeight: '800'
  },
  commentContent: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    padding: 5,
    borderRadius: 5
  },
  deleteComment: {
    color: 'red',
    textAlign: 'center',
    marginTop: 5,
    fontWeight: '700'
  }
})

export default Comment;
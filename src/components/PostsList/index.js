import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import PostsItem from '../PostsItem'
import SearchContext from '../../Context/SearchContext'
import './index.css'

const apiPostsStatus = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class PostsList extends Component {
  state = {
    apiPost: apiPostsStatus.initial,
    postsData: [],
    button: false,
  }

  componentDidMount() {
    this.getPostList()
  }

  getPostList = async () => {
    this.setState({apiPost: apiPostsStatus.inProgress})

    const Token = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/insta-share/posts'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.posts.map(each => ({
        postId: each.post_id,
        userId: each.user_id,
        likeStatus: false,
        userName: each.user_name,
        profilePic: each.profile_pic,
        postDetails: {
          imageUrl: each.post_details.image_url,
          caption: each.post_details.caption,
        },
        likesCount: each.likes_count,
        comments: each.comments.map(eachItem => ({
          userName: eachItem.user_name,
          userId: eachItem.user_id,
          comment: eachItem.comment,
        })),
        createdAt: each.created_at,
      }))

      this.setState({
        postsData: updatedData,
        apiPost: apiPostsStatus.success,
      })
    } else {
      this.setState({apiPost: apiPostsStatus.failure})
    }
  }

  onChangeLikeIcon = async postId => {
    this.setState(prev => ({
      button: !prev.button,
    }))
    const token = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const post = {like_status: true}
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(post),
      method: 'POST',
    }
    await fetch(apiUrl, options)

    this.setState(prev => ({
      postsData: prev.postsData.map(each => {
        if (each.postId === postId) {
          return {
            ...each,
            likesCount: each.likesCount + 1,
            likeStatus: !each.likeStatus,
          }
        }
        return each
      }),
    }))
  }

  onChangeUnLikeIcon = async postId => {
    this.setState(prev => ({button: !prev.button}))
    const token = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const post = {like_status: false}
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(post),
      method: 'POST',
    }
    await fetch(apiUrl, options)
    this.setState(prev => ({
      postsData: prev.postsData.map(each => {
        if (each.postId === postId) {
          return {
            ...each,
            likesCount: each.likesCount - 1,
            likeStatus: !each.likeStatus,
          }
        }
        return each
      }),
    }))
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  onRetry = () => {
    this.setState({apiPost: apiPostsStatus.inProgress}, this.getPostList)
  }

  renderPostsFailureView = () => (
    <div className="failure-view">
      <img
        src="https://res.cloudinary.com/dq7imhrvo/image/upload/v1643651534/insta%20Shere%20clone/alert-triangle_hczx0o.png"
        alt="failure view"
        className="failure-img"
      />
      <p className="failure-head">Something went wrong. Please try again</p>
      <button className="failure-button" type="button" onClick={this.onRetry}>
        Try again
      </button>
    </div>
  )

  renderPostsSuccessView = () => {
    const {postsData, button} = this.state

    return (
      <SearchContext.Provider
        value={{
          onChangeLikeIcon: this.onChangeLikeIcon,
          onChangeUnLikeIcon: this.onChangeUnLikeIcon,
        }}
      >
        <ul className="posts-container">
          {postsData.map(each => (
            <PostsItem key={each.postId} item={each} button={button} />
          ))}
        </ul>
      </SearchContext.Provider>
    )
  }

  renderPostsView = () => {
    const {apiPost} = this.state

    switch (apiPost) {
      case apiPostsStatus.success:
        return this.renderPostsSuccessView()
      case apiPostsStatus.inProgress:
        return this.renderLoadingView()
      case apiPostsStatus.failure:
        return this.renderPostsFailureView()
      default:
        return null
    }
  }

  render() {
    return this.renderPostsView()
  }
}

export default PostsList

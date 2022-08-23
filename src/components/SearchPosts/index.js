import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import SearchContext from '../../Context/SearchContext'

import PostsItem from '../PostsItem'

import './index.css'

const apiSearchPostsStatus = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  empty: 'EMPTY',
}

class SearchPosts extends Component {
  state = {
    apiSearchPost: apiSearchPostsStatus.initial,
    searchPostsData: [],
    button: false,
  }

  componentDidMount() {
    this.getSearchPostList()
  }

  getSearchPostList = async () => {
    this.setState({apiSearchPost: apiSearchPostsStatus.inProgress})
    const {input} = this.props

    const Token = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/insta-share/posts?search=${input}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      if (data.posts.length === 0) {
        this.setState({apiSearchPost: apiSearchPostsStatus.empty})
      } else {
        const updatedData = data.posts.map(each => ({
          postId: each.post_id,
          userId: each.user_id,
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
          searchPostsData: updatedData,
          apiSearchPost: apiSearchPostsStatus.success,
        })
      }
    } else {
      this.setState({apiSearchPost: apiSearchPostsStatus.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  onRetry = () => {
    this.setState(
      {apiSearchPost: apiSearchPostsStatus.inProgress},
      this.getSearchPostList,
    )
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
      searchPostsData: prev.searchPostsData.map(each => {
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
      searchPostsData: prev.searchPostsData.map(each => {
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

  renderPostsSuccessView = () => {
    const {searchPostsData, button} = this.state

    return (
      <>
        <SearchContext.Provider
          value={{
            onChangeLikeIcon: this.onChangeLikeIcon,
            onChangeUnLikeIcon: this.onChangeUnLikeIcon,
          }}
        >
          <h1 className="search-head">Search Results</h1>
          <ul className="Posts-container-search">
            {searchPostsData.map(each => (
              <PostsItem item={each} key={each.postId} button={button} />
            ))}
          </ul>
        </SearchContext.Provider>
      </>
    )
  }

  renderEmptyView = () => (
    <div className="Not-found-view">
      <img
        src="https://res.cloudinary.com/dq7imhrvo/image/upload/v1643965945/insta%20Shere%20clone/Group_c2v5dj.jpg"
        alt="search not found"
        className="failure-img"
      />
      <h1 className="search_not-found">Search Not Found</h1>
      <p className="not-found-p">Try different keyword or search again</p>
    </div>
  )

  renderPostsView = () => {
    const {apiSearchPost} = this.state

    switch (apiSearchPost) {
      case apiSearchPostsStatus.empty:
        return this.renderEmptyView()
      case apiSearchPostsStatus.success:
        return this.renderPostsSuccessView()
      case apiSearchPostsStatus.inProgress:
        return this.renderLoadingView()
      case apiSearchPostsStatus.failure:
        return this.renderPostsFailureView()
      default:
        return null
    }
  }

  render() {
    return this.renderPostsView()
  }
}

export default SearchPosts

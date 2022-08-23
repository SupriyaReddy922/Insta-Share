import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import StoriesList from '../StoriesList'
import './index.css'

const apiStoriesStatus = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Stories extends Component {
  state = {storiesList: [], apiStatusStories: apiStoriesStatus.initial}

  componentDidMount() {
    this.getStoriesDetails()
  }

  getStoriesDetails = async () => {
    this.setState({apiStatusStories: apiStoriesStatus.inProgress})

    const Token = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/insta-share/stories'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        usersStories: data.users_stories.map(each => ({
          userId: each.user_id,
          userName: each.user_name,
          storyUrl: each.story_url,
        })),
      }
      this.setState({
        storiesList: updatedData,
        apiStatusStories: apiStoriesStatus.success,
      })
    } else {
      this.setState({apiStatusStories: apiStoriesStatus.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderSuccessView = () => {
    const {storiesList} = this.state

    return <StoriesList storiesList={storiesList} />
  }

  onRetry = () => {
    this.setState(
      {apiStatusStories: apiStoriesStatus.inProgress},
      this.getStoriesDetails,
    )
  }

  renderStoriesFailureView = () => (
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

  renderStoriesView = () => {
    const {apiStatusStories} = this.state

    switch (apiStatusStories) {
      case apiStoriesStatus.success:
        return this.renderSuccessView()
      case apiStoriesStatus.inProgress:
        return this.renderLoadingView()
      case apiStoriesStatus.failure:
        return this.renderStoriesFailureView()
      default:
        return null
    }
  }

  render() {
    return this.renderStoriesView()
  }
}

export default Stories

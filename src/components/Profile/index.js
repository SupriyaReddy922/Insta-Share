import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import ProfileCard from '../ProfileCard'

const apiMyProfileStatus = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Profile extends Component {
  state = {apiProfileStatus: apiMyProfileStatus.initial, profileData: []}

  componentDidMount() {
    this.getMyProfileDetail()
  }

  getMyProfileDetail = async () => {
    const token = Cookies.get('jwt_token')

    this.setState({apiProfileStatus: apiMyProfileStatus.inProgress})

    const apiUrl = 'https://apis.ccbp.in/insta-share/my-profile'
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        profile: {
          id: data.profile.id,
          userId: data.profile.user_id,
          userName: data.profile.user_name,
          profilePic: data.profile.profile_pic,
          followersCount: data.profile.followers_count,
          followingCount: data.profile.following_count,
          userBio: data.profile.user_bio,
          postsCount: data.profile.posts_count,
          posts: data.profile.posts.map(each => ({
            id: each.id,
            image: each.image,
          })),
          stories: data.profile.stories.map(each => ({
            id: each.id,
            image: each.image,
          })),
        },
      }
      this.setState({
        profileData: updatedData,
        apiProfileStatus: apiMyProfileStatus.success,
      })
    } else {
      this.setState({apiProfileStatus: apiMyProfileStatus.failure})
    }
  }

  renderMyProfileSuccessView = () => {
    const {profileData} = this.state

    return (
      <ul className="my-profile-container">
        <ProfileCard data={profileData} my="my" />
      </ul>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  onRetry = () => {
    this.setState(
      {apiProfileStatus: apiMyProfileStatus.inProgress},
      this.getMyProfileDetail,
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

  renderMyProfileView = () => {
    const {apiProfileStatus} = this.state

    switch (apiProfileStatus) {
      case apiMyProfileStatus.success:
        return this.renderMyProfileSuccessView()
      case apiMyProfileStatus.inProgress:
        return this.renderLoadingView()
      case apiMyProfileStatus.failure:
        return this.renderPostsFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderMyProfileView()}
      </>
    )
  }
}

export default Profile

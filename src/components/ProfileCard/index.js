import {BsGrid3X3} from 'react-icons/bs'

import UserStories from '../UserStories'
import UserPostsList from '../UserPostsList'

import './index.css'

const ProfileCard = props => {
  const {data, my} = props

  const {profile} = data
  const {
    userId,
    userName,
    profilePic,
    followersCount,
    followingCount,
    userBio,
    posts,
    stories,
    postsCount,
  } = profile

  return (
    <>
      <li className="Profile-card">
        <div className="image-user-details">
          <img src={profilePic} alt={`${my} profile`} className="Profile-pic" />
          <div className="user-detail-container">
            <h1 className="profile-head">{userName}</h1>
            <div className="count">
              <p className="count-follower">
                <span className="highlight">{postsCount}</span>Posts
              </p>
              <p className="count-follower">
                <span className="highlight">{followersCount} </span> Followers
              </p>
              <p className="count-follower">
                <span className="highlight">{followingCount} </span> Following
              </p>
            </div>
            <div className="bio-container">
              <p className="bio-name">{userId}</p>
              <p className="bio">{userBio}</p>
            </div>
          </div>
        </div>
        <ul className="user-stories">
          {stories.map(each => (
            <UserStories key={each.id} item={each} my={my} />
          ))}
        </ul>
        <hr className="line" />
        <div className="posts-container-user">
          <div className="head-container">
            <BsGrid3X3 className="post-logo" />
            <h1 className="post-head">Posts</h1>
          </div>
          <UserPostsList posts={posts} my={my} />
        </div>
      </li>
    </>
  )
}

export default ProfileCard

import {BiCamera} from 'react-icons/bi'
import './index.css'

const UserPostsList = props => {
  const {posts, my} = props

  const postsView = () => (
    <ul className="user-posts-container">
      {posts.map(each => (
        <li className="post-image-container" key={each.id}>
          <img src={each.image} alt={`${my} post`} className="post-image" />
        </li>
      ))}
    </ul>
  )

  const noPostView = () => (
    <div className="no-post-container">
      <BiCamera className="no-post-image" />
      <h1 className="no-post-head">No Posts Yet</h1>
    </div>
  )

  const correctView = () => {
    if (posts.length === 0) {
      return noPostView()
    }
    return postsView()
  }

  return correctView()
}

export default UserPostsList

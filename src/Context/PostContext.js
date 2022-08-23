import React from 'react'

const PostContext = React.createContext({
  postsData: [],
  onClickLikeIncreaseButton: () => {},
})

export default PostContext

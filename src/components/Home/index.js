import Header from '../Header'
import Stories from '../Stories'
import PostsList from '../PostsList'
import SearchPosts from '../SearchPosts'
import SearchContext from '../../Context/SearchContext'
import './index.css'

const Home = () => (
  <SearchContext.Consumer>
    {value => {
      const {searchInput, searchPostView} = value
      return (
        <>
          <Header />
          <div className="bg-color">
            {searchPostView ? (
              <SearchPosts input={searchInput} />
            ) : (
              <>
                <Stories />
                <PostsList />
              </>
            )}
          </div>
        </>
      )
    }}
  </SearchContext.Consumer>
)

export default Home

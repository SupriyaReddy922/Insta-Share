import {Switch, Route, Redirect} from 'react-router-dom'
import {Component} from 'react'

import LoginForm from './components/LoginForm'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './components/Home'
import Profile from './components/Profile'
import UserProfile from './components/UserProfile'
import NotFound from './components/NotFound'
import SearchContext from './Context/SearchContext'

import './App.css'

class App extends Component {
  state = {
    searchInput: '',
    click: false,
    searchPostView: false,
    searchValue: false,
  }

  closeHeaderButtonIn = () => {
    this.setState(prev => ({click: !prev.click}))
  }

  onChangeSearchInput = input => {
    this.setState({searchInput: input})
  }

  setSearchInput = () => {
    this.setState(prev => ({searchPostView: !prev.searchPostView}))
  }

  moreOptions = () => {
    this.setState(prev => ({click: !prev.click}))
  }

  searchBox = () => {
    this.setState(prev => ({
      searchValue: !prev.searchValue,
      click: !prev.click,
    }))
  }

  render() {
    const {searchInput, searchPostView, click, searchValue} = this.state

    return (
      <SearchContext.Provider
        value={{
          searchInput,
          click,
          searchPostView,
          searchValue,
          onChangeSearchInput: this.onChangeSearchInput,
          setSearchInput: this.setSearchInput,
          onMoreOptionsState: this.moreOptions,
          searchBox: this.searchBox,
          closeHeaderButtonIn: this.closeHeaderButtonIn,
        }}
      >
        <Switch>
          <Route exact to path="/login" component={LoginForm} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/my-profile" component={Profile} />
          <ProtectedRoute path="/users/:userId" component={UserProfile} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="/not-found" />
        </Switch>
      </SearchContext.Provider>
    )
  }
}

export default App

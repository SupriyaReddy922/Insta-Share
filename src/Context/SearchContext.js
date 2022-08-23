import React from 'react'

const SearchContext = React.createContext({
  SearchInput: '',
  click: false,
  searchPostView: false,
  searchValue: false,
  button: false,
  onChangeLikeIcon: () => {},
  onChangeUnLikeIcon: () => {},
  changeSearchValue: () => {},
  setSearchInput: () => {},
  onMoreOptionsState: () => {},
  searchBox: () => {},
})

export default SearchContext

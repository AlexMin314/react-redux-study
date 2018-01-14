import { createSelector } from 'reselect'

/*
Reselect is a library for building memoized selectors.
We define selectors as the functions that retrieve
snippets of the Redux state for our React components.
Using memoization, we can prevent unnecessary rerenders and
recalculations of derived data which in turn will speed up our application.
*/
const selectTodos = (state, props) => state.Todo.todos
const selectFilter = (state, props) => props.match.params.filter

const _filterType = type => filter => filter === type
const _typeChecker = _filterType('completed')
const filterTodo = (todos, isfiltering) => {
  return isfiltering
  ? todos.filter(e => _typeChecker('completed') === e.isCompleted)
  : todos
}

export default createSelector(
  [selectTodos, selectFilter],
  filterTodo
)
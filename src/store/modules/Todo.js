import { createAction, handleActions } from 'redux-actions'
import * as api from '../api/todoAPI'
import { pender } from 'redux-pender'
import { Map, List } from 'immutable'
import { _pipe, _do, _doMutation } from '../../libs/helpers/composition'
import createSocketAction from '../middlewares/socket/createSocketAction'


/* Action Types */
// Sync actions
export const TODO_INPUT = 'todo/TODO_INPUT'
export const TODO_ADD = 'todo/TODO_ADD'
export const TODO_TOGGLE = 'todo/TODO_TOGGLE'
export const TODO_DELETE = 'todo/TODO_DELETE'
export const TODO_CLEAR = 'todo/TODO_CLEAR'
export const TODO_UPDATE = 'todo/TODO_UPDATE'
// Async actions
export const TODO_FETCH = 'todo/TODO_FETCH'

/* Actions Creater */
// Sync actions
export const inputTodo = createAction(TODO_INPUT)
export const updateTodo = createAction(TODO_UPDATE)
// Async actions
export const fetchTodo = createAction(TODO_FETCH, api.fetchTodoAPI)
export const addTodo = createSocketAction(TODO_ADD, api.addTodoAPI)
export const toggleTodo = createSocketAction(TODO_TOGGLE, api.toggleTodoAPI)
export const deleteTodo = createSocketAction(TODO_DELETE, api.deleteTodoAPI)
export const clearTodo = createSocketAction(TODO_CLEAR, api.clearTodoAPI)


const initialState = Map({
  todos: List(),
  input: '',
  err: Map({ statue: false, msg: '' })
})

// Mutations
const setInput = value => state => state.set('input', value)
const updateToggle = theTodo => state => state.update('todos', todos =>
  todos.map(todo => {
    return todo.id === theTodo.id ? theTodo : todo
  })
)
const addNew = todo => state => console.log('new') ||state.update('todos', todos =>
  todos.push(todo)
)
const deleteOne = id => state => state.update('todos', todos =>
  todos.filter(todo => todo.id !== id)
)
const clearSome = todos => state => state.set('todos', List(todos))

/* reducers with redux-pender */
const Todo = handleActions({
  [TODO_INPUT]: (state, action) => // _do without withMutation()
    _do(state,
      setInput(action.payload.input)
    ),
  [TODO_UPDATE]: (state, action) => // before refactor
    state.update('todos', todos => todos.map(todo => {
      todo.willUnmount = todo.id === action.payload.id
      return todo
    })),
  [TODO_TOGGLE]: (state, action) => // _doMutation
    _doMutation(state,
      updateToggle(action.payload.data)
    ),
  [TODO_ADD]: (state, action) =>
    _doMutation(state,
      addNew(action.payload.data)
    ),
  [TODO_DELETE]: (state, action) =>
    _doMutation(state,
      deleteOne(action.payload.data),
    ),
  [TODO_CLEAR]: (state, action) =>
    _doMutation(state,
      clearSome(action.payload.data),
    ),
  ...pender({
    type: TODO_FETCH,
    onSuccess: (state, action) =>
      state.set('todos', List(action.payload.data.todos)),
  }),
}, initialState)

export default Todo

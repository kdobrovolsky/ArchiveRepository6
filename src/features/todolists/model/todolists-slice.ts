import { nanoid } from "@reduxjs/toolkit"
import { createAppSlice } from "@/common/utils/CreateAppSlice.ts"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"

export const todolistsSlice = createAppSlice({
  name: "todolist",
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (state) => state,
  },
  reducers: (create) => ({
    setTodolistsAC: create.reducer<{ todolists: Todolist[] }>((_, action) => {
      return action.payload.todolists.map(tl=> {
        return {...tl, filter: 'all'}
      })
    }),

    deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state.splice(index, 1)
      }
    }),
    createTodolistAC: create.preparedReducer(
      (title: string) => ({ payload: { title, id: nanoid() } }),
      (state, action) => {
        state.push({ ...action.payload, filter: 'all', addedDate: '', order: 0 })
      },
    ),

    changeTodolistTitleAC: create.reducer<{ id: string; title: string }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state[index].title = action.payload.title
      }
    }),
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state[index].filter = action.payload.filter
      }
    }),
  }),
})

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
export const { deleteTodolistAC, createTodolistAC, changeTodolistTitleAC, changeTodolistFilterAC,setTodolistsAC } =
  todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer
export const selectTodolists = todolistsSlice.selectors.selectTodolists

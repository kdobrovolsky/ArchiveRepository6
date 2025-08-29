import { nanoid } from "@reduxjs/toolkit"
import { createAppSlice } from "@/common/utils/CreateAppSlice.ts"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"

export const todolistsSlice = createAppSlice({
  name: "todolist",
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (state) => state,
  },
  reducers: (create) => ({
    setTodolistsAC: create.asyncThunk(async (_, thunkAPI)=>{
    try {

      const res = await todolistsApi.getTodolists()
      return {todolists: res.data}
    }
    catch (e){
      return thunkAPI.rejectWithValue(null)
    }
    },
      {fulfilled: (state,action) => {
        action.payload?.todolists.forEach((tl)=>{
        state.push({...tl, filter: "all"})
        })
        }}
      ),

    deleteTodolistTC: create.asyncThunk((id: string,thunkAPI)=>{
        try {
          todolistsApi.deleteTodolist(id)
          return id
        }
        catch (e){
          thunkAPI.rejectWithValue(e)
        }
      },
      {fulfilled: (state, action) => {
          const index = state.findIndex((todolist) => todolist.id === action.payload)
          if (index !== -1) {
            state.splice(index, 1)}
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
export const { deleteTodolistTC, createTodolistAC, changeTodolistTitleAC, changeTodolistFilterAC,setTodolistsAC } =
  todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer
export const selectTodolists = todolistsSlice.selectors.selectTodolists

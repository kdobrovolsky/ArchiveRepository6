import { nanoid } from "@reduxjs/toolkit"
import { todolistsSlice } from "./todolists-slice.ts"
import { createAppSlice } from "@/common/utils/CreateAppSlice.ts"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask } from "@/features/todolists/api/tasksApi.types.ts"
import { TaskPriority, TaskStatus } from "@/common/enums"

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  selectors: {
    selectTasks: (state) => state,
  },
  reducers: (create) => ({
    setTasksTC: create.asyncThunk(
      async (todolistId: string, thunkAPI) => {
        try {
          const res = await tasksApi.getTasks(todolistId)
          return { todolistId, tasks: res.data.items }
        } catch (e) {
          return thunkAPI.rejectWithValue(e)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks
        },
      },
    ),

    deleteTaskTC: create.asyncThunk(
      async (payload: { todolistId: string; taskId: string }, thunkAPI) => {
        try {
          await tasksApi.deleteTask(payload);
          return payload;
        } catch (e) {
          return thunkAPI.rejectWithValue(e);
        }
      },
      {
        fulfilled: (state, action) => {
          const tasks = state[action.payload.todolistId]
          const index = tasks.findIndex((task) => task.id === action.payload.taskId)
          if (index !== -1) {
            tasks.splice(index, 1)
          }
        }
      }
    ),

    createTaskTC: create.asyncThunk(
      async (payload: {  todolistId: string; title: string  }, thunkAPI) => {
        try {
          const res =  await tasksApi.createTask(payload);
          return {task: res.data.data.item}
        } catch (e) {
          return thunkAPI.rejectWithValue(e);
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.task.todoListId].unshift(action.payload.task)
        }
      }
    ),

    createTaskAC: create.reducer<{ todolistId: string; title: string }>((state, action) => {
      const newTask: DomainTask = {
        title: action.payload.title,
        todoListId: action.payload.todolistId,
        startDate: "",
        priority: TaskPriority.Low,
        description: "",
        deadline: "",
        status: TaskStatus.New,
        addedDate: "",
        order: 0,
        id: nanoid(),
      }

      state[action.payload.todolistId].unshift(newTask)
    }),
    changeTaskStatusAC: create.reducer<{ todolistId: string; taskId: string; status: TaskStatus }>((state, action) => {
      const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
      if (task) {
        task.status = action.payload.status
      }
    }),
    changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
      const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
      if (task) {
        task.title = action.payload.title
      }
    }),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(todolistsSlice.actions.createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.id] = []
      })

      .addCase(todolistsSlice.actions.deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload]
      })
  },
})

export const { deleteTaskTC, createTaskTC, changeTaskStatusAC, changeTaskTitleAC, setTasksTC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const selectTasks = tasksSlice.selectors.selectTasks
export type TasksState = Record<string, DomainTask[]>

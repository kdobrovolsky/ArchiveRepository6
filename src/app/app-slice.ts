import { createSlice } from "@reduxjs/toolkit"
import { RequestStatus } from "@/common/types/RequestStatus.ts"

export const appSlice = createSlice({
  name: "app",
  initialState: {
    themeMode: "light" as ThemeMode,
    status: 'loading' as RequestStatus,
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
    selectAppStatus: (state) => state.status
  },
  reducers: (create) => ({

    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
    setAppStatusAC: create.reducer<{status: RequestStatus}>((state,action)=>{
      state.status = action.payload.status
    })
  }),
})

export type ThemeMode = "dark" | "light"
export const { changeThemeModeAC,setAppStatusAC } = appSlice.actions
export const appReducer = appSlice.reducer
export const { selectThemeMode,selectAppStatus } = appSlice.selectors

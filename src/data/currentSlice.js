import { createSlice } from '@reduxjs/toolkit'

export const currentSlice = createSlice({
  name: 'current',
  initialState: {
    currentData: {},
  },
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    syncCurrentData: (state, action) => {
    const preData = state.currentData;
    preData[action.payload.devId] = action.payload;
    state.currentData = preData;
    },
  },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default counterSlice.reducer
import { configureStore } from '@reduxjs/toolkit';
import costReducer from './costSlice';
import roomReducer from './roomSlice';

export const store = configureStore({
  reducer: {
    costs: costReducer,
    rooms: roomReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: true
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/myorders`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: { list: [], status: 'idle' },
  extraReducers: (builder) => {
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  },
});

export default orderSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPodcasts = createAsyncThunk(
  'podcasts/fetchPodcasts',
  async (category, { rejectWithValue }) => {
    try {
      const url = `http://localhost:4000/api/card/category/filter?category=${encodeURIComponent(category)}`;
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Fetch failed');
      return data;
    } catch (error) { 
      return rejectWithValue(error.message);
    }
  }
);

export const addPodcast = createAsyncThunk(
  'podcasts/addPodcast',
  async (podcastData) => {
    const response = await fetch('http://localhost:4000/api/card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(podcastData)
    });
    return await response.json();
  }
);

export const updatePodcast = createAsyncThunk(
  'podcasts/updatePodcast',
  async ({ id, data }, { rejectWithValue }) => {  
    try {
      const response = await fetch(`http://localhost:4000/api/card/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      const responseData = await response.json();
    
      if (!response.ok) throw new Error(responseData.message || 'Failed to update podcast');
      return responseData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePodcast = createAsyncThunk(
  'podcasts/deletePodcast',
  async (podcastId) => {
    await fetch(`http://localhost:4000/api/card/${podcastId}`, {
      method: 'DELETE',
    });
    return podcastId;
  }
);

const podcastSlice = createSlice({
  name: 'podcasts',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPodcasts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPodcasts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload || [];
      })
      .addCase(fetchPodcasts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addPodcast.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updatePodcast.fulfilled, (state, action) => {
        const index = state.items.findIndex(podcast => podcast._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deletePodcast.fulfilled, (state, action) => {
        state.items = state.items.filter(podcast => podcast._id !== action.payload);
      });
  }
});

export default podcastSlice.reducer;
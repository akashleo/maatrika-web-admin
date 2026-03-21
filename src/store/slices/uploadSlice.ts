import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../../api/axios';
import axios from 'axios';

export interface UploadState {
  uploadUrl: string | null;
  publicUrl: string | null;
  expiresAt: string | null;
  loading: boolean;
  error: string | null;
  progress: number;
}

const initialState: UploadState = {
  uploadUrl: null,
  publicUrl: null,
  expiresAt: null,
  loading: false,
  error: null,
  progress: 0,
};

interface GenerateUploadUrlParams {
  fileName: string;
  contentType: string;
  productId: string;
  fileSize?: number;
}

export const generateUploadUrl = createAsyncThunk(
  'upload/generateUploadUrl',
  async ({ fileName, contentType, productId, fileSize }: GenerateUploadUrlParams, { rejectWithValue }) => {
    try {
      const config: any = {
        headers: {
          'Content-Type': 'application/json',
        }
      };

      if (fileSize) {
        config.headers['x-file-size'] = fileSize.toString();
      }

      const response = await api.post('/api/uploads/product-image', {
        fileName,
        contentType,
        productId
      }, config);

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const uploadImageToGCS = createAsyncThunk(
  'upload/uploadImageToGCS',
  async ({ file, uploadUrl }: { file: File; uploadUrl: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });

      if (response.status !== 200) {
        throw new Error('Failed to upload image to storage');
      }

      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    resetUpload: (state) => {
      state.uploadUrl = null;
      state.publicUrl = null;
      state.expiresAt = null;
      state.loading = false;
      state.error = null;
      state.progress = 0;
    },
    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateUploadUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateUploadUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadUrl = action.payload.uploadUrl;
        state.publicUrl = action.payload.publicUrl;
        state.expiresAt = action.payload.expiresAt;
      })
      .addCase(generateUploadUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadImageToGCS.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImageToGCS.fulfilled, (state) => {
        state.loading = false;
        state.progress = 100;
      })
      .addCase(uploadImageToGCS.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetUpload, setProgress, clearError } = uploadSlice.actions;
export default uploadSlice.reducer;

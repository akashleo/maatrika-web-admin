import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

const MAATRIKA_BACKEND = import.meta.env.MAATRIKA_BACKEND || 'http://localhost:5000';

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

interface GenerateUploadUrlResponse {
  success: boolean;
  data: {
    uploadUrl: string;
    publicUrl: string;
    expiresAt: string;
  };
}

export const generateUploadUrl = createAsyncThunk(
  'upload/generateUploadUrl',
  async ({ fileName, contentType, productId, fileSize }: GenerateUploadUrlParams, { rejectWithValue }) => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (fileSize) {
        headers['x-file-size'] = fileSize.toString();
      }

      const response = await fetch(`${MAATRIKA_BACKEND}/api/uploads/product-image`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ fileName, contentType, productId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate upload URL');
      }

      const data: GenerateUploadUrlResponse = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const uploadImageToGCS = createAsyncThunk(
  'upload/uploadImageToGCS',
  async ({ file, uploadUrl }: { file: File; uploadUrl: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image to storage');
      }

      return true;
    } catch (error) {
      return rejectWithValue((error as Error).message);
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

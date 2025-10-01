import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as membershipRequestsApi from "./requestsAPI";

// Fetch all requests with optional filters
export const fetchRequestsAsync = createAsyncThunk(
  "membershipRequests/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      return await membershipRequestsApi.FetchRequests(filters);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch request by ID
export const fetchRequestByIdAsync = createAsyncThunk(
  "membershipRequests/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await membershipRequestsApi.FetchRequestsById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete request
export const deleteRequestAsync = createAsyncThunk(
  "membershipRequests/delete",
  async (id, { rejectWithValue }) => {
    try {
      await membershipRequestsApi.DeleteRequest(id);
      return id; // return deleted ID for reducer
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Upload CSV
export const uploadByCSVAsync = createAsyncThunk(
  "membershipRequests/uploadCSV",
  async (CSVdata, { rejectWithValue }) => {
    try {
      return await membershipRequestsApi.UploadByCSV(CSVdata);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Submit new request
export const submitRequestAsync = createAsyncThunk(
  "membershipRequests/submit",
  async (requestDetails, { rejectWithValue }) => {
    try {
      return await membershipRequestsApi.SubmitRequest(requestDetails);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Approve request
export const approveRequestAsync = createAsyncThunk(
  "membershipRequests/approve",
  async (id, { rejectWithValue }) => {
    try {
      return await membershipRequestsApi.ApproveRequest(id);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Reject request
export const rejectRequestAsync = createAsyncThunk(
  "membershipRequests/reject",
  async (id, { rejectWithValue }) => {
    try {
      return await membershipRequestsApi.RejectRequest(id);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ================================
// INITIAL STATE
// ================================
const initialState = {
  requests: [],
  selectedRequest: null,
  loading: {
    fetch: false,
    fetchById: false,
    delete: false,
    upload: false,
    submit: false,
    approve: false,
    reject: false,
  },
  error: null,
  successMessage: null,
};

// ================================
// SLICE
// ================================
const membershipRequestsSlice = createSlice({
  name: "membershipRequests",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = initialState.error;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setSelectedRequest: (state, action) => {
      state.selectedRequest = action.payload;
    },
    clearSelectedRequest: (state) => {
      state.selectedRequest = null;
    },
  },
  extraReducers: (builder) => {
    // FETCH ALL
    builder
      .addCase(fetchRequestsAsync.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchRequestsAsync.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.requests = action.payload.requests || action.payload;
        console.log(action.payload)
      })
      .addCase(fetchRequestsAsync.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      });

    // FETCH BY ID
    builder
      .addCase(fetchRequestByIdAsync.pending, (state) => {
        state.loading.fetchById = true;
        state.error = null;
      })
      .addCase(fetchRequestByIdAsync.fulfilled, (state, action) => {
        state.loading.fetchById = false;
        state.selectedRequest = action.payload.request || action.payload;
        console.log(action.payload);
      })
      .addCase(fetchRequestByIdAsync.rejected, (state, action) => {
        state.loading.fetchById = false;
        state.error = action.payload;
      });

    // DELETE
    builder
      .addCase(deleteRequestAsync.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
      })
      .addCase(deleteRequestAsync.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.requests = state.requests.filter((r) => r._id !== action.payload);
        state.successMessage = "Request deleted successfully!";
      })
      .addCase(deleteRequestAsync.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload;
      });

    // UPLOAD CSV
    builder
      .addCase(uploadByCSVAsync.pending, (state) => {
        state.loading.upload = true;
        state.error = null;
      })
      .addCase(uploadByCSVAsync.fulfilled, (state, action) => {
        state.loading.upload = false;
        state.successMessage = "CSV uploaded successfully!";
        state.requests.push(...(action.payload.requests || []));
        console.log(action.payload ,"a", action.payload.requests)
      })
      .addCase(uploadByCSVAsync.rejected, (state, action) => {
        state.loading.upload = false;
        state.error = action.payload;
      });

    // SUBMIT
    builder
      .addCase(submitRequestAsync.pending, (state) => {
        state.loading.submit = true;
        state.error = null;
      })
      .addCase(submitRequestAsync.fulfilled, (state, action) => {
        state.loading.submit = false;
        state.requests.unshift(action.payload.request || action.payload);
        state.successMessage = "Request submitted successfully!";
      })
      .addCase(submitRequestAsync.rejected, (state, action) => {
        state.loading.submit = false;
        state.error = action.payload;
      });

    // APPROVE
    builder
      .addCase(approveRequestAsync.pending, (state) => {
        state.loading.approve = true;
        state.error = null;
      })
      .addCase(approveRequestAsync.fulfilled, (state, action) => {
        const updatedRequest = action.payload; // returned by backend
        state.requests = state.requests.map((req) =>
        req._id === updatedRequest._id ? updatedRequest : req
      );
      })
      .addCase(approveRequestAsync.rejected, (state, action) => {
        state.loading.approve = false;
        state.error = action.payload;
      });

    // REJECT
    builder
      .addCase(rejectRequestAsync.pending, (state) => {
        state.loading.reject = true;
        state.error = null;
      })
      .addCase(rejectRequestAsync.fulfilled, (state, action) => {
         const updatedRequest = action.payload;
         state.requests = state.requests.map((req) =>
         req._id === updatedRequest._id ? updatedRequest : req
  );
      })
      .addCase(rejectRequestAsync.rejected, (state, action) => {
        state.loading.reject = false;
        state.error = action.payload;
      });
  },
});

// ================================
// EXPORTS
// ================================
export const {
  clearErrors,
  clearSuccessMessage,
  setSelectedRequest,
  clearSelectedRequest,
} = membershipRequestsSlice.actions;

export const selectRequests = (state) => state.membershipRequests.requests;
export const selectSelectedRequest = (state) =>
  state.membershipRequests.selectedRequest;
export const selectRequestsLoading = (state) => state.membershipRequests.loading;
export const selectRequestsError = (state) => state.membershipRequests.error;
export const selectRequestsSuccessMessage = (state) =>
  state.membershipRequests.successMessage;

export default membershipRequestsSlice.reducer;

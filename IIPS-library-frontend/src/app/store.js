import  { configureStore } from "@reduxjs/toolkit";
import membershipRequestsReducer from "../features/requests/requestsSlice";

export const store = configureStore({
    reducer: {
        membershipRequests:membershipRequestsReducer,
    }
})
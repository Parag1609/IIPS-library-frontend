import  { configureStore } from "@reduxjs/toolkit";
import membershipRequestsSlice from "../features/requests/requestsSlice";

export const store = configureStore({
    reducer: {
        membershipRequest:membershipRequestsSlice,
    }
})
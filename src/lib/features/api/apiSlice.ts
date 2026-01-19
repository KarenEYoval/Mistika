import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: (headers) => {
    // Add any default headers here if needed
    // For example, authentication tokens
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [
    "Products",
    "Cart",
    // Add more tag types as needed
  ],
  endpoints: () => ({}), // Empty initially - endpoints injected later
});

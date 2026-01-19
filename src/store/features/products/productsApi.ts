import { apiSlice } from "../api/apiSlice";

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Fetch all products
    fetchProducts: build.query({
      query: () => ({
        url: "",
        method: "GET",
        headers: {
          endpoint: "products",
          method: "GET",
        },
      }),
      transformResponse: (response: any) => ({
        data: response.data?.products || response.products || [],
      }),
      providesTags: ["Products"],
    }),

    // Fetch single product by ID
    fetchProduct: build.query({
      query: (id: number) => ({
        url: "",
        method: "GET",
        headers: {
          endpoint: `products/${id}`,
          method: "GET",
        },
      }),
      transformResponse: (response: any) => ({
        data: response.data?.product || response.product || null,
      }),
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    // Create product (mutation)
    createProduct: build.mutation({
      query: (formData: {
        nombre: string;
        precio: number;
        descripcion?: string;
        imagen?: string;
      }) => ({
        url: "",
        method: "POST",
        body: { product: formData },
        headers: {
          endpoint: "products",
          method: "POST",
        },
      }),
      invalidatesTags: ["Products"],
    }),

    // Update product (mutation)
    updateProduct: build.mutation({
      query: ({
        id,
        ...formData
      }: {
        id: number;
        nombre?: string;
        precio?: number;
        descripcion?: string;
        imagen?: string;
      }) => ({
        url: "",
        method: "PUT",
        body: { product: formData },
        headers: {
          endpoint: `products/${id}`,
          method: "PUT",
        },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Products", id },
        "Products",
      ],
    }),

    // Delete product (mutation)
    deleteProduct: build.mutation({
      query: (id: number) => ({
        url: "",
        method: "DELETE",
        headers: {
          endpoint: `products/${id}`,
          method: "DELETE",
        },
      }),
      invalidatesTags: ["Products"],
    }),

    // Infinite query example for pagination
    fetchProductsInfinite: build.query({
      query: (page: number = 1) => ({
        url: "",
        method: "GET",
        headers: {
          endpoint: `products?page=${page}&limit=10`,
          method: "GET",
        },
      }),
      transformResponse: (response: any) => ({
        data: response.data?.products || response.products || [],
        nextPage: response.nextPage || null,
        hasMore: response.hasMore || false,
      }),
      // Only have one cache entry per query
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      // Always merge incoming data to the cache entry
      merge: (currentCache, newItems) => {
        return {
          ...newItems,
          data: [...(currentCache?.data || []), ...(newItems.data || [])],
        };
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      providesTags: ["Products"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useFetchProductsQuery,
  useFetchProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useFetchProductsInfiniteQuery,
} = productsApi;

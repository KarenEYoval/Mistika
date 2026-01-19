# Products API - RTK Query Example

This is an example of how to use RTK Query with the injected endpoints pattern.

## Usage in Components

### Fetch All Products

```tsx
"use client";

import { useFetchProductsQuery } from "@/lib/features/products/productsApi";

export function ProductsList() {
  const { data, isLoading, error } = useFetchProductsQuery(undefined);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div>
      {data?.data.map((product) => (
        <div key={product.id}>{product.nombre}</div>
      ))}
    </div>
  );
}
```

### Fetch Single Product

```tsx
"use client";

import { useFetchProductQuery } from "@/lib/features/products/productsApi";

export function ProductDetails({ id }: { id: number }) {
  const { data, isLoading } = useFetchProductQuery(id);

  if (isLoading) return <div>Loading...</div>;

  return <div>{data?.data?.nombre}</div>;
}
```

### Create Product (Mutation)

```tsx
"use client";

import { useCreateProductMutation } from "@/lib/features/products/productsApi";

export function CreateProductForm() {
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct({
        nombre: "Vela Aromática",
        precio: 250,
        descripcion: "Descripción del producto",
      }).unwrap();
      // Success - cache will automatically update
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={isLoading}>
        Create
      </button>
    </form>
  );
}
```

### Infinite Query for Pagination

```tsx
"use client";

import { useFetchProductsInfiniteQuery } from "@/lib/features/products/productsApi";

export function InfiniteProductsList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFetchProductsInfiniteQuery(1);

  return (
    <div>
      {data?.data.map((product) => (
        <div key={product.id}>{product.nombre}</div>
      ))}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          Load More
        </button>
      )}
    </div>
  );
}
```

## Adding New Endpoints

To add new endpoints, edit `productsApi.ts` and add them to the `endpoints` object:

```tsx
export const productsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // ... existing endpoints
    
    yourNewEndpoint: build.query({
      query: (param) => ({
        url: "",
        method: "GET",
        headers: {
          endpoint: `products/custom/${param}`,
          method: "GET",
        },
      }),
      providesTags: ["Products"],
    }),
  }),
});
```

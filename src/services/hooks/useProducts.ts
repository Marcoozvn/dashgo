import { useQuery, UseQueryOptions } from "react-query";
import { api } from "../apiClient";

type Product = {
  title: string;
  description: string;
  price: string;
  image_url: string;
}

type GetProductsResponse = {
  totalCount: number;
  products: Product[];
}

export async function getProducts(page: number): Promise<GetProductsResponse> {
  const { data, headers } = await api.get('products', {
    params: {
      skip: (page - 1) * 10,
      take: 10
    }
  })

  const totalCount = Number(headers['x-total-count']);

  return {
    products: data,
    totalCount
  }
}
 
export function useProducts(page: number, options: UseQueryOptions) {
  return useQuery<any, any, any>(['products', page], () => getProducts(page), {
    staleTime: 1000 * 5, // 5 seconds
    ...options
  });
}
import { useQuery, UseQueryOptions } from "react-query";
import { adminApi } from "../adminApi";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: any;
}

export interface Location {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
}

export interface PurchasesToProduct {
  amount: number;
  product: Product;
}

export interface Purchase {
  id: string;
  status: string;
  expected_date: Date;
  user: User;
  location: Location;
  purchasesToProducts: PurchasesToProduct[];
}

type GetPurchasesResponse = {
  totalCount: number;
  purchases: Purchase[];
}

export async function getPurchases(page: number): Promise<GetPurchasesResponse> {
  const { data, headers } = await adminApi.get<Array<Purchase>>('purchasesAdmin', {
    params: {
      skip: (page - 1) * 10,
      take: 10
    }
  });
  const totalCount = Number(headers['x-total-count']);
  return {
    purchases: data,
    totalCount
  }
}
 
export function usePurchases(page: number, options: UseQueryOptions) {
  return useQuery<any, any, any>(['purchasesAdmin', page], () => getPurchases(page), {
    staleTime: 1000 * 5, // 5 seconds
    ...options
  });
}
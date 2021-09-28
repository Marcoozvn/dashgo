import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import { parseCookies } from 'nookies';

function setupAdminApiClient(ctx: GetServerSidePropsContext | undefined = undefined) {
  let cookies = parseCookies(ctx);
  
  return axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['nextauth.adminToken']}`
    }
  });
}

export const adminApi = setupAdminApiClient();
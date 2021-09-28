import { CreateProduct } from '../../../components/CreateProduct';
import { setupAPIClient } from '../../../services/api';
import { withSSRAuth } from '../../../utils/withSSRAuth';

export default function UpdateProduct({ data }) {
  return (
    <CreateProduct editingProduct={data} />
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const { slug } = ctx.params;

  const api = setupAPIClient(ctx);

  const { data } = await api.get(`/products/${slug}`);

  return {
    props: {
      data
    }
  }
});
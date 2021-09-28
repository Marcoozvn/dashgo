import { CreateProduct } from '../../../components/CreateProduct';
import { withSSRAuth } from '../../../utils/withSSRAuth';


export default function NewProduct() {
  return (
    <CreateProduct />
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {}
  }
});
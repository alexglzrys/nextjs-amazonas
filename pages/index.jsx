import Layout from "@/components/Layout";
import ProductItem from "@/components/ProductItem";
import Product from "@/models/Product";
import { Store } from "@/utils/Store";
import db from "@/utils/db";
import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";

export default function Home({ products }) {
  const {state, dispatch} = useContext(Store)
  const addToCartHandler = async(product) => {
    const existItem = state.cart.cartItems.find(
      (product_state) => product_state.slug === product.slug
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;

    // consultar producto en base de datos para verificar sus existencias actuales
    const {data} = await axios.get(`/api/products/${product._id}`);

    // verificar si hay existencias suficientes para surtir el pedido
    if (data.countInStock < quantity) {
      return toast.error(
        "Lo sentimos, no contamos con existencias suficientes de este producto para surtir tu pedido"
      );
    }

    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    
    toast.success('Producto agregado al carrito de compras')
  }
  return (
    <Layout title="Home">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem product={product} key={product.slug} addToCartHandler={addToCartHandler} />
        ))}
      </div>
    </Layout>
  );
}

// Obtener Server Side Render
// Me interesa que los datos consultados en base de datos sean accesibles para SEO
export async function getServerSideProps() {
  await db.connect();
  // Obtener un listado de POJOS JS y no un listado de instancias de documentos Mongoose (solo quiero mostrar la información, no realizaré acciones con el documento)
  const products = await Product.find().lean();
  return {
    props: {
      // mapear cada producto para convertir a cadena su respectivo _id, createdAt y updatedAt
      products: products.map(db.convertDocToObj),
    },
  };
}

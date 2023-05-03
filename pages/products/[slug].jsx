import Layout from "@/components/Layout";
import Product from "@/models/Product";
import { Store } from "@/utils/Store";
import db from "@/utils/db";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { toast } from "react-toastify";

const ProductScreen = ({ product }) => {
  // Usar el contexto de Carrito de Compras
  const { state, dispatch } = useContext(Store);
  const router = useRouter();

  if (!product)
    return (
      <Layout title="Producto no encontrado">Producto no localizado</Layout>
    );

  // Despachar acción para agregar el producto al carrito de la compra
  const addToCartHandle = async() => {
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
    // redireccionar a página detalle del carrito de compra
    router.push("/cart");
  };

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">Regresar</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <section className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            height={800}
            width={800}
            className="max-w-full"
          />
        </section>
        <section>
          <ul className="p-5">
            <li>
              <h3 className="text-lg font-bold mb-3">{product.name}</h3>
            </li>
            <li>Categoría: {product.category}</li>
            <li>Marca: {product.brand}</li>
            <li>
              {product.rating} de {product.numReviews} reseñas
            </li>
            <li className="mt-3">{product.description}</li>
          </ul>
        </section>
        <section>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <p>Precio</p>
              <p>${product.price}</p>
            </div>
            <div className="mb-2 flex justify-between">
              <p>Existencias</p>
              <p>{product.countInStock ? "En tienda" : "No disponible"}</p>
            </div>
            <button className="primary-button w-full" onClick={addToCartHandle}>
              Agregar al carrito
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

// Obtener Server Side Render
// Me interesa que los datos consultados en base de datos sean accesibles para SEO
export async function getServerSideProps(context) {
  // páginas dinámicas, se pasa automáticamente un contexto con información relevante de la ruta
  const { params } = context;
  const { slug } = params;
  // buscar el producto en base de datos
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  // En caso de existir el producto, es importante mapear para convertir algunas de sus propiedades a textos
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}

export default ProductScreen;

import Layout from "@/components/Layout";
import data from "@/utils/data";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const ProductScreen = () => {
  const { query } = useRouter();
  // Recuperar parámetro de consulta en la URL
  const { slug } = query;
  // Localizar el producto en arreglo
  const product = data.products.find((product) => product.slug === slug);

  if (!product) return <div>Producto no localizado</div>;
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
                <li><h3 className="text-lg font-bold mb-3">{product.name}</h3></li>
                <li>Categoría: {product.category}</li>
                <li>Marca: {product.brand}</li>
                <li>{product.rating} de {product.numReviews} reseñas</li>
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
                    <p>{product.countInStock ? 'En tienda' : 'No disponible'}</p>
                </div>
                <button className="primary-button w-full">Agregar al carrito</button>
            </div>
        </section>
      </div>
    </Layout>
  );
};

export default ProductScreen;

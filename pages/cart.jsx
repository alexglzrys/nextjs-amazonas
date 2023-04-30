import Layout from "@/components/Layout";
import { Store } from "@/utils/Store";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const CartScreen = () => {
  // Requerir contexto del carrito de la compra
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const router = useRouter();

  // Despachar acción para eliminar artículo del carrito de la compra
  const removeItemHandler = (item) => {
    dispatch({
      type: "CART_REMOVE_ITEM",
      payload: item,
    });
  };

  // Controlador para actualizar la cantidad de piezas a agregar en el carrito de compra para este producto en particular
  const updateCartHandler = (item, qty) => {
    const quantity = Number(qty);
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    })
  }

  return (
    <Layout title={"Carrito de compras"}>
      <h1 className="mb-4 text-xl">Carrito de Compras</h1>
      {cartItems.length === 0 ? (
        <div>
          El carrito está vacio. <Link href={"/"}>Ir a comprar</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-5 text-left">Artículo</th>
                  <th className="p-5 text-right">Cantidad</th>
                  <th className="p-5 text-right">Precio</th>
                  <th className="p-5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr className="border-b" key={item.slug}>
                    <td className="p-5">
                      <Link
                        href={`products/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="mr-2"
                        />
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-5 text-right">
                      {/* Select que muestra la cantidad de articulos en Stock para este producto seleccionado */}
                      <select value={item.quantity} onChange={(e) => updateCartHandler(item, e.target.value)}>
                        {[...Array(item.countInStock).keys()].map((num) => (
                          <option key={num + 1}>{num + 1}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-5 text-right">${item.price}</td>
                    <td className="p-5 text-right">
                      <button onClick={() => removeItemHandler(item)}>
                        <XCircleIcon className="h-5 w-5"></XCircleIcon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card p-5 self-start">
            <ul>
              <li>
                <div className="pb-3 text-lg">
                  Subtotal (
                  {cartItems.reduce((acum, item) => acum + item.quantity, 0)}) -
                  ${" "}
                  {cartItems.reduce(
                    (acum, item) => acum + item.quantity * item.price,
                    0
                  )}
                </div>
              </li>
              <li>
                {/* Para realizar el proceso de compra, el usuario tiene que estar logeado, y si es así se le redirecciona al apartado de compra */}
                <button
                  onClick={() => router.push("/login?redirect=/shipping")}
                  className="primary-button w-full"
                >
                  Pagar
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
};

/**
 * Esta página provoca un error de hidraación
 * El server renderiza información diferente a la que se tiene en el cliente
 * - El server no es consiente que se tienen agregados ciertos productos en el carrtito de compra
 * - El cliente si es consiente, ya que consulta esa información en la cookie
 * 
 * El problema realmente reside en el bullet donde indica la cantidad de productos agregados en el carrito
 * 
 * Con dynamic le indicamos a NextJS que esta página no será renderizada desde el server
 * ya que tiene una dependencia externa (librería de cookies) que solo trabaja en el cliente
 * de esta forma, evitamos el problema de hidratación
 */
export default dynamic(() => Promise.resolve(CartScreen), {ssr: false}) ;

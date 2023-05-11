import CheckoutWizard from "@/components/CheckoutWizard";
import Layout from "@/components/Layout";
import { Store } from "@/utils/Store";
import { getError } from "@/utils/error";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";

const PlaceOrderScreen = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;

  // Calcular subtotal, gastos de envio, impuestos y Total a pagar
  const itemsPrice = cartItems.reduce(
    (acum, item) => acum + item.price * item.quantity,
    0
  );
  const shippingPrice = itemsPrice > 2000 ? 0 : 16;
  const taxPrice = itemsPrice * 0.16;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  // Controlador de orden de compra
  const placeOrderHandler = async() => {
    try {
      setLoading(true)
      // conectar con endpoint para registrar orden de compra
      const {data} = await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
      setLoading(false)
      // actualizar store (limpiar el carrito de compra)
      dispatch({ type: 'CART_CLEAR_ITEMS'})
      // actualizar cookie
      Cookies.set('cart', JSON.stringify({
        ...cart,
        cartItems: []
      }))
      // redireccionar a la página referente a la confirmación de ordern de compra
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false)
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Orden de pago">
      <CheckoutWizard activeStep={3} />
      <h1 className="mb-4 text-xl">Orden de Pago</h1>
      {cartItems.length === 0 ? (
        <div>
          Carrito de compra vacío. <Link href="/">Ir a comprar</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Dirección de entrega</h2>
              <div className="mb-2">
                {shippingAddress.fullName}, {shippingAddress.address},{" "}
                {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                {shippingAddress.country}
              </div>
              <div>
                <Link href="/shipping">Editar</Link>
              </div>
            </div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Método de pago</h2>
              <div className="mb-2">{paymentMethod}</div>
              <div>
                <Link href="/payment">Editar</Link>
              </div>
            </div>
            <div className="card overflow-x-auto p-5">
              <h2 className="mb-2 text-lg">Productos</h2>
              <table className="min-w-full mb-2">
                <thead className="border-b">
                  <tr>
                    <th className="p-5 text-left">Artículo</th>
                    <th className="p-5 text-right">Cantidad</th>
                    <th className="p-5 text-right">Precio</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td className="p-5 flex items-center text-left">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="mr-3"
                        />
                        {item.name}
                      </td>
                      <td className="p-5 text-right">{item.quantity}</td>
                      <td className="p-5 text-right">${item.price}</td>
                      <td className="p-5 text-right">
                        ${item.price * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <Link href="/cart">Editar</Link>
              </div>
            </div>
          </div>
          <div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Resúmen de compra</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Artículos</div>
                    <div>${Number(itemsPrice).toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Impuestos</div>
                    <div>${Number(taxPrice).toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Gastos de envío</div>
                    <div>${Number(shippingPrice).toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>${Number(totalPrice).toFixed(2)}</div>
                  </div>
                </li>
                <li>
                  <button
                    className="primary-button w-full"
                    disabled={loading}
                    onClick={placeOrderHandler}
                  >
                    {loading ? "Cargando..." : "Confirmar orden"}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

PlaceOrderScreen.auth = true;

export default PlaceOrderScreen;

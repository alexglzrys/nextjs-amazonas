import Layout from "@/components/Layout";
import { getError } from "@/utils/error";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useReducer } from "react";

// Reducer con tareas relacionadas a peticiones HTTP
// referente a esta orden de compra
function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const OrderScreen = () => {
  // recuperar el parametro de consulta en la URL (Id de orden de servicio)
  const { query } = useRouter();
  const orderId = query.id;

  // Pasar el estado inicial a la función reducer
  const [{ loading, order, error }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });

  // Efecto secundario
  // Cuando cargue esta página, se debe consultar al API de orden de servicio la información para esta orden en particular
  // Usamos el reducer para mantener la información en estado
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (!order._id || order._id != orderId) {
      // Evitar golpear el server cada vez que se haga un refresh de esta página
      // La info está en estado
      fetchOrder();
    }
  }, [orderId, order]);

  // Desestructurar el contenido de la orden de compra registrada en base de datos
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid,
    isDelivered,
    paidAt,
    deliveredAt,
  } = order;

  return (
    <Layout title={`Detalle - Orden ${orderId}`}>
      <h1 className="mb-4 text-lg">{`Detalle: Orden Núm. ${orderId}`}</h1>
      {loading ? (
        <div>Cargando...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Dirección de Entrega</h2>
              <div>
                {shippingAddress.fullName}. {shippingAddress.address},{" "}
                {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                {shippingAddress.country}
              </div>
              {isDelivered ? (
                <div className="alert-success">
                  Pedido entregado el {deliveredAt}
                </div>
              ) : (
                <div className="alert-error">Pendiente por entregar</div>
              )}
            </div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Método de Pago</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className="alert-success">Pagado el {paidAt}</div>
              ) : (
                <div className="alert-error">Pendiente por pagar</div>
              )}
            </div>
            <div className="card p-5 overflow-x-auto">
              <h2 className="mb-2 text-lg">Productos solicitados</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="p-5 text-left">Producto</th>
                    <th className="p-5 text-right">Cantidad</th>
                    <th className="p-5 text-right">Precio</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr className="border-b" key={item._id}>
                      <td className="p-5 text-left">
                        <Link href={`/product/${item.slug}`} className="flex items-center">
                          <Image
                            src={item.image}
                            alt={item.name}
                            height={50}
                            width={50}
                            className="mr-3"
                          />
                          {item.name}
                        </Link>
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
            </div>
          </div>
          <div className="card p-5 self-start">
            <h2 className="mb-2 text-lg">Detalle de la compra</h2>
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
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
};

OrderScreen.auth = true;
export default OrderScreen;

import Layout from "@/components/Layout";
import { getError } from "@/utils/error";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useReducer } from "react";

// Reducer con tareas relacionadas a la petición de ordenes de pedido
function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const OrderHistoryScreen = () => {
  // Usar la funcion reducer y establecer el estado inicial
  const [{ loading, orders, error }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: "",
  });
  // Efecto secundario para consultar todas las ordenes de pedidos para el usuario actualmente logeado
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Intentar recuperar las ordendes de servicio, e informar al store
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get("/api/orders/history");
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchOrders();
  }, []);
  return (
    <Layout title="Historial de Pedidos">
      <h2 className="mb-2 text-lg font-bold">Historial de Pedidos</h2>
      {loading ? (
        <div>Cargando...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-5">ID</th>
                <th className="text-left p-5">FECHA</th>
                <th className="text-left p-5">TOTAL</th>
                <th className="text-left p-5">PAGADO</th>
                <th className="text-left p-5">ENTREGADO</th>
                <th className="text-left p-5">ACCION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr className="border-b" key={order._id}>
                  <td className="text-left p-5">{order._id.substring(20, 24)}</td>
                  <td className="text-left p-5">{order.createdAt.substring(0, 10)}</td>
                  <td className="text-left p-5">${order.totalPrice}</td>
                  <td className="text-left p-5">{order.isPaid ? order.paidAt.substring(0, 10) : 'No pagada'}</td>
                  <td className="text-left p-5">{order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No entregada'}</td>
                  <td className="text-left p-5">
                    <Link href={`/order/${order._id}`}>Detalle</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

OrderHistoryScreen.auth = true;
export default OrderHistoryScreen;

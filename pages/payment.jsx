import CheckoutWizard from "@/components/CheckoutWizard";
import Layout from "@/components/Layout";
import { Store } from "@/utils/Store";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const options = ["Paypal", "Stripe", "CashOnDelivery"];
const PaymentScreen = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const { cart } = state;
  const {shippingAddress, paymentMethod} = cart

  // La dirección de entrega es requerida en este punto
  // Esta página se actualizará solo cuando el método de pago cambie
  useEffect(() => {
    if (!shippingAddress.address) {
        return router.push('/shipping')
    }
    setSelectedPaymentMethod(paymentMethod || '')
  }, [paymentMethod, shippingAddress.address, router])

  const submitHandler = (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      return toast.error("Seleccione un método de pago");
    }
    // Guardar en store y Cookie el método de pago seleccionado
    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: selectedPaymentMethod });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    );
    router.push("/placeorder");
  };
  return (
    <Layout title="Método de pago">
      <CheckoutWizard activeStep={2} />
      <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
        <h1 className="text-xl font-bold mb-4">Método de Pago</h1>
        {/* Opciones de método de pago */}
        {options.map((payment) => (
          <div key={payment} className="mb-4">
            <input
              type="radio"
              name="paymentMethod"
              id={payment}
              className="p-2 outline-none focus:ring-0"
              checked={selectedPaymentMethod === payment}
              onChange={() => setSelectedPaymentMethod(payment)}
            />
            <label htmlFor={payment} className="p-2">
              {payment}
            </label>
          </div>
        ))}
        <div className="mb-4 flex justify-between">
          <button
            type="button"
            className="default-button"
            onClick={() => router.push("/shipping")}
          >
            Regresar
          </button>
          <button className="primary-button">Siguiente</button>
        </div>
      </form>
    </Layout>
  );
};

PaymentScreen.auth = true;

export default PaymentScreen;

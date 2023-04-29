import Layout from '@/components/Layout';
import { Store } from '@/utils/Store';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';

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
      type: 'CART_REMOVE_ITEM',
      payload: item,
    });
  };

  return (
    <Layout title={'Carrito de compras'}>
      <h1 className='mb-4 text-xl'>Carrito de Compras</h1>
      {cartItems.length === 0 ? (
        <div>
          El carrito está vacio. <Link href={'/'}>Ir a comprar</Link>
        </div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <table className='min-w-full'>
              <thead className='border-b'>
                <tr>
                  <th className='px-5 text-left'>Artículo</th>
                  <th className='p-5 text-right'>Cantidad</th>
                  <th className='p-5 text-right'>Precio</th>
                  <th className='p-5 text-right'>Acción</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr className='border-b' key={item.slug}>
                    <td className='p-5'>
                      <Link
                        href={`products/${item.slug}`}
                        className='flex items-center'
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          className='mr-2'
                        />
                        {item.name}
                      </Link>
                    </td>
                    <td className='p-5 text-right'>{item.quantity}</td>
                    <td className='p-5 text-right'>${item.price}</td>
                    <td className='p-5 text-right'>
                      <button onClick={() => removeItemHandler(item)}>
                        <XCircleIcon className='h-5 w-5'></XCircleIcon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='card p-5 self-start'>
            <ul>
              <li>
                <div className='pb-3 text-lg'>
                  Subtotal (
                  {cartItems.reduce((acum, item) => acum + item.quantity, 0)}) -
                  ${' '}
                  {cartItems.reduce(
                    (acum, item) => acum + item.quantity * item.price,
                    0
                  )}
                </div>
              </li>
              <li>
                <button
                  onClick={() => router.push('/shipping')}
                  className='primary-button w-full'
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

export default CartScreen;

import CheckoutWizard from '@/components/CheckoutWizard'
import Layout from '@/components/Layout'
import { Store } from '@/utils/Store'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'

const ShippingScreen = () => {
  const {register, handleSubmit, setValue, formState: {errors}} = useForm()
  const router = useRouter();
  const {state, dispatch} = useContext(Store)
  const {cart} = state;
  const {shippingAddress} = cart;

  // Rellernar los campos del formulario con la información actualmente almacenada en el store
  useEffect(() => {
    setValue('fullName', shippingAddress.fullName)
    setValue('address', shippingAddress.address)
    setValue('city', shippingAddress.city)
    setValue('postalCode', shippingAddress.postalCode)
    setValue('country', shippingAddress.country)
  }, [shippingAddress, setValue]);

  const submitShippingAddressHandler = ({fullName, address, city, postalCode, country}) => {
    // Disparar acción para guardar información en el store
    dispatch({
        type: 'SAVE_SHIPPING_ADDRESS',
        payload: {fullName, address, city, postalCode, country}
    })
    // Guardar información en la Cookie
    Cookies.set('cart', JSON.stringify({
        ...cart,
        shippingAddres: {
            fullName,
            address,
            city,
            postalCode,
            country
        }
    }))
    // Redireccionar a la pantalla de método de pago
    router.push('/payment');
  }
  return (
    <Layout title='Dirección de compra'>
        <CheckoutWizard activeStep={1} />
        <form className='mx-auto max-w-screen-md' onSubmit={handleSubmit(submitShippingAddressHandler)}>
            <h1 className='mb-4 text-xl'>Shipping Address</h1>
            <div className='mb-4'>
                <label htmlFor="fullName">Nombre completo</label>
                <input className='w-full' id='fullName' autoFocus {...register('fullName', {required: 'El nombre es requerido'})} />
                {errors.fullName && (<div className='text-red-500'>{errors.fullName.message}</div>)}
            </div>
            <div className='mb-4'>
                <label htmlFor="address">Dirección</label>
                <input className='w-full' id='address' {...register('address', {required: 'La dirección es requerida'})} />
                {errors.address && (<div className='text-red-500'>{errors.address.message}</div>)}
            </div>
            <div className='mb-4'>
                <label htmlFor="city">Ciudad</label>
                <input className='w-full' id='city' {...register('city', {required: 'La ciudad es requerida'})} />
                {errors.city && (<div className='text-red-500'>{errors.city.message}</div>)}
            </div>
            <div className='mb-4'>
                <label htmlFor="postalCode">Código Postal</label>
                <input className='w-full' id='postalCode' {...register('postalCode', {required: 'El código postal es requerido'})} />
                {errors.postalCode && (<div className='text-red-500'>{errors.postalCode.message}</div>)}
            </div>
            <div className='mb-4'>
                <label htmlFor="country">País</label>
                <input className='w-full' id='country' {...register('country', {required: 'El país es requerido'})} />
                {errors.country && (<div className='text-red-500'>{errors.country.message}</div>)}
            </div>
            <div className='mb-4 flex justify-between'>
                <button className='primary-button'>Siguiente</button>
            </div>
        </form>
    </Layout>
  )
}

ShippingScreen.auth = true;

export default ShippingScreen
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const ProductItem = ({ product }) => {
  return (
    <article className='card'>
      <Link href={`product/${product.slug}`}>
        <Image
          src={product.image}
          alt={product.name}
          width={600}
          height={600}
          className='rounded shadow max-w-full'
        />
        <div className='flex flex-col justify-center items-center p-5'>
          <h3 className='text-lg'>{product.name}</h3>
          <p className='mb-2'>{product.brand}</p>
          <p className='mb-2'>${product.price}</p>
          <button className='primary-button' type='button'>
            Agregar al carrito
          </button>
        </div>
      </Link>
    </article>
  );
};

export default ProductItem;

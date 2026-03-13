import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  price: number
  images: string[]
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
        <div className="relative h-48">
          <Image
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
          <p className="text-purple-600 font-bold">${product.price}</p>
        </div>
      </div>
    </Link>
  )
}
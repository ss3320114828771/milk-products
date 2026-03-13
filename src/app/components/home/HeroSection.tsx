export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">Welcome to Our Store</h1>
        <p className="text-xl mb-8">Fresh dairy products delivered to your door</p>
        <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
          Shop Now
        </button>
      </div>
    </section>
  )
}
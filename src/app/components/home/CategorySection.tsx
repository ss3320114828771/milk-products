export default function CategorySection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['Milk', 'Cheese', 'Yogurt', 'Butter'].map((cat) => (
            <div key={cat} className="bg-white p-6 rounded-lg text-center hover:shadow-lg transition">
              <h3 className="font-semibold">{cat}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
// lib/constants/categories.ts
export const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    icon: '📱',
    subcategories: [
      { id: 'phones', name: 'Phones', slug: 'phones' },
      { id: 'laptops', name: 'Laptops', slug: 'laptops' },
      { id: 'accessories', name: 'Accessories', slug: 'accessories' },
    ],
  },
  {
    id: 'clothing',
    name: 'Clothing',
    slug: 'clothing',
    icon: '👕',
    subcategories: [
      { id: 'mens', name: "Men's", slug: 'mens' },
      { id: 'womens', name: "Women's", slug: 'womens' },
      { id: 'kids', name: "Kids'", slug: 'kids' },
    ],
  },
  {
    id: 'books',
    name: 'Books',
    slug: 'books',
    icon: '📚',
    subcategories: [
      { id: 'fiction', name: 'Fiction', slug: 'fiction' },
      { id: 'non-fiction', name: 'Non-Fiction', slug: 'non-fiction' },
      { id: 'textbooks', name: 'Textbooks', slug: 'textbooks' },
    ],
  },
]

export const getCategoryBySlug = (slug: string) => {
  return categories.find(cat => cat.slug === slug)
}

export const getSubcategoryBySlug = (categorySlug: string, subcategorySlug: string) => {
  const category = getCategoryBySlug(categorySlug)
  return category?.subcategories.find(sub => sub.slug === subcategorySlug)
}
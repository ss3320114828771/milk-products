import Image from 'next/image'
import Link from 'next/link'
import { 
  Heart, 
  Users, 
  Award, 
  Truck, 
  Leaf, 
  Shield, 
  Clock,
  Star,
  ChevronRight,
  Milk,
  Coffee,
  ShoppingBag,
  MapPin
} from 'lucide-react'

export const metadata = {
  title: 'About Us | MilkShop',
  description: 'Learn about MilkShop - our story, mission, values, and commitment to providing the freshest dairy products.',
}

export default function AboutPage() {
  const stats = [
    { value: '10+', label: 'Years of Excellence', icon: Award },
    { value: '50+', label: 'Farm Partners', icon: Leaf },
    { value: '100+', label: 'Dairy Products', icon: Milk },
    { value: '10k+', label: 'Happy Customers', icon: Users },
    { value: '24/7', label: 'Customer Support', icon: Clock },
    { value: '100%', label: 'Organic Options', icon: Shield },
  ]

  const values = [
    {
      icon: Leaf,
      title: '100% Organic',
      description: 'All our products are certified organic, ensuring the highest quality and purity.',
      color: 'green',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Rigorous testing at every stage to maintain premium standards.',
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Heart,
      title: 'Animal Welfare',
      description: 'We ensure ethical treatment of animals across all our partner farms.',
      color: 'red',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      icon: Truck,
      title: 'Farm to Table',
      description: 'Direct delivery from farms to ensure maximum freshness.',
      color: 'purple',
      gradient: 'from-purple-500 to-indigo-500'
    }
  ]

  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'With over 15 years in dairy industry, Sarah founded MilkShop with a vision to provide organic dairy to every home.',
      image: '/images/team/sarah.jpg',
      social: {
        twitter: '#',
        linkedin: '#',
        email: 'sarah@milkshop.com'
      }
    },
    {
      name: 'Michael Chen',
      role: 'Master Cheesemaker',
      bio: 'Trained in Italy and France, Michael brings artisanal cheese-making techniques to our products.',
      image: '/images/team/michael.jpg',
      social: {
        twitter: '#',
        linkedin: '#',
        email: 'michael@milkshop.com'
      }
    },
    {
      name: 'Emma Williams',
      role: 'Quality Control Head',
      bio: 'Emma ensures every product meets our strict quality standards before reaching customers.',
      image: '/images/team/emma.jpg',
      social: {
        twitter: '#',
        linkedin: '#',
        email: 'emma@milkshop.com'
      }
    },
    {
      name: 'Dr. Raj Patel',
      role: 'Sustainability Officer',
      bio: 'Dr. Patel leads our initiatives in sustainable farming and eco-friendly packaging.',
      image: '/images/team/raj.jpg',
      social: {
        twitter: '#',
        linkedin: '#',
        email: 'raj@milkshop.com'
      }
    }
  ]

  const timeline = [
    {
      year: '2014',
      title: 'The Beginning',
      description: 'MilkShop started as a small family farm with just 5 cows.',
      icon: Milk
    },
    {
      year: '2016',
      title: 'First Store',
      description: 'Opened our first retail store in downtown.',
      icon: ShoppingBag
    },
    {
      year: '2018',
      title: 'Organic Certification',
      description: 'Achieved 100% organic certification for all products.',
      icon: Leaf
    },
    {
      year: '2020',
      title: 'Online Launch',
      description: 'Launched our e-commerce platform for home delivery.',
      icon: Coffee
    },
    {
      year: '2022',
      title: '50 Farm Partners',
      description: 'Expanded to partner with 50+ local farms.',
      icon: Users
    },
    {
      year: '2024',
      title: '10K Customers',
      description: 'Served over 10,000 happy customers nationwide.',
      icon: Heart
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section with Parallax */}
      <div className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/images/about-hero.jpg"
            alt="Dairy Farm"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90 mix-blend-multiply" />
          
          {/* Animated Particles */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float animation-delay-2000" />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex justify-center items-center space-x-2 text-sm mb-8">
            <Link href="/" className="text-white/70 hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-white/50" />
            <span className="text-white font-semibold">About Us</span>
          </nav>

          {/* Badge */}
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
            <Heart className="w-4 h-4 text-pink-300 mr-2" />
            <span className="text-sm font-medium">Our Story</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Crafting Dairy
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              With Love & Care
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto">
            From humble beginnings to becoming your trusted dairy partner, 
            our journey has been driven by passion, quality, and commitment to excellence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="group px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Explore Products</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-full font-semibold hover:bg-white/10 hover:border-white/50 transform hover:scale-105 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section with Counter Animation */}
      <div className="relative -mt-20 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-center group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-blue-100 rounded-full px-4 py-2">
              <Heart className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">Our Journey</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold">
              From Farm to
              <span className="block text-gradient">Your Table</span>
            </h2>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              Founded in 2014, Milk Products Shop began with a simple mission: 
              to provide families with the freshest, highest-quality dairy products 
              straight from local farms. What started as a small family operation 
              with just 5 cows has grown into a trusted name in dairy, serving 
              thousands of customers across the region.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              Today, we partner with over 50 family-owned farms, all committed to 
              sustainable and ethical farming practices. Our cows are grass-fed, 
              never treated with hormones or antibiotics, ensuring you get nothing 
              but pure, wholesome goodness in every product.
            </p>

            {/* Key Points */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                '100% Organic',
                'Grass-fed Cows',
                'No Hormones',
                'Sustainable',
                'Ethical Farming',
                'Family Owned'
              ].map((point, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                  <span className="text-gray-700">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative h-48 rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-500">
                <Image
                  src="/images/farm-1.jpg"
                  alt="Dairy Farm"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-64 rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-500">
                <Image
                  src="/images/farm-2.jpg"
                  alt="Fresh Milk"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="relative h-64 rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-500">
                <Image
                  src="/images/farm-3.jpg"
                  alt="Cheese Making"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-48 rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-500">
                <Image
                  src="/images/farm-4.jpg"
                  alt="Happy Cows"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white/50 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-purple-100 rounded-full px-4 py-2 mb-4">
              <Star className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">Our Values</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What We Stand
              <span className="block text-gradient">For</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${value.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                  
                  {/* Decorative Line */}
                  <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${value.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-100 rounded-full px-4 py-2 mb-4">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">Our Timeline</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Milestones of
            <span className="block text-gradient">Excellence</span>
          </h2>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full hidden lg:block" />

          <div className="space-y-12">
            {timeline.map((item, index) => {
              const Icon = item.icon
              const isEven = index % 2 === 0
              
              return (
                <div key={index} className={`relative flex flex-col lg:flex-row ${isEven ? '' : 'lg:flex-row-reverse'} items-center gap-8`}>
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-white hidden lg:block" />
                  
                  {/* Content */}
                  <div className={`lg:w-1/2 ${isEven ? 'lg:text-right lg:pr-12' : 'lg:pl-12'}`}>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-blue-600">{item.year}</span>
                          <h3 className="text-xl font-bold">{item.title}</h3>
                        </div>
                      </div>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Empty space for other side */}
                  <div className="lg:w-1/2" />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white/50 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-pink-100 rounded-full px-4 py-2 mb-4">
              <Users className="w-4 h-4 text-pink-600" />
              <span className="text-sm font-semibold text-pink-600">Our Team</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Meet the People
              <span className="block text-gradient">Behind the Milk</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Social Icons */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-3 z-20 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <a
                      href={member.social.twitter}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a
                      href={member.social.linkedin}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    <a
                      href={`mailto:${member.social.email}`}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-sm text-blue-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Locations Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 bg-green-100 rounded-full px-4 py-2 mb-4">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">Visit Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our
              <span className="block text-gradient">Locations</span>
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Visit our stores or farms to experience freshness firsthand. 
              We have multiple locations across the region.
            </p>

            <div className="space-y-4">
              {[
                { city: 'New York', address: '123 Dairy Lane, NY 10001', phone: '+1 (212) 555-0123' },
                { city: 'Los Angeles', address: '456 Farm Road, LA 90001', phone: '+1 (323) 555-0456' },
                { city: 'Chicago', address: '789 Milk Street, IL 60601', phone: '+1 (312) 555-0789' }
              ].map((location, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="font-bold text-lg mb-2">{location.city}</h3>
                  <p className="text-gray-600 text-sm mb-1">{location.address}</p>
                  <p className="text-blue-600 text-sm">{location.phone}</p>
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="mt-8 bg-gray-200 h-48 rounded-xl overflow-hidden relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="w-12 h-12 text-blue-600 animate-bounce" />
                <span className="ml-2 text-gray-600">View on Google Maps</span>
              </div>
            </div>
          </div>

          {/* CTA Cards */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white transform hover:scale-105 transition-all duration-500">
              <h3 className="text-2xl font-bold mb-4">Join Our Family</h3>
              <p className="text-white/80 mb-6">
                Become a part of the MilkShop family and enjoy exclusive benefits, 
                discounts, and early access to new products.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <span>Sign Up Now</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-all duration-500">
              <h3 className="text-2xl font-bold mb-4 text-gradient">Farm Tours</h3>
              <p className="text-gray-700 mb-6">
                Visit our farms and see how we produce the freshest dairy products. 
                Free guided tours every weekend.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center space-x-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                <span>Book a Tour</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl text-white/80 mb-8">
            Subscribe to our newsletter for exclusive offers, new products, and farm updates.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
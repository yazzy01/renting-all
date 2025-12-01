import Link from 'next/link'

const CTA = () => {
  return (
    <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left space-y-6">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">
              Ready to get started?
            </h2>
            <p className="text-xl text-green-100">
              Join thousands of users renting vehicles the smart way. No hidden fees, no middlemen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link 
                href="/auth/register" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-green-600 bg-white rounded-xl hover:bg-green-50 transform hover:scale-105 transition-all duration-200 shadow-xl"
              >
                Sign up free
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link 
                href="/listings" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-xl hover:bg-white hover:text-green-600 transform hover:scale-105 transition-all duration-200"
              >
                Browse vehicles
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-white">$25/day</div>
                <div className="text-green-100 mt-1">Average Price</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-white">4.8★</div>
                <div className="text-green-100 mt-1">User Rating</div>
              </div>
            </div>
            <div className="space-y-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-green-100 mt-1">Support</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-green-100 mt-1">Secure</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CTA 
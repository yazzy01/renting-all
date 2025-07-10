import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">RentingAll</h3>
            <p className="text-gray-300 text-sm">From Bikes to Cars, Directly from Owners</p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-white text-sm">About Us</Link></li>
              <li><Link href="/careers" className="text-gray-300 hover:text-white text-sm">Careers</Link></li>
              <li><Link href="/press" className="text-gray-300 hover:text-white text-sm">Press</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-gray-300 hover:text-white text-sm">Help Center</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white text-sm">Contact Us</Link></li>
              <li><Link href="/safety" className="text-gray-300 hover:text-white text-sm">Safety</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-gray-300 hover:text-white text-sm">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-white text-sm">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="text-gray-300 hover:text-white text-sm">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-gray-300 text-sm">© {new Date().getFullYear()} RentingAll. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-300 hover:text-white">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.235.575 1.8 1.137.562.563.888 1.13 1.136 1.8.247.635.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.137 1.8c-.563.562-1.13.888-1.8 1.136-.635.247-1.363.416-2.427.465-1.1.048-1.44.06-4.12.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.8-1.137c-.562-.563-.888-1.13-1.136-1.8-.247-.635-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.137-1.8c.563-.562 1.13-.888 1.8-1.136.635-.247 1.363-.416 2.427-.465C9.29 2.013 9.635 2 12 2h.315zm-.912 2.005h-.312c-2.352 0-2.687.01-3.66.055-.855.04-1.337.182-1.65.301-.41.16-.7.347-1.005.653-.305.304-.494.644-.653 1.005-.12.312-.262.795-.3 1.65-.047 1.013-.058 1.341-.058 3.971v.312c0 2.353.01 2.688.056 3.66.041.855.183 1.337.302 1.65.161.41.347.7.653 1.005.305.304.644.494 1.005.653.312.12.795.261 1.65.3.988.047 1.321.059 3.96.059h.31c2.353 0 2.688-.01 3.66-.056.855-.041 1.337-.182 1.65-.301.41-.162.7-.348 1.005-.654.303-.303.493-.644.652-1.005.12-.312.262-.794.302-1.649.046-1.014.058-1.342.058-3.961v-.312c0-2.352-.01-2.687-.056-3.66-.041-.855-.183-1.337-.302-1.65a2.741 2.741 0 00-.653-1.004 2.739 2.739 0 00-1.005-.653c-.312-.12-.795-.262-1.65-.301-1.014-.046-1.343-.059-3.972-.059zm1.597 5.457a4 4 0 11-8 0 4 4 0 018 0zm-3.098 2.539a2.539 2.539 0 100-5.078 2.539 2.539 0 000 5.078z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 
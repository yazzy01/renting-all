import Link from 'next/link'

const CTA = () => {
  return (
    <div className="bg-primary">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">Ready to get started?</span>
          <span className="block text-white opacity-75">Join our community today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Link href="/auth/register" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50">
              Sign up
            </Link>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <Link href="/listings" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-secondary hover:bg-opacity-90">
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CTA 
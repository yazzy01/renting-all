import Image from 'next/image'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import CTA from '@/components/CTA'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <CTA />
    </div>
  )
} 
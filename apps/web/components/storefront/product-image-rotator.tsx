'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ProductImageRotatorProps {
  images: string[]
  alt: string
}

export function ProductImageRotator({ images, alt }: ProductImageRotatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!isHovered || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 800)

    return () => clearInterval(interval)
  }, [isHovered, images.length])

  if (images.length === 0) return null

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setCurrentIndex(0)
      }}
    >
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
          }`}
          style={{
            transform: index === currentIndex ? 'rotateY(0deg)' : `rotateY(${(index - currentIndex) * 15}deg)`,
            zIndex: index === currentIndex ? 10 : 1,
          }}
        >
          <Image
            src={img}
            alt={`${alt} - Image ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}
      
      {/* Image indicators */}
      {images.length > 1 && isHovered && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-20">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

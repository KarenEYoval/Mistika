"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  { src: "/images/carousel/Home.jpg", alt: "Mistika" },
  { src: "/images/carousel/Vela.jpg", alt: "Velas artesanales" },
  { src: "/images/carousel/Materiales.jpg", alt: "Materiales naturales" },
  { src: "/images/carousel/Palos.jpg", alt: "Rituales y aromas" },
];

export default function ProductCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative w-screen overflow-hidden">
      <div className="relative h-screen sm:h-[80vh] sm:min-h-[600px] w-full">
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/35" />
          </div>
        ))}

        <div className="absolute inset-0 flex items-end justify-center pb-6">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ir a la diapositiva ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === index ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

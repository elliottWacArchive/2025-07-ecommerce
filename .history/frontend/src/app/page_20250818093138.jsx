"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/Header";

export default function Home() {
  const router = useRouter();

  const images = [
    "/images/carousel1.jpg",
    "/images/carousel2.jpg",
    "/images/carousel3.jpg",
  ];
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <main className="min-h-screen bg-[#F7F4FF]">
      <Header />
      <section className="relative w-full h-[400px] overflow-hidden flex items-center justify-center bg-[#E9E5FF]">
        <Image
          src={images[current]}
          alt="Carousel"
          width={1920}
          height={400}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-[#E9E5FF]/70 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Je découvre
          </h1>
          <button
            onClick={() => router.push("/shop")}
            className="mt-6 bg-[#FC87D2] hover:bg-[#f56dc0] transition text-white font-semibold py-2 px-6 rounded-full"
          >
            Boutique
          </button>
        </div>

        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
        >
          ◀
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
        >
          ▶
        </button>
      </section>

      <section className="px-6 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">
          Nos gammes de produits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => router.push("/category?category=Parfums")}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 text-center cursor-pointer"
          >
            <Image
              src="/images/parfums.jpg"
              alt="Parfums"
              width={400}
              height={250}
              className="w-full h-48 object-cover rounded-md"
            />
            <p className="mt-4 text-gray-700 font-medium">
              Plus de 100 parfums pour toutes les envies
            </p>
          </div>

          <div
            onClick={() => router.push("/category?category=Coffrets")}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 text-center cursor-pointer"
          >
            <Image
              src="/images/rituels.jpg"
              alt="Rituels beauté"
              width={400}
              height={250}
              className="w-full h-48 object-cover rounded-md"
            />
            <p className="mt-4 text-gray-700 font-medium">
              Nos rituels beauté et coffrets
            </p>
          </div>

          <div
            onClick={() => router.push("/category?category=Soins")}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 text-center cursor-pointer"
          >
            <Image
              src="/images/soins.jpg"
              alt="Soins naturels"
              width={400}
              height={250}
              className="w-full h-48 object-cover rounded-md"
            />
            <p className="mt-4 text-gray-700 font-medium">
              Des soins naturels d’exceptions conçus en France
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 px-6 py-12 bg-[#E9E5FF]">
  <div
    onClick={() => router.push("/a-propos")}
    className="relative cursor-pointer group w-3/4 mx-auto aspect-square rounded-xl overflow-hidden shadow-lg"
  >
    <Image
      src="/images/offres.jpeg"
      alt="Nos Offres"
      fill
      className="object-cover"
    />
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <button className="bg-[#FC87D2] text-white px-6 py-2 rounded-full shadow-md">
        Nos Offres
      </button>
    </motion.div>
  </div>

  <div
    onClick={() => router.push("/a-propos")}
    className="relative cursor-pointer group w-3/4 mx-auto aspect-square rounded-xl overflow-hidden shadow-lg"
  >
    <Image
      src="/images/nouveautes.jpeg"
      alt="Nos Nouveautés"
      fill
      className="object-cover"
    />
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <button className="bg-[#9A87FC] text-white px-6 py-2 rounded-full shadow-md">
        Nos Nouveautés
      </button>
    </motion.div>
  </div>
</section>


      <section className="px-6 py-12 text-center  bg-purple-50">
        <h2 className="text-3xl font-bold mb-6">L’Univers Epicosmétique</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => router.push("/a-propos")}
            className="bg-white shadow rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition"
          >
            <Image
              src="/images/engagements.jpg" 
              alt="Nos engagements"
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-2">Nos engagements</h3>
              <p className="text-gray-600">
                Des ingrédients naturels, une fabrication responsable et une
                démarche respectueuse de l’environnement à chaque étape.
              </p>
            </div>
          </div>

          <div
            onClick={() => router.push("/a-propos")}
            className="bg-white shadow rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition"
          >
            <Image
              src="/images/valeurs.jpg"
              alt="Nos valeurs"
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-2">Nos valeurs</h3>
              <p className="text-gray-600">
                Authenticité, transparence et excellence : trois piliers qui
                guident chacun de nos choix pour offrir des soins d’exception.
              </p>
            </div>
          </div>

          <div
            onClick={() => router.push("/a-propos")}
            className="bg-white shadow rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition"
          >
            <Image
              src="/images/histoire.jpg"
              alt="Notre histoire"
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-2">Notre histoire</h3>
              <p className="text-gray-600">
                Née d’une passion pour la cosmétique naturelle, Epicosmétique
                allie savoir-faire français et innovation durable.
              </p>
            </div>
          </div>
        </div>
      </section>

<section className="w-full h-f py-12 bg-[#E9E5FF]">
  <div className="relative w-full h-64 md:h-80 overflow-hidden">
    <Image
      src="/images/offres.jpeg" 
      alt="Bannière promotionnelle"
      fill
      className="object-cover"
    />
  </div>
</section>


      <section className="px-6 py-12 bg-purple-50">
        <h2 className="text-3xl font-bold text-center mb-8">
          Ce que nos utilisateurs en pensent !
        </h2>

        {(() => {
          const reviews = [
            {
              name: "Sophie L.",
              review:
                "J’adore ces produits ! Ma peau est beaucoup plus douce et lumineuse depuis que je les utilise.",
              date: "12 août 2025",
              avatar: "/images/avatar1.jpg",
            },
            {
              name: "Karim B.",
              review:
                "Une expérience incroyable, les textures sont agréables et l’odeur naturelle est juste parfaite.",
              date: "10 août 2025",
              avatar: "/images/avatar2.jpg",
            },
            {
              name: "Elisa D.",
              review:
                "Enfin une marque transparente et respectueuse de l’environnement. Bravo Epicosmétique !",
              date: "8 août 2025",
              avatar: "/images/avatar3.jpg",
            },
            {
              name: "Marc T.",
              review:
                "Livraison rapide, packaging éco-responsable et surtout des produits efficaces. Je recommande à 100% !",
              date: "6 août 2025",
              avatar: "/images/avatar4.jpg",
            },
          ];

          const [current, setCurrent] = useState(0);

          useEffect(() => {
            const interval = setInterval(() => {
              setCurrent((prev) => (prev >= reviews.length - 3 ? 0 : prev + 1));
            }, 3000);
            return () => clearInterval(interval);
          }, [reviews.length]);

          return (
            <div className="relative">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500"
                  style={{ transform: `translateX(-${current * (100 / 3)}%)` }}
                >
                  {reviews.map((item, i) => (
                    <div key={i} className="flex-shrink-0 w-1/3 px-3">
                      <div className="bg-white shadow-lg rounded-2xl p-6 h-full flex flex-col justify-between text-center">
                        <p className="text-yellow-500 text-xl mb-3">
                          ⭐⭐⭐⭐⭐
                        </p>
                        <p className="text-gray-600 italic">“{item.review}”</p>
                        <div className="flex items-center justify-center mt-6">
                          <Image
                            src={item.avatar}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded-full"
                          />
                          <div className="ml-3 text-left">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-xs text-gray-400">{item.date}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </section>
    </main>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/Header";

export default function Home() {
  const router = useRouter();

  // Carousel simple
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
      {/* Carousel */}
      

      {/* Nos gammes de produits */}
      <section className="px-6 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">
          Nos gammes de produits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 text-center cursor-pointer">
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
          <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 text-center cursor-pointer">
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
          <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 text-center cursor-pointer">
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

      {/* Nos offres & nouveautés */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-10">
        <div
          onClick={() => router.push("/apropos")}
          className="relative cursor-pointer group"
        >
          <Image
            src="/images/offres.jpg"
            alt="Nos Offres"
            width={600}
            height={400}
            className="w-full h-64 object-cover rounded-xl"
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
          onClick={() => router.push("/apropos")}
          className="relative cursor-pointer group"
        >
          <Image
            src="/images/nouveautes.jpg"
            alt="Nos Nouveautés"
            width={600}
            height={400}
            className="w-full h-64 object-cover rounded-xl"
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

      {/* Univers Epicosmetique */}
      <section className="px-6 py-12 text-center">
        <h2 className="text-3xl font-bold mb-6">L’Univers Epicosmetique</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-2">Nos engagements</h3>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-2">Nos valeurs</h3>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-2">Notre histoire</h3>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>
      </section>

      {/* Carousel avis utilisateurs */}
      <section className="px-6 py-12">
        <h2 className="text-2xl font-bold text-center mb-6">
          Ce que nos utilisateurs en pensent !
        </h2>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="min-w-[250px] bg-white shadow rounded-xl p-4 flex flex-col items-center text-center"
            >
              <p className="text-yellow-500">⭐⭐⭐⭐⭐</p>
              <h4 className="font-semibold mt-2">Ajouter un avis</h4>
              <p className="text-gray-500 text-sm">Review body</p>
              <div className="flex items-center mt-3">
                <Image
                  src="/images/avatar.jpg"
                  alt="User"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="ml-2 text-left">
                  <p className="text-sm font-semibold">Pseudo utilisateur</p>
                  <p className="text-xs text-gray-400">Date</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

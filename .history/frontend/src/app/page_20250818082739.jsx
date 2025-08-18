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
      {/* Carousel avec titre et bouton */}
<section className="relative w-full h-[400px] overflow-hidden flex items-center justify-center bg-[#E9E5FF]">
  <Image
    src={images[current]}
    alt="Carousel"
    width={1920}
    height={400}
    className="w-full h-full object-cover"
  />

  {/* Overlay avec fond légèrement violet */}
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

  {/* Boutons navigation */}
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

      {/* Nos gammes de produits */}
<section className="px-6 py-12">
  <h2 className="text-2xl font-bold text-center mb-8">
    Nos gammes de produits
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Carte Parfums */}
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

    {/* Carte Rituels beauté → Coffrets */}
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

    {/* Carte Soins */}
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
<section className="px-6 py-12 text-center bg-gray-50">
  <h2 className="text-3xl font-bold mb-6">L’Univers Epicosmétique</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    
    {/* Engagements */}
    <div
      onClick={() => router.push("/apropos")}
      className="bg-white shadow rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition"
    >
      <Image
        src="/images/engagements.jpg" // mets ton image dans /public/images/
        alt="Nos engagements"
        width={400}
        height={250}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-2">Nos engagements</h3>
        <p className="text-gray-600">
          Des ingrédients naturels, une fabrication responsable et une démarche
          respectueuse de l’environnement à chaque étape.
        </p>
      </div>
    </div>

    {/* Valeurs */}
    <div
      onClick={() => router.push("/apropos")}
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
          Authenticité, transparence et excellence : trois piliers qui guident
          chacun de nos choix pour offrir des soins d’exception.
        </p>
      </div>
    </div>

    {/* Histoire */}
    <div
      onClick={() => router.push("/apropos")}
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
          Née d’une passion pour la cosmétique naturelle, Epicosmétique allie
          savoir-faire français et innovation durable.
        </p>
      </div>
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

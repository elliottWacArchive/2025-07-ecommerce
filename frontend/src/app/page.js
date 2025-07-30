import React from "react";

export default function Page() {
  return (
    <div className="bg-[#E7D8F6] text-gray-800 font-sans">
    
      <nav className="bg-white shadow-sm py-4 px-6 md:px-20 flex flex-wrap items-center justify-between text-black">
        <div className="flex flex-wrap items-center gap-6 text-sm md:text-base">
          <span className="font-bold text-lg mr-4">Epicosmétique</span>
          <a href="#">Actualités</a>
          <a href="#">Parfum</a>
          <a href="#">Corps</a>
          <a href="#">Visage</a>
          <a href="#">Maquillage</a>
          <a href="#">À propos</a>
          <a href="#">Favoris</a>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <button className="border border-black px-4 py-1 rounded-full">Mon compte</button>
          <button className="border border-black px-4 py-1 rounded-full">Panier</button>
        </div>
      </nav>

    
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-[#1F1B2E]">Je découvre</h1>
        <p className="text-[#6B5B95]">Subtitle</p>
      </div>

     
      <section className="px-6 md:px-20 py-10">
        <h2 className="text-2xl font-semibold mb-6">Nos gammes de produits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Plus de 100 parfums pour tous les envies" />
          <Card title="Nos soins beauté en coffrets à 25%" />
          <Card title="Les soins créés et confectionnés en France" />
        </div>
        <div className="flex justify-center gap-4 mt-6">
          <button className="bg-pink-400 text-white font-semibold px-6 py-2 rounded-full">Nos Offres</button>
          <button className="bg-[#B9A3E3] text-white font-semibold px-6 py-2 rounded-full">Nos Nouveautés</button>
        </div>
      </section>

     
      <section className="bg-[#F3EFFE] px-6 md:px-20 py-10">
        <h2 className="text-2xl font-semibold mb-6">L’Univers Epicosmetique</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Nos engagements" text="Découvrez nos actions pour un monde plus sain et plus vert." />
          <Card title="Nos valeurs" text="Excellence, qualité, confiance : des engagements au cœur de nos produits." />
          <Card title="Notre histoire" text="Les moments forts qui ont marqué notre développement." />
        </div>
      </section>

      <section className="px-6 md:px-20 py-10">
        <h2 className="text-2xl font-semibold mb-6">Ce que nos utilisateurs en pensent</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Review />
          <Review />
          <Review />
        </div>
      </section>
    </div>
  );
}

function Card({ title, text }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <div className="bg-[#E6E6FA] h-32 rounded-md mb-4"></div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
}

function Review() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <div className="flex items-center gap-1 text-pink-400 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}>★</span>
        ))}
      </div>
      <h4 className="font-semibold">Ajouter un avis</h4>
      <p className="text-sm text-gray-600 mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="bg-gray-200 h-6 w-6 rounded-full" />
        <span>Utilisateur</span>
        <span>·</span>
        <span>07/2025</span>
      </div>
    </div>
  );
}

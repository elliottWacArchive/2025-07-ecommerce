export default function Home() {
  return (
 <div className="font-sans bg-gray-100 min-h-screen flex flex-col">
     
 <header className="bg-white border-b border-gray-300 py-6 text-center">
 <div className="text-4xl font-light tracking-widest">
 <span className="text-blue-600 font-bold text-5xl mr-2"></span>
         [EPI] PARFUMS
 </div>
 </header>
   
 <nav className="bg-black text-white text-sm py-2 px-4 flex justify-between">
 <div className="space-x-6">
 <span className="cursor-pointer">Nous contacter</span>
 <span className="cursor-pointer">Une question ?</span>
 <span className="cursor-pointer">Espace  conseil</span>
 <span className="cursor-pointer">Nos Parfumeries</span>
 <span className="cursor-pointer">Coffrets parfums</span>
 <span className="cursor-pointer">Presse</span>
 <span className="cursor-pointer">Vidéo</span>
 </div>
 <div>FR | EN</div>
 </nav>
   
 <main className="flex-grow p-10 text-center bg-white">
 <h2 className="text-2xl font-medium tracking-wider mb-10">
          SÉLECTION COFFRET
 </h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {[
            { name: 'DIESEL', price: '32,507687687687678€' },
            { name: 'CACHAREL', price: '39,80€' },
            { name: 'AZZARO', price: '41,50€' },
            { name: 'DIESEL', price: '31,00€' },
            { name: 'CACHAREL', price: '42,00€' },
          ].map((p, i) => (
 <div key={i} className="border border-gray-200 p-4 rounded shadow-sm bg-gray-50">
 <div className="h-36 mb-4 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
             
 </div>
 <h3 className="font-bold">{p.name}</h3>
 <p className="text-gray-600 text-sm">Coffret Parfum</p>
 <p className="font-semibold mt-2 text-black">{p.price}</p>
 </div>
          ))}
 </div>
 </main>
    
 <footer className="bg-black text-gray-300 text-sm py-8 px-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
 <div>
 <h4 className="font-bold mb-2">COMPANY</h4>
 <ul className="space-y-1">
 <li>About EPIparfums</li>
 <li>Contact Us</li>
 <li>Jobs</li>
 <li>Features</li>
 </ul>
 </div>
 <div>
 <h4 className="font-bold mb-2">HELP</h4>
 <ul className="space-y-1">
 <li>Track My Music</li>
 <li>Community Support</li>
 <li>Community Guidelines</li>
 </ul>
 </div>
 <div>
 <h4 className="font-bold mb-2">GOODIES</h4>
 <ul className="space-y-1">
 <li>Download Scrobbler</li>
 <li>Developer API</li>
 <li>Free Music Downloads</li>
 <li>Merchandise</li>
 </ul>
 </div>
 <div>
 <h4 className="font-bold mb-2">ACCOUNT</h4>
 <ul className="space-y-1">
 <li>Sign Up</li>
 <li>Log In</li>
 <li>Subscribe</li>
 </ul>
 </div>
 <div>
 <h4 className="font-bold mb-2">FOLLOW US</h4>
 <ul className="space-y-1">
 <li>Facebook</li>
 <li>Twitter</li>
 <li>Instagram</li>
 <li>YouTube</li>
 </ul>
 </div>
 </footer>
 </div>
  );
 }
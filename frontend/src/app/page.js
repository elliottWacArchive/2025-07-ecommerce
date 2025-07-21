export default function Home() {
  return (
    <div className="font-sans">
      {/* Header */}
      <header className="bg-white shadow p-4 text-center text-2xl font-bold text-blue-600">
        [E] PARFUMS
      </header>

      {/* Main */}
      <main className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-8">SÉLECTION COFFRET</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {[
            { name: 'DIESEL', price: '32,50€' },
            { name: 'CACHAREL', price: '39,80€' },
            { name: 'AZZARO', price: '41,50€' },
            { name: 'DIESEL', price: '31,00€' },
            { name: 'CACHAREL', price: '42,00€' },
          ].map((p, i) => (
            <div key={i} className="border p-4 rounded shadow">
              <div className="h-32 bg-gray-100 mb-4">Image</div>
              <h3 className="font-bold">{p.name}</h3>
              <p className="text-gray-600">Coffret Parfum</p>
              <p className="font-semibold mt-2">{p.price}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

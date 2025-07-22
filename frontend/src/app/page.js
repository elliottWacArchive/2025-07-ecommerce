'use client';

import Image from 'next/image';

export default function Home() {
  return (
    <div className="page">
      <div className="header">
      <center>
        <h1> [E]  PARFUMS</h1>
        </center>
      </div>

      <section className="selection-coffret">
        <h2>SÉLECTION COFFRET</h2>
        <div className="coffret-grid">
          {[
            { brand: 'DIESEL', name: 'Only The Brave', price: '32,50 €' },
            { brand: 'CACHAREL', name: 'Yes I Am', price: '39,80 €' },
            { brand: 'AZZARO', name: 'Chrome', price: '41,50 €' },
            { brand: 'DIESEL', name: 'D by Diesel', price: '31,00 €' },
            { brand: 'CACHAREL', name: 'Yes I Am Bloom Up', price: '42,00 €' },
          ].map((item, index) => (
            <div key={index} className="coffret-item">
              <h3>{item.brand}</h3>
              <p>Coffret Parfum<br />{item.name}</p>
              <span className="price">{item.price}</span>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        .page {
          margin: 0;
          padding: 0;
          font-family: Arial , sans-serif;
          background-color: #a7a7a7;
          min-height: 100vh;
        }

        .header {
          display: flex;
          align-items: center;
          padding: 20px 40px;
          background-color: #cccccc;
        }

        .header h1 {
          font-size: 32px;
          margin-left: 20px;
          color: #000;
        }

        .selection-coffret {
          background-color: #ffffff;
          padding: 40px 20px;
          margin: 40px auto;
          max-width: 1200px;
          border: 5px solid #ff00ff;
          text-align: center;
        }

        .selection-coffret h2 {
          font-size: 24px;
          letter-spacing: 2px;
          margin-bottom: 40px;
          color: #000;
        }

        .coffret-grid {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 20px;
        }

        .coffret-item {
          width: 180px;
          background: #f8f8f8;
          border-radius: 8px;
          padding: 10px;
        }

        .coffret-item h3 {
          font-size: 16px;
          font-weight: bold;
          margin: 10px 0 5px;
          color: #000;
        }

        .coffret-item p {
          font-size: 14px;
          margin: 0 0 10px;
          color: #333;
        }

        .price {
          font-weight: bold;
          font-size: 16px;
          color: #000;
        }
      `}</style>
    </div>
  );
}

'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/Api/fauxProductController.php')   
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Erreur sur le chargement des produits ainsi que des prix:', err));
  }, []);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <span style={styles.logo}>[E]</span>
          <span style={styles.brand}>PARFUMS</span>
        </div>
      </header>

      <section style={styles.selection}>
        <h2 style={styles.selectionTitle}>SÉLECTION COFFRET</h2>
        <div style={styles.grid}>
          {products.map((item, index) => (
            <div key={index} style={styles.coffret}>
              <h3 style={styles.brandName}>{item.brand}</h3>
              <p style={styles.coffretDesc}>
                Coffret Parfum<br />{item.name}
              </p>
              <span style={styles.price}>{item.price}</span>
            </div>
          ))}
        </div>
      </section>

      <footer style={styles.footer}>
        <p style={styles.footerText}>FACEBOOK INSTAGRAM TWITTER PINTEREST</p>
      </footer>
    </div>
  );
}

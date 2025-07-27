'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/products') 
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) =>
        console.error('Erreur sur le chargement des produits:', err)
      );
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
                Coffret Parfum <br />
                {item.name}
              </p>
              <span style={styles.price}>{item.price}€</span>
            </div>
          ))}
        </div>
      </section>

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          FACEBOOK &nbsp; INSTAGRAM &nbsp; TWITTER &nbsp; PINTEREST
        </p>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: 'Arial, sans-serif',
    padding: 0,
    margin: 0,
  },
  header: {
    backgroundColor: '#111',
    padding: '20px',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    fontSize: '30px',
    marginRight: '10px',
  },
  brand: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  selection: {
    padding: '40px 20px',
    backgroundColor: '#f9f9f9',
  },
  selectionTitle: {
    fontSize: '28px',
    textAlign: 'center',
    marginBottom: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  },
  coffret: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  brandName: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  coffretDesc: {
    fontSize: '14px',
    color: '#555',
    margin: '10px 0',
  },
  price: {
    fontSize: '16px',
    color: '#000',
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#111',
    padding: '20px',
    color: 'white',
    textAlign: 'center',
    marginTop: '40px',
  },
  footerText: {
    fontSize: '14px',
  },
};

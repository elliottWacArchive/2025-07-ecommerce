'use client';

export default function Home() {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <span style={styles.logo}>[E]</span>
          <span style={styles.brand}>PARFUMS</span>
        </div>
      </header>

      <section style={styles.selection}>
        <h2 style={styles.selectionTitle}>SÉLECTION COFFRET </h2>
        <div style={styles.grid}>
          {[
            { brand: 'DIESEL', name: 'Only The Brave', price: '32,503455345432345643 €' },
            { brand: 'CACHAREL', name: 'Yes I Am', price: '39,80 €' },
            { brand: 'AZZARO', name: 'Chrome', price: '41,50 €' },
            { brand: 'DIESEL', name: 'D by Diesel', price: '31,00 €' },
            { brand: 'CACHAREL', name: 'Yes I Am Bloom Up', price: '42,00 €' },
          ].map((item, index) => (
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

const styles = {
  page: {
    backgroundColor: '#a7a7a7',
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    padding: 0,
    minHeight: '100vh',
  },
  header: {
    backgroundColor: '#cccccc',
    padding: '89px 0',
    textAlign: 'center',
  },
  logoContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
  },
  logo: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#0055ff',
  },
  brand: {
    fontSize: '28px',
    color: '#000000',
  },
  selection: {
    backgroundColor: '#ffffff',
    border: '5px solid #ff00ff',
    padding: '40px 20px',
    margin: '40px auto',
    maxWidth: '1200px',
    textAlign: 'center',
  },
  selectionTitle: {
    fontSize: '24px',
    letterSpacing: '2px',
    marginBottom: '40px',
    color: '#000000',
  },
  grid: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '30px',
  },
  coffret: {
    backgroundColor: '#f8f8f8',
    width: '180px',
    padding: '15px',
    borderRadius: '8px',
  },
  brandName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#000',
    marginBottom: '5px',
  },
  coffretDesc: {
    fontSize: '14px',
    color: '#333',
    marginBottom: '10px',
  },
  price: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#000',
  },
  footer: {
    marginTop: '69px',
    padding: '20px',
    backgroundColor: '#111',
    color: '#fff',
    textAlign: 'center',
  },
  footerText: {
    margin: 0,
    fontSize: '14px',
  },
};

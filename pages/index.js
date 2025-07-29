import { useState } from 'react';

export default function Home() {
  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState('Ev');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = ['Ev', 'Araç', 'Elektronik', 'Diğer'];

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setAnswer('');

    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionText, category }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setAnswer(data.aiAnswer);
    } else {
      setAnswer('Bir hata oluştu: ' + (data.error || ''));
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>UstaBot - Teknik Sorulara AI Destekli Çözüm</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Kategori:
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ marginLeft: 10 }}>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <br /><br />
        <label>
          Sorunuz:
          <textarea
            required
            rows={4}
            style={{ width: '100%', fontSize: 16 }}
            value={questionText}
            onChange={e => setQuestionText(e.target.value)}
            placeholder="Musluğum arızalı, ne yapmalıyım?"
          />
        </label>
        <br /><br />
        <button type="submit" disabled={loading} style={{ padding: '10px 20px', fontSize: 16 }}>
          {loading ? 'Yükleniyor...' : 'Sor'}
        </button>
      </form>
      <br />
      {answer && (
        <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 8, backgroundColor: '#f9f9f9' }}>
          <h3>Yapay Zeka Cevabı:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

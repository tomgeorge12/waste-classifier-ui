import { useState } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [confidence, setConfidence] = useState<any>();
  const [preview, setPreview] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image first.");
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/predict', formData);
      setPrediction(res.data.predictedLabel);
      setConfidence(res.data.confidence);
    } catch (err) {
      console.error(err);
      setPrediction('Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Waste Classifier</h1>

      <input type="file" onChange={handleChange} accept="image/*" />
      <button onClick={handleUpload} style={{ marginLeft: '10px' }}>Classify</button>

      {preview && (
        <div style={{ marginTop: '20px' }}>
          <img src={preview} alt="Selected" width="200px" style={{ borderRadius: '8px' }} />
        </div>
      )}

      {loading && <p>Loading...</p>}

      {prediction && (
        <>
        <div style={{ marginTop: '20px' }}>
          <h2>Predicted Class:</h2>
          <p><strong>{prediction}</strong></p>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h2>Confidence:</h2>
          <p><strong>{(confidence*100).toFixed(2)}</strong></p>
        </div>
        </>
      )}
    </div>
  );
}

export default App;

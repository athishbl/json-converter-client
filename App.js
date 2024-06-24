import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import CSS file for styling

function App() {
    const [jsonInput, setJsonInput] = useState('');
    const [downloadLinks, setDownloadLinks] = useState({ csv: '', xml: '', pdf: '' });
    const [jsonError, setJsonError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        setJsonInput(e.target.value);
        resetDownloadLinks(); // Reset download links when JSON input changes
    };

    const resetDownloadLinks = () => {
        setDownloadLinks({ csv: '', xml: '', pdf: '' });
    };

    const handleConvert = async (format) => {
        try {
            setJsonError('');
            setIsLoading(true);
            const jsonParsed = JSON.parse(jsonInput);
            const response = await axios.post(`http://localhost:5000/convert/${format}`, jsonParsed, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            setDownloadLinks((prevLinks) => ({ ...prevLinks, [format]: url }));
        } catch (err) {
            console.error('Error in frontend:', err.response?.data || err.message);
            setJsonError('Invalid JSON input or server error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>JSON Converter</h1>
            </header>
            <main className="app-main">
                <div className="input-container">
                    <textarea
                        rows="10"
                        cols="50"
                        value={jsonInput}
                        onChange={handleInputChange}
                        placeholder="Enter JSON here"
                        className="json-input"
                    ></textarea>
                    {jsonError && <p className="error-message">{jsonError}</p>}
                </div>
                <div className="button-container">
                    <button onClick={() => handleConvert('csv')} disabled={isLoading} className="convert-button">Convert to CSV</button>
                    <button onClick={() => handleConvert('xml')} disabled={isLoading} className="convert-button">Convert to XML</button>
                    <button onClick={() => handleConvert('pdf')} disabled={isLoading} className="convert-button">Convert to PDF</button>
                </div>
                <div className="download-links">
                    {downloadLinks.csv && <a href={downloadLinks.csv} download="output.csv" className="download-link">Download CSV</a>}
                    {downloadLinks.xml && <a href={downloadLinks.xml} download="output.xml" className="download-link">Download XML</a>}
                    {downloadLinks.pdf && <a href={downloadLinks.pdf} download="output.pdf" className="download-link">Download PDF</a>}
                </div>
                {isLoading && <p className="loading-message">Loading...</p>}
            </main>
        </div>
    );
}

export default App;

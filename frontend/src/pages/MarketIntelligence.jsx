import React, { useState, useEffect } from 'react';
import { fetchMarketData } from '../services/api';
import { Briefcase, BarChart2, Star } from 'lucide-react';

const MarketIntelligence = () => {
    const [marketData, setMarketData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchMarketData();
                setMarketData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="container" style={{ padding: '2rem' }}>
                <h1 className="text-gradient" style={{ marginBottom: '1rem' }}>Market Intelligence</h1>
                <div className="glass-card">Loading market data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container" style={{ padding: '2rem' }}>
                <h1 className="text-gradient" style={{ marginBottom: '1rem' }}>Market Intelligence</h1>
                <div className="glass-card text-danger">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <h1 className="text-gradient" style={{ marginBottom: '1rem' }}>Market Intelligence</h1>
            <div className="glass-card" style={{ marginBottom: '2rem' }}>
                <p>Explore real-time data on job market demands and required skills for trending AI and Tech roles.</p>
            </div>

            <div className="animate-fade-in-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {Object.entries(marketData).map(([role, data]) => (
                    <div key={role} className="glass-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                            <Briefcase size={24} />
                            <h3 style={{ margin: 0, color: 'var(--text)' }}>{role}</h3>
                        </div>

                        <div style={{ marginBottom: '1rem', background: 'var(--surface-inset)', border: '1px solid var(--border)', padding: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}><BarChart2 size={16} /> Demand:</span>
                            <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>High</span>
                        </div>

                        <div>
                            <h5 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent)' }}>
                                <Star size={16} /> Top Required Skills
                            </h5>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                {data.required_skills?.map((skill, idx) => (
                                    <span key={idx} className="badge">{skill}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketIntelligence;

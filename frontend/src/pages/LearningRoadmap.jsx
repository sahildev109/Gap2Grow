import React, { useState, useEffect } from 'react';
import { Map as MapIcon, ExternalLink, BookOpen } from 'lucide-react';

const LearningRoadmap = () => {
    const [roadmap, setRoadmap] = useState(null);

    useEffect(() => {
        // Retrieve the analysis result from localStorage
        const storedResult = localStorage.getItem('gap2grow_analysis_result');
        if (storedResult) {
            try {
                const parsed = JSON.parse(storedResult);
                if (parsed.roadmap) {
                    setRoadmap(parsed.roadmap);
                }
            } catch (e) {
                console.error("Failed to parse stored roadmap data", e);
            }
        }
    }, []);

    if (!roadmap) {
        return (
            <div className="container" style={{ padding: '2rem' }}>
                <h1 className="text-gradient" style={{ marginBottom: '1rem' }}>Learning Roadmap</h1>
                <div className="glass-card">
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)' }}>
                        <MapIcon size={20} /> Please generate a Skill Gap Forecast first to view your personalized roadmap.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <h1 className="text-gradient" style={{ marginBottom: '1rem' }}>Learning Roadmap</h1>

            <div className="glass-card" style={{ marginBottom: '2rem' }}>
                <p>Follow a personalized, step-by-step guide to bridge your skill gaps for the <strong>{roadmap.role}</strong> role.</p>
            </div>

            <div className="animate-fade-in-up">
                {roadmap.steps.map((step, index) => (
                    <div key={index} className="glass-card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                            <div style={{ background: 'var(--primary)', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                {step.step_number}
                            </div>
                            <h3 style={{ margin: 0, color: 'var(--text)' }}>{step.title}</h3>
                        </div>

                        <p className="text-muted" style={{ marginLeft: '3rem', marginBottom: '1rem' }}>
                            {step.description}
                        </p>

                        {step.resources && step.resources.length > 0 && (
                            <div style={{ marginLeft: '3rem', padding: '1rem', background: 'var(--surface-inset)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                                <h5 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <BookOpen size={16} /> Recommended Resources
                                </h5>
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    {step.resources.map((url, i) => (
                                        <li key={i} style={{ marginBottom: '0.5rem' }}>
                                            <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                                                {url.split('query=')[1] || url} <ExternalLink size={12} />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LearningRoadmap;

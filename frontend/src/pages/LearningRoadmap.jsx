import React, { useState, useEffect } from 'react';
import { Map as MapIcon, ExternalLink, BookOpen, Download, Loader } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import reportService from '../services/reportService';

const LearningRoadmap = () => {
    const { skillGap } = useDashboard();
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchRoadmap();
    }, []);

    const fetchRoadmap = async () => {
        try {
            setLoading(true);
            const data = await reportService.getLatestLearningRoadmap();
            setRoadmap(data);
            setError(null);
        } catch (err) {
            setRoadmap(null);
            setError(err.response?.data?.message || 'Failed to fetch roadmap');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateRoadmap = async () => {
        if (!skillGap?._id) {
            setError('Please generate a Skill Gap Forecast first');
            return;
        }

        try {
            setGenerating(true);
            setError(null);
            const data = await reportService.generateLearningRoadmap(skillGap._id);
            setRoadmap(data.roadmap);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to generate roadmap');
        } finally {
            setGenerating(false);
        }
    };

    const downloadRoadmap = () => {
        if (!roadmap) return;
        const element = document.createElement('a');
        const file = new Blob([generateRoadmapHTML()], { type: 'text/html' });
        element.href = URL.createObjectURL(file);
        element.download = `learning-roadmap-${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const generateRoadmapHTML = () => {
        if (!roadmap) return '';
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Learning Roadmap - ${roadmap.targetRole}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 40px; }
        h1 { color: #7C3AED; border-bottom: 3px solid #A855F7; padding-bottom: 10px; }
        h3 { color: #7C3AED; margin-top: 20px; }
        .step { border-left: 4px solid #7C3AED; padding: 15px; margin: 15px 0; background: #f9f9f9; }
        .step-number { display: inline-block; background: #7C3AED; color: white; width: 30px; height: 30px; border-radius: 50%; text-align: center; line-height: 30px; margin-right: 10px; font-weight: bold; }
        .resources { background: #f0e6ff; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .resource-link { color: #7C3AED; text-decoration: none; }
        .meta { color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <h1>Learning Roadmap: ${roadmap.targetRole}</h1>
    <p class="meta"><strong>Target Role:</strong> ${roadmap.targetRole}</p>
    <p class="meta"><strong>Total Duration:</strong> ${roadmap.totalDuration}</p>
    <p class="meta"><strong>Difficulty Level:</strong> ${roadmap.difficulty_level}</p>
    <p class="meta"><strong>Learning Style:</strong> ${roadmap.learningStyle}</p>
    <p class="meta"><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    <hr>
    ${roadmap.steps.map(step => `
        <div class="step">
            <h3><span class="step-number">${step.step_number}</span>${step.title}</h3>
            <p>${step.description}</p>
            <p><strong>Skills:</strong> ${step.skills.join(', ')}</p>
            <p><strong>Duration:</strong> ${step.duration_weeks} weeks</p>
            <p><strong>Difficulty:</strong> ${step.difficulty}</p>
            ${step.resources && step.resources.length > 0 ? `
                <div class="resources">
                    <strong>Resources:</strong>
                    <ul>
                        ${step.resources.map(r => `<li><a href="${r.url}" class="resource-link">${r.title}</a> (${r.type})</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            ${step.milestones && step.milestones.length > 0 ? `
                <p><strong>Milestones:</strong> ${step.milestones.join(', ')}</p>
            ` : ''}
        </div>
    `).join('')}
</body>
</html>`;
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
                <MapIcon size={40} style={{ marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
                <p>Loading your learning roadmap...</p>
            </div>
        );
    }

    if (!roadmap) {
        return (
            <div className="container" style={{ padding: '2rem' }}>
                <h1 className="text-gradient" style={{ marginBottom: '1rem' }}>Learning Roadmap</h1>
                <div className="glass-card" style={{ marginBottom: '2rem' }}>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ff9800' }}>
                        <MapIcon size={20} /> {error || 'No learning roadmap found yet. Generate one to get started!'}
                    </p>
                </div>
                <button 
                    onClick={handleGenerateRoadmap}
                    disabled={generating || !skillGap}
                    style={{
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: generating ? 'not-allowed' : 'pointer',
                        opacity: generating ? 0.6 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '15px',
                        fontWeight: '600'
                    }}
                >
                    {generating ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                    {generating ? 'Generating...' : 'Generate Learning Roadmap'}
                </button>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 className="text-gradient">Learning Roadmap</h1>
                <button 
                    onClick={downloadRoadmap}
                    style={{
                        padding: '10px 16px',
                        background: '#7C3AED',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '14px',
                        fontWeight: '600'
                    }}
                >
                    <Download size={16} /> Download
                </button>
            </div>

            <div className="glass-card" style={{ marginBottom: '2rem' }}>
                <p><strong>Target Role:</strong> {roadmap.targetRole}</p>
                <p><strong>Total Duration:</strong> {roadmap.totalDuration}</p>
                <p><strong>Difficulty:</strong> {roadmap.difficulty_level}</p>
                <p>Follow this personalized roadmap to bridge your skill gaps and reach your career goal.</p>
            </div>

            <div className="animate-fade-in-up">
                {roadmap.steps && roadmap.steps.map((step, index) => (
                    <div key={index} className="glass-card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                            <div style={{ background: 'var(--primary)', color: 'white', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                {step.step_number}
                            </div>
                            <div>
                                <h3 style={{ margin: 0, color: 'var(--text)' }}>{step.title}</h3>
                                <small style={{ color: '#999' }}>Duration: {step.duration_weeks} weeks • Difficulty: {step.difficulty}</small>
                            </div>
                        </div>

                        <p className="text-muted" style={{ marginLeft: '3rem', marginBottom: '1rem' }}>
                            {step.description}
                        </p>

                        {step.skills && step.skills.length > 0 && (
                            <p style={{ marginLeft: '3rem', color: '#666' }}>
                                <strong>Skills to Learn:</strong> {step.skills.join(', ')}
                            </p>
                        )}

                        {step.resources && step.resources.length > 0 && (
                            <div style={{ marginLeft: '3rem', padding: '1rem', background: 'var(--surface-inset)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginTop: '1rem' }}>
                                <h5 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', marginTop: 0 }}>
                                    <BookOpen size={16} /> Recommended Resources
                                </h5>
                                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                    {step.resources.map((resource, i) => (
                                        <li key={i} style={{ marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                                            <span style={{ background: '#7C3AED', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', marginRight: '8px' }}>
                                                {resource.type}
                                            </span>
                                            <a href={resource.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                {resource.title}
                                                <ExternalLink size={12} />
                                            </a>
                                            <small style={{ color: '#999', marginLeft: '8px' }}>({resource.duration})</small>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {step.milestones && step.milestones.length > 0 && (
                            <div style={{ marginLeft: '3rem', marginTop: '1rem', padding: '0.75rem', background: '#f0e6ff', borderRadius: 'var(--radius-md)' }}>
                                <strong>Milestones:</strong>
                                <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>{step.milestones.join(' → ')}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LearningRoadmap;

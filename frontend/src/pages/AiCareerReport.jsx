import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Briefcase } from 'lucide-react';

const AiCareerReport = () => {
    const [report, setReport] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        // Retrieve the analysis result from localStorage
        const storedResult = localStorage.getItem('gap2grow_analysis_result');
        if (storedResult) {
            try {
                const parsed = JSON.parse(storedResult);
                if (parsed.report && parsed.analysis) {
                    setReport(parsed.report);
                    setRole(parsed.analysis.job_role);
                }
            } catch (e) {
                console.error("Failed to parse stored roadmap data", e);
            }
        }
    }, []);

    if (!report) {
        return (
            <div className="container" style={{ padding: '2rem' }}>
                <h1 className="text-gradient" style={{ marginBottom: '1rem' }}>AI Career Report</h1>
                <div className="glass-card">
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)' }}>
                        <TrendingUp size={20} /> Please generate a Skill Gap Forecast first to view your career report.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <h1 className="text-gradient" style={{ marginBottom: '1rem' }}>AI Career Report</h1>

            <div className="glass-card animate-fade-in-up" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.15)', borderRadius: 'var(--radius-lg)' }}>
                        <TrendingUp size={32} color="var(--primary)" />
                    </div>
                    <div>
                        <h2 style={{ margin: 0 }}>Career Trajectory: {report.trajectory}</h2>
                        <p className="text-muted" style={{ margin: '0.5rem 0 0 0' }}>Target Role: <strong>{role}</strong></p>
                    </div>
                </div>

                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                    {report.description}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ background: 'rgba(5, 150, 105, 0.08)', border: '1px solid rgba(5, 150, 105, 0.20)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--success)' }}>
                            <Briefcase size={20} />
                            <h4 style={{ margin: 0 }}>Market Demand</h4>
                        </div>
                        <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>{report.market_demand}</p>
                    </div>

                    <div style={{ background: 'rgba(217, 119, 6, 0.08)', border: '1px solid rgba(217, 119, 6, 0.20)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--warning)' }}>
                            <DollarSign size={20} />
                            <h4 style={{ margin: 0 }}>Salary Expectation</h4>
                        </div>
                        <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>{report.salary_expectation}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiCareerReport;

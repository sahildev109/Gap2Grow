import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Briefcase, Download, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import reportService from '../services/reportService';

const AiCareerReport = () => {
    const { skillGap } = useDashboard();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchCareerReport();
    }, []);

    const fetchCareerReport = async () => {
        try {
            setLoading(true);
            const data = await reportService.getLatestCareerReport();
            setReport(data);
            setError(null);
        } catch (err) {
            setReport(null);
            setError(err.response?.data?.message || 'Failed to fetch report');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = async () => {
        if (!skillGap?._id) {
            setError('Please generate a Skill Gap Forecast first');
            return;
        }

        try {
            setGenerating(true);
            setError(null);
            const data = await reportService.generateCareerReport(skillGap._id);
            setReport(data.report);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to generate report');
        } finally {
            setGenerating(false);
        }
    };

    const downloadReport = () => {
        if (!report) return;
        const element = document.createElement('a');
        const file = new Blob([generateReportHTML()], { type: 'text/html' });
        element.href = URL.createObjectURL(file);
        element.download = `career-report-${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const generateReportHTML = () => {
        if (!report) return '';
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>AI Career Report - ${report.targetRole}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.8; color: #333; margin: 40px; background: #f5f5f5; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        h1 { color: #7C3AED; border-bottom: 3px solid #A855F7; padding-bottom: 15px; margin-bottom: 30px; }
        h2 { color: #7C3AED; margin-top: 30px; margin-bottom: 15px; border-left: 4px solid #A855F7; padding-left: 15px; }
        .header-info { background: #f0e6ff; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .header-info p { margin: 8px 0; }
        .metric-card { background: #f9f9f9; border-left: 4px solid #7C3AED; padding: 15px; margin: 12px 0; border-radius: 5px; }
        .metric-label { color: #666; font-weight: 500; font-size: 0.9em; }
        .metric-value { color: #7C3AED; font-size: 1.3em; font-weight: bold; margin-top: 5px; }
        ul { list-style: none; padding: 0; }
        li { padding: 8px 0; padding-left: 25px; position: relative; }
        li:before { content: "✓"; position: absolute; left: 0; color: #7C3AED; font-weight: bold; }
        .danger li:before { content: "⚠"; color: #ff6b6b; }
        .opportunity li:before { content: "★"; color: #ffa500; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 0.85em; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 AI Career Report</h1>
        <div class="header-info">
            <p><strong>Target Role:</strong> ${report.targetRole}</p>
            <p><strong>Career Trajectory:</strong> ${report.trajectory}</p>
            <p><strong>Report Generated:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <h2>📊 Career Path Overview</h2>
        <p>${report.careerPath}</p>

        <h2>📈 Expected Growth</h2>
        <p>${report.expectedGrowth}</p>

        <h2>💰 Salary Progression</h2>
        <div class="metric-card">
            <div class="metric-label">Current Level</div>
            <div class="metric-value">${report.salaryProgression.currentLevel.role}</div>
            <div class="metric-label">Estimated Salary Range</div>
            <div>${report.salaryProgression.currentLevel.salary}</div>
        </div>
        <div class="metric-card">
            <div class="metric-label">Target Level</div>
            <div class="metric-value">${report.salaryProgression.targetLevel.role}</div>
            <div class="metric-label">Estimated Salary Range</div>
            <div>${report.salaryProgression.targetLevel.salary}</div>
        </div>
        <div class="metric-card">
            <div class="metric-label">Timeline to Reach Target</div>
            <div class="metric-value">${report.salaryProgression.timeline}</div>
        </div>

        <h2>🎯 Key Milestones</h2>
        <ul>
            ${report.keyMilestones.map(m => `<li>${m}</li>`).join('')}
        </ul>

        <h2>💡 Recommendations</h2>
        <ul>
            ${report.recommendations.map(r => `<li>${r}</li>`).join('')}
        </ul>

        <h2>⚠️ Risk Factors</h2>
        <ul class="danger">
            ${report.riskFactors.map(r => `<li>${r}</li>`).join('')}
        </ul>

        <h2>⭐ Opportunities</h2>
        <ul class="opportunity">
            ${report.opportunities.map(o => `<li>${o}</li>`).join('')}
        </ul>

        <div class="footer">
            <p>This report was generated using AI analysis based on your current skills, target role, and market data. For personalized guidance, consider consulting with a career counselor.</p>
        </div>
    </div>
</body>
</html>`;
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
                <Loader size={40} style={{ marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
                <p>Loading your career report...</p>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="container" style={{ padding: '2rem' }}>
                <h1 className="text-gradient" style={{ marginBottom: '1rem' }}>AI Career Report</h1>
                <div className="glass-card" style={{ marginBottom: '2rem' }}>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ff9800' }}>
                        <TrendingUp size={20} /> {error || 'No career report found yet. Generate one to get started!'}
                    </p>
                </div>
                <button 
                    onClick={handleGenerateReport}
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
                    {generating ? 'Generating...' : 'Generate Career Report'}
                </button>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="text-gradient">AI Career Report</h1>
                <button 
                    onClick={downloadReport}
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

            <div className="glass-card animate-fade-in-up" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(124, 58, 237, 0.15)', borderRadius: 'var(--radius-lg)' }}>
                        <TrendingUp size={32} color="var(--primary)" />
                    </div>
                    <div>
                        <h2 style={{ margin: 0 }}>Career Trajectory: {report.trajectory}</h2>
                        <p className="text-muted" style={{ margin: '0.5rem 0 0 0' }}>Target Role: <strong>{report.targetRole}</strong></p>
                    </div>
                </div>

                <p style={{ fontSize: '1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                    {report.careerPath}
                </p>

                <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>📈 Expected Growth</h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                    {report.expectedGrowth}
                </p>

                <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>💰 Salary Progression</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ background: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.2)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#4caf50' }}>
                            <Briefcase size={20} />
                            <h4 style={{ margin: 0 }}>Current Level</h4>
                        </div>
                        <p style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: 'var(--text)' }}>{report.salaryProgression.currentLevel.role}</p>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>{report.salaryProgression.currentLevel.salary}</p>
                    </div>

                    <div style={{ background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.2)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
                            <TrendingUp size={20} />
                            <h4 style={{ margin: 0 }}>Target Level</h4>
                        </div>
                        <p style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: 'var(--text)' }}>{report.salaryProgression.targetLevel.role}</p>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>{report.salaryProgression.targetLevel.salary}</p>
                    </div>
                </div>

                <div style={{ background: 'rgba(217, 119, 6, 0.1)', border: '1px solid rgba(217, 119, 6, 0.2)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#d97706' }}>
                        <DollarSign size={20} />
                        <h4 style={{ margin: 0 }}>Timeline to Reach Target</h4>
                    </div>
                    <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>{report.salaryProgression.timeline}</p>
                </div>

                <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>🎯 Key Milestones</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginBottom: '2rem' }}>
                    {report.keyMilestones.map((milestone, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem', background: 'var(--surface-inset)', borderRadius: 'var(--radius-md)' }}>
                            <CheckCircle size={18} style={{ color: '#4caf50', marginTop: '2px', flexShrink: 0 }} />
                            <span>{milestone}</span>
                        </div>
                    ))}
                </div>

                <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>💡 Recommendations</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginBottom: '2rem' }}>
                    {report.recommendations.map((rec, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: 'var(--radius-md)' }}>
                            <span style={{ background: 'var(--primary)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 }}>
                                {i + 1}
                            </span>
                            <span>{rec}</span>
                        </div>
                    ))}
                </div>

                <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>⚠️ Risk Factors</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginBottom: '2rem' }}>
                    {report.riskFactors.map((risk, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255, 107, 107, 0.1)', borderRadius: 'var(--radius-md)' }}>
                            <AlertCircle size={18} style={{ color: '#ff6b6b', marginTop: '2px', flexShrink: 0 }} />
                            <span>{risk}</span>
                        </div>
                    ))}
                </div>

                <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>⭐ Opportunities</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                    {report.opportunities.map((opp, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255, 165, 0, 0.1)', borderRadius: 'var(--radius-md)' }}>
                            <span style={{ color: '#ffa500', fontSize: '18px' }}>★</span>
                            <span>{opp}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AiCareerReport;

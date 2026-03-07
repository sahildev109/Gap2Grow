import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart2, Target, FileText, TrendingUp,
    Clock, ArrowRight, AlertTriangle, CheckCircle,
    Loader2, Zap, BookOpen, Upload
} from 'lucide-react';
import './Dashboard.css';

const API = 'http://localhost:8000';

/* ─── tiny helpers ─────────────────────────────────────────── */
function scoreColor(s) {
    if (s >= 80) return 'var(--success)';
    if (s >= 50) return 'var(--warning)';
    return 'var(--danger)';
}
function scoreBg(s) {
    if (s >= 80) return 'rgba(5,150,105,0.10)';
    if (s >= 50) return 'rgba(217,119,6,0.10)';
    return 'rgba(220,38,38,0.10)';
}
function scoreLabel(s) {
    if (s >= 80) return 'Excellent';
    if (s >= 50) return 'Promising';
    return 'Building';
}
function fmtDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });
}

/* ─── Stat card ─────────────────────────────────────────────── */
function StatCard({ icon, label, value, sub, accent }) {
    return (
        <div className="ov-stat-card glass-card">
            <div className="ov-stat-icon" style={{ background: accent + '18', color: accent }}>
                {icon}
            </div>
            <div>
                <div className="ov-stat-value" style={{ color: accent }}>{value}</div>
                <div className="ov-stat-label">{label}</div>
                {sub && <div className="ov-stat-sub">{sub}</div>}
            </div>
        </div>
    );
}

/* ─── Skeleton loader ────────────────────────────────────────── */
function Skeleton({ h = 20, w = '100%', r = 8, mb = 0 }) {
    return (
        <div
            className="ov-skeleton"
            style={{ height: h, width: w, borderRadius: r, marginBottom: mb }}
        />
    );
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [overview, setOverview] = useState(null);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const [ovRes, recRes] = await Promise.all([
                    fetch(`${API}/api/overview`),
                    fetch(`${API}/api/recent-analyses?limit=8`),
                ]);
                if (!ovRes.ok || !recRes.ok) throw new Error('API error');
                const [ovData, recData] = await Promise.all([ovRes.json(), recRes.json()]);
                if (!cancelled) {
                    setOverview(ovData);
                    setRecent(recData);
                }
            } catch (e) {
                if (!cancelled) setError('Could not reach the backend. Is the FastAPI server running?');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    /* ── Error banner ─────────────────────────────────────────── */
    if (error) return (
        <div className="ov-page">
            <div className="ov-error glass-card">
                <AlertTriangle size={24} /> {error}
            </div>
        </div>
    );

    /* ── Loading skeleton ─────────────────────────────────────── */
    if (loading) return (
        <div className="ov-page">
            <Skeleton h={36} w={260} mb={8} />
            <Skeleton h={18} w={380} mb={40} />
            <div className="ov-stats-grid">
                {[1, 2, 3, 4].map(i => <div key={i} className="glass-card"><Skeleton h={80} /></div>)}
            </div>
            <div className="ov-two-col" style={{ marginTop: '2rem' }}>
                <div className="glass-card"><Skeleton h={220} /></div>
                <div className="glass-card"><Skeleton h={220} /></div>
            </div>
        </div>
    );

    const {
        total_analyses, total_resumes, average_gap_score,
        role_distribution, top_missing_skills, readiness_summary
    } = overview;

    const topMissingMax = top_missing_skills[0]?.count || 1;
    const totalReady = readiness_summary.excellent + readiness_summary.promising + readiness_summary.building || 1;

    return (
        <div className="ov-page animate-fade-in-up">

            {/* ── Page header ──────────────────────────────────── */}
            <div className="ov-header">
                <div>
                    <h1>Overview <span className="text-gradient">Dashboard</span></h1>
                    <p className="ov-subtitle">
                        Real-time analytics across all resume analyses stored in your database.
                    </p>
                </div>
                <button
                    className="btn btn-primary ov-cta"
                    onClick={() => navigate('/resume-analyzer')}
                >
                    <Upload size={18} /> New Analysis
                </button>
            </div>

            {/* ── 4 stat cards ─────────────────────────────────── */}
            <div className="ov-stats-grid">
                <StatCard
                    icon={<BarChart2 size={22} />}
                    label="Total Analyses"
                    value={total_analyses}
                    sub={`${total_resumes} résumés parsed`}
                    accent="#6366f1"
                />
                <StatCard
                    icon={<Target size={22} />}
                    label="Avg. Gap Score"
                    value={`${average_gap_score}%`}
                    sub={scoreLabel(average_gap_score) + ' readiness'}
                    accent={scoreColor(average_gap_score)}
                />
                <StatCard
                    icon={<CheckCircle size={22} />}
                    label="Excellent Matches"
                    value={readiness_summary.excellent}
                    sub="Score ≥ 80%"
                    accent="#059669"
                />
                <StatCard
                    icon={<TrendingUp size={22} />}
                    label="Roles Tracked"
                    value={Object.keys(role_distribution).length}
                    sub="Distinct target roles"
                    accent="#8b5cf6"
                />
            </div>

            {/* ── Readiness Distribution bar ────────────────────── */}
            <div className="glass-card ov-readiness" style={{ marginBottom: '2rem' }}>
                <h3 className="ov-section-title">
                    <Zap size={18} color="#6366f1" /> Readiness Distribution
                </h3>
                <div className="ov-readiness-bars">
                    {[
                        { key: 'excellent', label: 'Excellent (≥80%)', color: '#059669' },
                        { key: 'promising', label: 'Promising (50–79%)', color: '#d97706' },
                        { key: 'building', label: 'Building (<50%)', color: '#dc2626' },
                    ].map(({ key, label, color }) => {
                        const val = readiness_summary[key];
                        const pct = Math.round((val / totalReady) * 100);
                        return (
                            <div key={key} className="ov-bar-row">
                                <span className="ov-bar-label">{label}</span>
                                <div className="ov-bar-track">
                                    <div
                                        className="ov-bar-fill"
                                        style={{ width: `${pct}%`, background: color }}
                                    />
                                </div>
                                <span className="ov-bar-count" style={{ color }}>
                                    {val} <span className="ov-bar-pct">({pct}%)</span>
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Two-col: Top Missing Skills + Role Distribution ── */}
            <div className="ov-two-col" style={{ marginBottom: '2rem' }}>

                {/* Top Missing Skills */}
                <div className="glass-card">
                    <h3 className="ov-section-title">
                        <BookOpen size={18} color="#6366f1" /> Top Skills to Learn
                    </h3>
                    {top_missing_skills.length === 0 ? (
                        <p className="text-muted ov-empty">No missing skill data yet.</p>
                    ) : (
                        <div className="ov-skill-list">
                            {top_missing_skills.map(({ skill, count }, idx) => (
                                <div key={skill} className="ov-skill-row">
                                    <span className="ov-skill-rank">#{idx + 1}</span>
                                    <span className="ov-skill-name">{skill}</span>
                                    <div className="ov-skill-track">
                                        <div
                                            className="ov-skill-bar"
                                            style={{
                                                width: `${Math.round((count / topMissingMax) * 100)}%`,
                                                background: `linear-gradient(90deg, #6366f1, #8b5cf6)`
                                            }}
                                        />
                                    </div>
                                    <span className="ov-skill-count">{count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Role Distribution */}
                <div className="glass-card">
                    <h3 className="ov-section-title">
                        <FileText size={18} color="#6366f1" /> Role Distribution
                    </h3>
                    {Object.keys(role_distribution).length === 0 ? (
                        <p className="text-muted ov-empty">No role data yet.</p>
                    ) : (
                        <div className="ov-role-list">
                            {Object.entries(role_distribution)
                                .sort((a, b) => b[1] - a[1])
                                .map(([role, count]) => {
                                    const pct = Math.round((count / total_analyses) * 100);
                                    return (
                                        <div key={role} className="ov-role-row">
                                            <div className="ov-role-top">
                                                <span className="ov-role-name">{role}</span>
                                                <span className="ov-role-count badge primary">
                                                    {count} {count === 1 ? 'analysis' : 'analyses'}
                                                </span>
                                            </div>
                                            <div className="ov-skill-track" style={{ marginTop: '0.4rem' }}>
                                                <div
                                                    className="ov-skill-bar"
                                                    style={{
                                                        width: `${pct}%`,
                                                        background: `linear-gradient(90deg, #6366f1, #ec4899)`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Recent Analyses ───────────────────────────────── */}
            <div className="glass-card" style={{ marginBottom: '2rem' }}>
                <div className="ov-section-header">
                    <h3 className="ov-section-title">
                        <Clock size={18} color="#6366f1" /> Recent Analyses
                    </h3>
                    <button
                        className="btn btn-secondary ov-see-all"
                        onClick={() => navigate('/skill-gap')}
                    >
                        New Forecast <ArrowRight size={15} />
                    </button>
                </div>

                {recent.length === 0 ? (
                    <div className="ov-empty-state">
                        <Loader2 size={32} className="text-muted" />
                        <p className="text-muted">
                            No analyses yet. <span
                                className="ov-link"
                                onClick={() => navigate('/dashboard-upload')}
                            >Upload your resume</span> to get started.
                        </p>
                    </div>
                ) : (
                    <div className="ov-table-wrap">
                        <table className="ov-table">
                            <thead>
                                <tr>
                                    <th>Target Role</th>
                                    <th>Gap Score</th>
                                    <th>Readiness</th>
                                    <th>Missing Skills</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent.map(item => (
                                    <tr key={item.id}>
                                        <td className="ov-td-role">{item.target_role}</td>
                                        <td>
                                            <span
                                                className="ov-score-chip"
                                                style={{
                                                    color: scoreColor(item.gap_score),
                                                    background: scoreBg(item.gap_score)
                                                }}
                                            >
                                                {item.gap_score}%
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ color: scoreColor(item.gap_score), fontWeight: 600, fontSize: '0.82rem' }}>
                                                {scoreLabel(item.gap_score)}
                                            </span>
                                        </td>
                                        <td className="text-muted">{item.missing_count} skills</td>
                                        <td className="text-muted ov-td-date">{fmtDate(item.created_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Quick Actions ───────────────────────────────────── */}
            <div className="ov-two-col">
                <div className="ov-action-card glass-card" onClick={() => navigate('/resume-analyzer')}>
                    <div className="ov-action-icon" style={{ background: 'rgba(99,102,241,0.12)' }}>
                        <Upload size={24} color="#6366f1" />
                    </div>
                    <div>
                        <h4>Analyze a Resume</h4>
                        <p className="text-muted">Upload a PDF to extract skills</p>
                    </div>
                    <ArrowRight size={20} className="ov-action-arrow" />
                </div>
                <div className="ov-action-card glass-card" onClick={() => navigate('/market-intelligence')}>
                    <div className="ov-action-icon" style={{ background: 'rgba(139,92,246,0.12)' }}>
                        <BarChart2 size={24} color="#8b5cf6" />
                    </div>
                    <div>
                        <h4>Market Intelligence</h4>
                        <p className="text-muted">See top skills by role</p>
                    </div>
                    <ArrowRight size={20} className="ov-action-arrow" />
                </div>
            </div>

        </div>
    );
}

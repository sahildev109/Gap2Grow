import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import SkillGapForecast from './pages/SkillGapForecast';
import MarketIntelligence from './pages/MarketIntelligence';
import LearningRoadmap from './pages/LearningRoadmap';
import AiCareerReport from './pages/AiCareerReport';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes without Sidebar */}
        <Route path="/" element={<Home />} />

        {/* Protected/App Routes with Sidebar */}
        <Route path="/*" element={
          <MainLayout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
              <Route path="/skill-gap" element={<SkillGapForecast />} />
              <Route path="/market-intelligence" element={<MarketIntelligence />} />
              <Route path="/roadmap" element={<LearningRoadmap />} />
              <Route path="/career-report" element={<AiCareerReport />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/results" element={<Results />} />
            </Routes>
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;

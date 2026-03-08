const JobMarket = require('../models/JobMarket');

// Get job market data for a specific role
exports.getJobMarketData = async (req, res) => {
  try {
    const { role, industry } = req.query;

    if (!role) {
      return res.status(400).json({ error: 'Role query parameter is required' });
    }

    const data = await JobMarket.findOne({
      role: { $regex: role, $options: 'i' },
      ...(industry && { industry: { $regex: industry, $options: 'i' } })
    });

    if (!data) {
      return res.status(404).json({ error: 'Job market data not found for this role' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Get job market data error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get trending skills
exports.getTrendingSkills = async (req, res) => {
  try {
    const { role, industry } = req.query;

    if (!role) {
      return res.status(400).json({ error: 'Role query parameter is required' });
    }

    const data = await JobMarket.findOne({
      role: { $regex: role, $options: 'i' },
      ...(industry && { industry: { $regex: industry, $options: 'i' } })
    });

    if (!data) {
      return res.status(404).json({ error: 'Job market data not found' });
    }

    res.status(200).json({
      role: data.role,
      industry: data.industry,
      trendingSkills: data.trendingSkills,
      requiredSkills: data.requiredSkills
    });
  } catch (err) {
    console.error('Get trending skills error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get job market overview
exports.getJobMarketOverview = async (req, res) => {
  try {
    const { role, industry } = req.query;

    if (!role) {
      return res.status(400).json({ error: 'Role query parameter is required' });
    }

    const data = await JobMarket.findOne({
      role: { $regex: role, $options: 'i' },
      ...(industry && { industry: { $regex: industry, $options: 'i' } })
    });

    if (!data) {
      return res.status(404).json({ error: 'Job market data not found' });
    }

    res.status(200).json({
      role: data.role,
      industry: data.industry,
      jobOpenings: data.jobOpenings,
      growthRate: data.growthRate,
      salaryRange: data.salaryRange,
      topCompanies: data.topCompanies,
      topCountriesByDemand: data.topCountriesByDemand,
      experienceRequirement: data.experienceRequirement
    });
  } catch (err) {
    console.error('Get job market overview error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Search job market data
exports.searchJobMarket = async (req, res) => {
  try {
    const { q, industry } = req.query;

    let query = {};

    if (q) {
      query.role = { $regex: q, $options: 'i' };
    }

    if (industry) {
      query.industry = { $regex: industry, $options: 'i' };
    }

    const results = await JobMarket.find(query).limit(20);

    res.status(200).json({
      count: results.length,
      results
    });
  } catch (err) {
    console.error('Search job market error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get salary insights
exports.getSalaryInsights = async (req, res) => {
  try {
    const { role, industry } = req.query;

    if (!role) {
      return res.status(400).json({ error: 'Role query parameter is required' });
    }

    const data = await JobMarket.findOne({
      role: { $regex: role, $options: 'i' },
      ...(industry && { industry: { $regex: industry, $options: 'i' } })
    });

    if (!data) {
      return res.status(404).json({ error: 'Job market data not found' });
    }

    res.status(200).json({
      role: data.role,
      salaryRange: data.salaryRange,
      skillSalaryImpact: data.requiredSkills
        .sort((a, b) => b.salaryImpact - a.salaryImpact)
        .slice(0, 10)
    });
  } catch (err) {
    console.error('Get salary insights error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const API_BASE_URL = import.meta.env.VITE_PYTHON_BACKEND_URL;

export const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload-resume`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Failed to upload resume: ${errorDetails}`);
    }

    return response.json();
};

export const fetchJobRoles = async () => {
    const response = await fetch(`${API_BASE_URL}/job-roles`);
    if (!response.ok) {
        throw new Error('Failed to fetch job roles');
    }
    return response.json();
}

export const fetchMarketData = async () => {
    const response = await fetch(`${API_BASE_URL}/market-data`);
    if (!response.ok) {
        throw new Error('Failed to fetch market data');
    }
    return response.json();
}

export const analyzeSkills = async (targetRole, skills) => {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            target_role: targetRole,
            skills: skills,
        }),
    });

    if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Failed to analyze skills: ${errorDetails}`);
    }

    return response.json();
};

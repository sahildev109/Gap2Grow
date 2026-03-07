import json
import os
from typing import Dict, List

# Load mock data when the module is imported
mock_data_path = os.path.join(os.path.dirname(__file__), "..", "data", "mock_jobs.json")

def load_mock_jobs() -> Dict:
    """Loads mock job market data from a JSON file."""
    if not os.path.exists(mock_data_path):
        return {}
    with open(mock_data_path, "r") as f:
        return json.load(f)

def get_job_roles() -> List[str]:
    """Returns a list of available job roles in the mock database."""
    data = load_mock_jobs()
    return list(data.keys())

def get_job_skills(role: str) -> List[str]:
    """Given a job role, returns the requested required skills."""
    data = load_mock_jobs()
    job = data.get(role)
    if not job:
        return []
    return [skill.lower() for skill in job.get("required_skills", [])]

from pydantic import BaseModel
from typing import List, Optional, Dict

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    current_role: Optional[str] = None

class ResumeData(BaseModel):
    text_content: str
    extracted_skills: List[str]
    education: Optional[List[str]] = []
    experience: Optional[List[str]] = []

class SkillGapResult(BaseModel):
    user_skills: List[str]
    job_role: str
    required_skills: List[str]
    missing_skills: List[str]
    gap_score: float

class RoadmapStep(BaseModel):
    step_number: int
    title: str
    description: str
    resources: List[str]

class LearningRoadmap(BaseModel):
    role: str
    steps: List[RoadmapStep]

class AnalyzeRequest(BaseModel):
    target_role: str
    skills: List[str]

class CareerReport(BaseModel):
    trajectory: str
    market_demand: str
    salary_expectation: str
    description: str

class AnalysisResponse(BaseModel):
    analysis: SkillGapResult
    roadmap: LearningRoadmap
    report: CareerReport


# ── Rich parsed resume schemas ───────────────────────────────

class ContactInfoSchema(BaseModel):
    email:    Optional[str] = None
    phone:    Optional[str] = None
    linkedin: Optional[str] = None
    github:   Optional[str] = None

class EducationEntrySchema(BaseModel):
    raw:    str
    degree: Optional[str] = None
    years:  Optional[str] = None

class ExperienceEntrySchema(BaseModel):
    raw:   str
    title: Optional[str] = None
    years: Optional[str] = None

class ParsedResumeResponse(BaseModel):
    resume_id:          str
    filename:           str
    contact:            ContactInfoSchema
    categorized_skills: Dict[str, List[str]]
    all_skills:         List[str]
    education:          List[EducationEntrySchema]
    experience:         List[ExperienceEntrySchema]
    total_exp_years:    Optional[float] = None
    sections_found:     List[str]
    text_preview:       str          # first 600 chars of raw text
    skill_count:        int

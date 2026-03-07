from typing import List, Optional, Any
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId

# Helper class for PyObjectId to make MongoDB ObjectId work with Pydantic
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, handler=None): # Added handler for Pydantic v2 compatibility
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")
        return field_schema

class MongoBaseModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class User(MongoBaseModel):
    email: str
    target_role: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ResumeDoc(MongoBaseModel):
    user_id: Optional[str] = None
    filename: str
    text_content: str
    extracted_skills: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SkillAnalysisDoc(MongoBaseModel):
    user_id: Optional[str] = None
    resume_id: Optional[str] = None
    target_role: str
    user_skills: List[str]
    missing_skills: List[str]
    gap_score: float
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CareerReportDoc(MongoBaseModel):
    user_id: Optional[str] = None
    resume_id: Optional[str] = None
    analysis_id: Optional[str] = None
    career_trajectory: str
    salary_expectation: str
    market_demand: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

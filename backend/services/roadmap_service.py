from typing import List
from data.schemas import RoadmapStep, LearningRoadmap, SkillGapResult

def generate_roadmap(gap_result: SkillGapResult) -> LearningRoadmap:
    """
    Generates a generic, stepped roadmap based on missing skills.
    In a real app, this would use an LLM for personalization.
    """
    missing_skills = gap_result.missing_skills
    steps = []
    
    for idx, skill in enumerate(missing_skills, start=1):
        steps.append(
            RoadmapStep(
                step_number=idx,
                title=f"Learn {skill.title()}",
                description=f"Begin understanding the core concepts and practical applications of {skill}.",
                resources=[
                    f"https://www.coursera.org/search?query={skill.replace(' ', '%20')}",
                    f"https://www.udemy.com/courses/search/?q={skill.replace(' ', '%20')}"
                ]
            )
        )
        
    if not steps:
        steps.append(
            RoadmapStep(
                step_number=1,
                title="Enhance Existing Skills",
                description="You possess all the primary skills for this role. Consider advanced topics or soft skills.",
                resources=[]
            )
        )
        
    return LearningRoadmap(
        role=gap_result.job_role,
        steps=steps
    )

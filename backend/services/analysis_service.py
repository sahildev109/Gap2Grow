"""
analysis_service.py
--------------------
Proper skill-gap analysis engine:
  - Weighted gap score (priority skills count 3×, others 1×)
  - Per-category skill breakdown
  - Missing skills sorted by market priority
  - Skill-by-skill match details for the radar/bar chart
  - Forecast metrics: salary range, market demand, growth %
"""

from typing import List, Dict, Any
from data.schemas import SkillGapResult
from services.job_market_service import get_job_skills, load_mock_jobs


def _normalise(skill: str) -> str:
    return skill.strip().lower()


def compare_skills(user_skills: List[str], target_role: str) -> SkillGapResult:
    """
    Basic comparison used by the existing /api/analyze endpoint (kept for compatibility).
    Returns SkillGapResult with weighted gap_score.
    """
    full = _full_analysis(user_skills, target_role)
    return SkillGapResult(
        user_skills      = full["user_skills"],
        job_role         = full["target_role"],
        required_skills  = full["required_skills"],
        missing_skills   = full["missing_skills"],
        gap_score        = full["gap_score"],
    )


def _full_analysis(user_skills: List[str], target_role: str) -> Dict[str, Any]:
    """
    Full weighted analysis that powers the new /api/skill-gap endpoint.
    Priority skills get 3× weight in the gap-score calculation.
    """
    all_jobs = load_mock_jobs()
    job      = all_jobs.get(target_role, {})

    required_raw  = job.get("required_skills", [])
    priority_raw  = set(_normalise(s) for s in job.get("priority_skills", []))

    required_norm = [_normalise(s) for s in required_raw]
    user_norm     = set(_normalise(s) for s in user_skills)

    # ── Weighted scoring ──────────────────────────────────────
    total_weight   = 0
    matched_weight = 0
    skill_details  = []

    for raw, norm in zip(required_raw, required_norm):
        is_priority = norm in priority_raw
        weight      = 3 if is_priority else 1
        matched     = norm in user_norm
        total_weight   += weight
        matched_weight += weight if matched else 0
        skill_details.append({
            "skill":       raw,
            "matched":     matched,
            "priority":    is_priority,
            "weight":      weight,
        })

    gap_score = round((matched_weight / total_weight) * 100, 1) if total_weight else 100.0

    # ── Divide into matched / missing (sorted: priority first) ─
    matched_skills = [d["skill"] for d in skill_details if d["matched"]]
    missing_skills = sorted(
        [d["skill"] for d in skill_details if not d["matched"]],
        key=lambda s: 0 if _normalise(s) in priority_raw else 1
    )

    # ── Extra skills the user has beyond what's required ───────
    extra_skills = sorted(
        [s for s in user_skills if _normalise(s) not in set(required_norm)],
        key=lambda s: s.lower()
    )

    # ── Skill-match breakdown for chart (pct of required met) ──
    match_rows = []
    for d in skill_details:
        match_rows.append({
            "skill":    d["skill"],
            "matched":  d["matched"],
            "priority": d["priority"],
        })

    # ── Readiness category ──────────────────────────────────────
    if gap_score >= 80:
        readiness = "Excellent"
    elif gap_score >= 60:
        readiness = "Promising"
    elif gap_score >= 40:
        readiness = "Building"
    else:
        readiness = "Needs Work"

    return {
        "target_role":      target_role,
        "user_skills":      list(user_norm),
        "required_skills":  required_raw,
        "matched_skills":   matched_skills,
        "missing_skills":   missing_skills,
        "extra_skills":     extra_skills,
        "gap_score":        gap_score,
        "readiness":        readiness,
        "match_details":    match_rows,
        "salary_range":     job.get("salary_range",  "N/A"),
        "demand":           job.get("demand",         "N/A"),
        "growth_pct":       job.get("growth_pct",     0),
        "role_description": job.get("description",    ""),
        "total_required":   len(required_norm),
        "total_matched":    len(matched_skills),
    }


def get_full_skill_gap(user_skills: List[str], target_role: str) -> Dict[str, Any]:
    """Public entry-point used by the /api/skill-gap endpoint."""
    return _full_analysis(user_skills, target_role)

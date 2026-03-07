from typing import Dict, Any, List
from collections import Counter

async def get_overview_stats(analyses_collection, resumes_collection) -> Dict[str, Any]:
    """
    Aggregates statistics across all stored analyses for the Overview dashboard.
    Returns total analysis count, average gap score, role distribution,
    and top missing skills ranked by frequency.
    """
    total_analyses = await analyses_collection.count_documents({})
    total_resumes  = await resumes_collection.count_documents({})

    if total_analyses == 0:
        return {
            "total_analyses": 0,
            "total_resumes": total_resumes,
            "average_gap_score": 0.0,
            "role_distribution": {},
            "top_missing_skills": [],
            "readiness_summary": {
                "excellent": 0,
                "promising": 0,
                "building": 0,
            }
        }

    # Pull only the fields we need for aggregation
    cursor = analyses_collection.find(
        {},
        {"target_role": 1, "gap_score": 1, "missing_skills": 1, "_id": 0}
    )
    docs = await cursor.to_list(length=None)

    gap_scores     = [d["gap_score"]     for d in docs]
    roles          = [d["target_role"]   for d in docs]
    all_missing    = [skill for d in docs for skill in d.get("missing_skills", [])]

    avg_score      = round(sum(gap_scores) / len(gap_scores), 1) if gap_scores else 0.0
    role_dist      = dict(Counter(roles))
    top_missing    = [{"skill": skill, "count": cnt}
                      for skill, cnt in Counter(all_missing).most_common(6)]

    # Readiness bracket breakdown
    readiness = {"excellent": 0, "promising": 0, "building": 0}
    for score in gap_scores:
        if score >= 80:
            readiness["excellent"] += 1
        elif score >= 50:
            readiness["promising"] += 1
        else:
            readiness["building"] += 1

    return {
        "total_analyses":    total_analyses,
        "total_resumes":     total_resumes,
        "average_gap_score": avg_score,
        "role_distribution": role_dist,
        "top_missing_skills": top_missing,
        "readiness_summary": readiness,
    }


async def get_recent_analyses(analyses_collection, limit: int = 8) -> List[Dict[str, Any]]:
    """
    Returns the most recent `limit` analyses, sorted newest-first.
    Each item includes target_role, gap_score, missing_skills count, and created_at.
    """
    cursor = analyses_collection.find(
        {},
        {"target_role": 1, "gap_score": 1, "missing_skills": 1, "created_at": 1, "_id": 1}
    ).sort("created_at", -1).limit(limit)

    docs = await cursor.to_list(length=limit)
    result = []
    for d in docs:
        result.append({
            "id":             str(d["_id"]),
            "target_role":    d.get("target_role", "Unknown"),
            "gap_score":      round(d.get("gap_score", 0), 1),
            "missing_count":  len(d.get("missing_skills", [])),
            "created_at":     d.get("created_at").isoformat() if d.get("created_at") else None,
        })
    return result

from typing import Dict, Any

def generate_career_report(target_role: str, gap_score: float) -> Dict[str, Any]:
    """
    Generates a simple AI career forecast based on the gap score and the target role.
    """
    if gap_score >= 80:
        trajectory = "Excellent"
        market_demand = "High"
        salary = "Top tier for this role"
        description = f"You are highly qualified for a {target_role} position. You should start applying heavily."
    elif gap_score >= 50:
        trajectory = "Promising"
        market_demand = "Medium-High"
        salary = "Average to slightly above average"
        description = f"You have a solid foundation for {target_role}. Focusing on the missing skills will make you a very strong candidate."
    else:
        trajectory = "Building Phase"
        market_demand = "Varies"
        salary = "Entry level"
        description = f"You are at the beginning of your journey towards {target_role}. Following the learning roadmap is highly recommended."

    return {
        "trajectory": trajectory,
        "market_demand": market_demand,
        "salary_expectation": salary,
        "description": description
    }

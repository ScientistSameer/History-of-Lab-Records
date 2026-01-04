from sqlalchemy.orm import Session
from .app import database, models

def seed_ideal_lab():
    db: Session = database.SessionLocal()
    try:
        lab_exists = db.query(models.IdealLab).first()
        if not lab_exists:
            lab = models.IdealLab(
                name="IDEAL Labs",
                description="Main sender lab",
                domain="AI Research",
                sub_domains="ML, NLP",
                lab_type="Research",
                email="ideal@labs.com",
                website="https://ideal-labs.com",
                country="Pakistan",
                city="Lahore",
                institute="University of Engineering and Technology",
                total_researchers=10,
                active_projects=3,
                max_project_capacity=5,
                workload_score=70,
                availability_status="Open",
                senior_researchers=3,
                phd_students=4,
                interns=3,
                equipment_level="High",
                computing_resources="GPU Cluster",
                funding_level="Medium",
                collaboration_interests="AI, Robotics",
                preferred_domains="AI, ML",
                collaboration_history_count=5,
                openness_score=80,
                verified=True
            )
            db.add(lab)
            db.commit()
            print("IDEAL Lab seeded successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_ideal_lab()

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, schemas
from .database import Base, engine, get_db, SessionLocal

# Create tables
Base.metadata.create_all(bind=engine)


def init_db():
    """Initialize the database with sample employees and skills if empty."""
    db = SessionLocal()
    try:
        # if there is at least one employee, do not seed again
        if db.query(models.Employee).first():
            return

        seed_employees = [
            {
                "full_name": "Alejandro Arango Mejía",
                "position": "Software Engineer",
                "avatar_url": "https://robohash.org/alejandro-arango-mejia.png",
                "skills": [
                    {"name": "Python", "level": 90},
                    {"name": "SQL", "level": 75},
                    {"name": "FastApi", "level": 85},
                    {"name": "Docker", "level": 78},
                    {"name": "Software Engineer", "level": 71},
                ],
            },
            {
                "full_name": "Felipe Arango Mejía",
                "position": "Data Engineer",
                "avatar_url": "https://robohash.org/felipe-arango-mejia.png",
                "skills": [
                    {"name": "Python", "level": 80},
                    {"name": "SQL", "level": 88},
                    {"name": "Spark", "level": 90},
                    {"name": "Docker", "level": 70},
                    {"name": "Machine Learning", "level": 75},
                ],
            },
        ]

        for emp in seed_employees:
            employee = models.Employee(
                full_name=emp["full_name"],
                position=emp["position"],
                avatar_url=emp["avatar_url"],
            )
            db.add(employee)
            db.flush()  # get employee.id without committing yet

            skills = [
                models.Skill(
                    name=s["name"],
                    level=s["level"],
                    employee_id=employee.id,
                )
                for s in emp["skills"]
            ]
            db.add_all(skills)

        db.commit()
    finally:
        db.close()


# Initialize database with sample data
init_db()

app = FastAPI(title="Employees Profile API")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "Ok"}


# endpoint to get an employee by id
@app.get("/employees/{employee_id}", response_model=schemas.Employee)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

""""Pydantic schemas for the employee profile domain."""

from pydantic import BaseModel


class SkillBase(BaseModel):
    name: str
    level: int


class Skill(SkillBase):
    id: int

    class Config:
        from_attributes = True  # orm_mode = True


class EmployeeBase(BaseModel):
    full_name: str
    position: str
    avatar_url: str | None = None


class Employee(EmployeeBase):
    id: int
    skills: list[Skill] = []

    class Config:
        from_attributes = True

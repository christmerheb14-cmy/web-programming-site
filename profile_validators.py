import re
from datetime import date, datetime


# Patterns
STUDENT_ID = re.compile(r"^\d{9}$")
FULLNAME = re.compile(r"^[A-Za-z][A-Za-z .'\-]{1,79}$")
EMAIL = re.compile(
    r"^[A-Za-z0-9._%+-]+@(?:net\.)?usek\.edu\.lb$",
    re.IGNORECASE,
)
PHONE = re.compile(r"^\+961\s?\d{2}\s?\d{6,7}$")
GITHUB = re.compile(r"^https://github\.com/[A-Za-z0-9-]+/?$")
HTTPS_URL = re.compile(r"^https://\S+$")
MONTH = re.compile(r"^\d{4}-(0[1-9]|1[0-2])$")
TIME = re.compile(r"^(?:[01]\d|2[0-3]):[0-5]\d$")
HEXCOLOR = re.compile(r"^#[0-9A-Fa-f]{6}$")


# Allowed option values copied from your form
MAJORS = {
    "Computer Engineering",
    "Electrical Engineering",
    "Biomedical Engineering",
    "Telecommunications Engineering",
}

GRADUATION = {"Spring", "Summer", "Fall"}
YESNO = {"Yes", "No"}

SKILLS = {
    "Programming",
    "Embedded Systems",
    "Electronics",
    "Computer Networks",
    "Telecommunications",
    "Biomedical Instrumentation",
    "Artificial Intelligence / Machine Learning",
    "Signal Processing",
}

SOFTWARE = {
    "MATLAB",
    "Simulink",
    "LabVIEW",
    "LTspice",
    "Vivado",
    "SolidWorks",
    "Proteus",
}

PROJECT_AREAS = {
    "Artificial Intelligence",
    "Web Applications",
    "Cybersecurity",
    "Internet of Things",
    "Power Systems",
    "Renewable Energy",
    "Control Systems",
    "Medical Imaging",
    "Biosensors",
    "Medical Devices",
    "Wireless Communications",
    "5G / 6G Networks",
}

REQUIRED = {
    "student_id",
    "fullname",
    "email",
    "phone",
    "birthdate",
    "portfolio",
    "gin446",
    "major",
    "gpa",
    "credits",
    "graduation",
    "graduation_month",
    "internship_completed",
    "language",
    "software",
    "project_title",
    "project_area",
    "description",
    "team_size",
    "project_color",
    "meeting_date",
    "meeting_time",
    "confirmation",
}


def to_number(text):
    try:
        return float(text)
    except (TypeError, ValueError):
        return None


def to_int(text):
    try:
        # Only accept whole-number text, such as "3", not "3.5".
        if not re.fullmatch(r"\d+", text):
            return None
        return int(text)
    except (TypeError, ValueError):
        return None


def parse_date(text):
    try:
        return date.fromisoformat(text)
    except (TypeError, ValueError):
        return None


def validate_profile(form):
    errors = {}
    cleaned = {}

    # Required fields must be present and not blank.
    for field in REQUIRED:
        if form.get(field, "").strip() == "":
            errors[field] = "This field is required."

    # Student ID
    student_id = form.get("student_id", "").strip()
    if student_id and not STUDENT_ID.fullmatch(student_id):
        errors["student_id"] = "Student ID must be exactly 9 digits."
    cleaned["student_id"] = student_id

    # Full name
    fullname = form.get("fullname", "").strip()
    if fullname and not FULLNAME.fullmatch(fullname):
        errors["fullname"] = (
            "Use letters, spaces, hyphens or apostrophes (2-80 chars)."
        )
    cleaned["fullname"] = fullname

    # USEK email; save it in lowercase.
    email = form.get("email", "").strip().lower()
    if email and not EMAIL.fullmatch(email):
        errors["email"] = "Use your USEK email (for example, student@net.usek.edu.lb)."
    cleaned["email"] = email

    # Lebanese phone number
    phone = form.get("phone", "").strip()
    if phone and not PHONE.fullmatch(phone):
        errors["phone"] = "Enter a valid Lebanese number, e.g. +961 70 123456."
    cleaned["phone"] = phone

    # Birthdate
    birthdate = form.get("birthdate", "").strip()
    if birthdate:
        birth_day = parse_date(birthdate)
        if birth_day is None:
            errors["birthdate"] = "Not a valid date."
        elif birth_day > date.today():
            errors["birthdate"] = "Date of birth cannot be in the future."
        else:
            age = (date.today() - birth_day).days // 365
            if age < 15 or age > 100:
                errors["birthdate"] = "Age looks out of range."
    cleaned["birthdate"] = birthdate

    # GitHub link
    portfolio = form.get("portfolio", "").strip()
    if portfolio and not GITHUB.fullmatch(portfolio):
        errors["portfolio"] = "Use a GitHub URL: https://github.com/username"
    cleaned["portfolio"] = portfolio

    # GIN446 website link
    gin446 = form.get("gin446", "").strip()
    if gin446 and not HTTPS_URL.fullmatch(gin446):
        errors["gin446"] = "Enter a valid https:// link."
    cleaned["gin446"] = gin446

    # Major
    major = form.get("major", "").strip()
    if major and major not in MAJORS:
        errors["major"] = "Choose a valid major."
    cleaned["major"] = major

    # GPA: number from 40 to 100
    gpa = form.get("gpa", "").strip()
    if gpa:
        number = to_number(gpa)
        if number is None or not 40 <= number <= 100:
            errors["gpa"] = "GPA must be a number between 40 and 100."
    cleaned["gpa"] = gpa

    # Credits: whole number from 0 to 148
    credits = form.get("credits", "").strip()
    if credits:
        number = to_int(credits)
        if number is None or not 0 <= number <= 148:
            errors["credits"] = "Credits must be a whole number between 0 and 148."
    cleaned["credits"] = credits

    # Expected graduation season
    graduation = form.get("graduation", "").strip()
    if graduation and graduation not in GRADUATION:
        errors["graduation"] = "Choose spring, summer or fall."
    cleaned["graduation"] = graduation

    # Graduation month: YYYY-MM
    graduation_month = form.get("graduation_month", "").strip()
    if graduation_month and not MONTH.fullmatch(graduation_month):
        errors["graduation_month"] = "Use the month picker (YYYY-MM)."
    cleaned["graduation_month"] = graduation_month

    # Internship choice
    internship = form.get("internship_completed", "").strip()
    if internship and internship not in YESNO:
        errors["internship_completed"] = "Choose yes or no."
    cleaned["internship_completed"] = internship

    # Programming language
    language = form.get("language", "").strip()
    if len(language) >= 40:
        errors["language"] = "Keep it under 40 characters."
    cleaned["language"] = language

    # Skills: checkboxes may submit several values.
    skills = form.getlist("skills")
    unknown_skills = [skill for skill in skills if skill not in SKILLS]
    if unknown_skills:
        errors["skills"] = "Unknown skill(s): " + ", ".join(unknown_skills)
    cleaned["skills"] = [skill for skill in skills if skill in SKILLS]

    # Software: multi-select may submit several values.
    software = form.getlist("software")
    unknown_software = [item for item in software if item not in SOFTWARE]
    if unknown_software:
        errors["software"] = "Unknown software: " + ", ".join(unknown_software)
    if not software:
        errors["software"] = "This field is required."
    cleaned["software"] = [item for item in software if item in SOFTWARE]

    # Project title
    project_title = form.get("project_title", "").strip()
    if len(project_title) > 120:
        errors["project_title"] = "Title must be 120 characters or fewer."
    cleaned["project_title"] = project_title

    # Project area
    project_area = form.get("project_area", "").strip()
    if project_area and project_area not in PROJECT_AREAS:
        errors["project_area"] = "Choose a valid project area."
    cleaned["project_area"] = project_area

    # Project description
    description = form.get("description", "").strip()
    if len(description) > 1000:
        errors["description"] = "Description must be 1000 characters or fewer."
    cleaned["description"] = description

    # Team size: whole number from 1 to 4
    team_size = form.get("team_size", "").strip()
    if team_size:
        number = to_int(team_size)
        if number is None or not 1 <= number <= 4:
            errors["team_size"] = "Team size must be a whole number from 1 to 4."
    cleaned["team_size"] = team_size

    # Dashboard colour
    project_color = form.get("project_color", "").strip()
    if project_color and not HEXCOLOR.fullmatch(project_color):
        errors["project_color"] = "Use a colour like #336699."
    if not project_color:
        project_color = "#336699"
    cleaned["project_color"] = project_color

    # Meeting date
    meeting_date = form.get("meeting_date", "").strip()
    if meeting_date and parse_date(meeting_date) is None:
        errors["meeting_date"] = "Not a valid date."
    cleaned["meeting_date"] = meeting_date

    # Meeting time: valid HH:MM and between 08:00 and 18:00.
    meeting_time = form.get("meeting_time", "").strip()
    if meeting_time:
        if not TIME.fullmatch(meeting_time):
            errors["meeting_time"] = "Use HH:MM."
        elif not "08:00" <= meeting_time <= "18:00":
            errors["meeting_time"] = "Pick a time between 08:00 and 18:00."
    cleaned["meeting_time"] = meeting_time

    # Confirmation checkbox: absent when unchecked; "yes" when checked.
    confirmation = form.get("confirmation", "").strip()
    if confirmation != "yes":
        errors["confirmation"] = "You must confirm the information is accurate."
    cleaned["confirmation"] = confirmation

    # Hidden field: preserve the submitted version value.
    cleaned["form_version"] = form.get("form_version", "").strip()

    return errors, cleaned

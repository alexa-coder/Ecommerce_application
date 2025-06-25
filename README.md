E-Commerce Platform - Django & ReactJS

Project Overview

-This is a full-stack e-commerce platform with:

-Backend: Django REST Framework for API

-Frontend: ReactJS for user interface

Features:

-User authentication (register/login)

-Product catalog with categories

-Shopping cart functionality

-Order processing

-Product ratings

Prerequisites:

-Python 3.8+

-Node.js 14+

-SQLite

-npm or yarn

Backend Setup (Django)
1. Clone the repository
https://github.com/alexa-coder/Ecommerce_app.git

2. Create and activate virtual environment:
python -m venv venv
/venv/Scripts.activate

3. Install dependencies
pip install -r requirements.txt

4. Run migrations
python manage.py makemigrations
python manage.py migrate

5. Create superuser (admin)
python manage.py createsuperuser

6. Run development server
python manage.py runserver

The API will be available at http://localhost:8000/api/

Frontend Setup (ReactJS)
1. Navigate to frontend directory
cd ../frontend

2. Install dependencies
npm install
# or
yarn install

3. Run development server
npm start

# Getting Started with Create React App

## Navigate to the frontend directory
cd frontend/ecommerce

## install dependencies
npm i --legacy-peer-deps


npm run build
npm run dev

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.


-------------------------------------------------------------------------------------------


# Getting Started with Create Django

## clone project
git clone https://github.com/alexa-coder/Ecommerce_application.git
cd Ecommerce_application/backend

## create virtual environment & activate
python -m venv venv
.\venv\Scripts\activate

## install dependencies
python -m pip install -r requirements.txt

## make migrations
python manage.py makemigrations
python manage.py migrate

## Create super user admin credentials
python manage.py createsuperuser

## Run the server
python manage.py runserver

## For test
python manage.py test

-------------------------------------------------------------------------------

# Docker setup

## Prerequisites
 - Install Docker Desktop

 - Ensure Docker is running

 - Use docker compose (new syntax) instead of docker-compose

# Build & Run Containers
 - cd Ecommerce_application

 - docker compose up --build

## Services
 - Frontend → http://localhost:3000

 - Backend → http://localhost:8000

## Stop containers
 - docker compose down
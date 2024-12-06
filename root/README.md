##### Commands to run backend #####
  cd root/backend
  pipenv shell
  cd backend

  # After adding models:
  python manage.py makemigrations
  python manage.py migrate

  # start http
  python manage.py runserver

  # start https
  python manage.py runserver_plus --cert-file ~/certs/cert.pem --key-file ~/certs/key.pem 8000
  python manage.py runserver_plus --key-file selftest-key --cert-file selftest-cert localhost:8000

##### Commands to run frontend #####
  cd root/frontend
  npm start

##### URLS #####
  # Backend
    http://127.0.0.1:8000/
    https://127.0.0.1:8000/
  
  # Frontend
    http://localhost:3000
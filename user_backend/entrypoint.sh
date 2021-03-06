#!/bin/sh
set -e

/app/BruinBite/users/manage.py makemigrations users
/app/BruinBite/users/manage.py makemigrations matching
/app/BruinBite/users/manage.py migrate
/app/BruinBite/users/manage.py test --no-input

if [ $DJANGO_ENV == "prod" ]; then
    uwsgi --ini /app/BruinBite/users/uwsgi.ini
else
    /app/BruinBite/users/manage.py runserver 0.0.0.0:8000
fi

exec "$@"

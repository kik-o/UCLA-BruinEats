FROM python:3.6-alpine

RUN apk add -U postgresql-dev gcc python3-dev musl-dev linux-headers \
        libxslt-dev libxml2-dev

RUN pip3 install --upgrade uwsgi

RUN mkdir -p /app/BruinBite/menu

ADD ./requirements.txt /app/BruinBite/menu/requirements.txt

RUN pip3 install -r /app/BruinBite/menu/requirements.txt

COPY . /app/BruinBite/menu

EXPOSE 5000

RUN chmod +x /app/BruinBite/menu/entrypoint.sh

ENTRYPOINT ["/app/BruinBite/menu/entrypoint.sh"]

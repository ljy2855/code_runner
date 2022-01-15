FROM python:3.8.1

RUN apt-get update && \
    apt-get install -y openjdk-11-jre-headless && \
    apt-get install -y  default-jdk && \
    apt-get clean;

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . /code/

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
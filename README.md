# Carbon Emission Calculator API

A FastAPI-based service that calculates carbon emissions for food products.

## Installation

1. Create a virtual environment:

```bash
python -m venv .venv
```
and activate the environment

2. Install the dependencies:

```bash
pip install -r requirements.txt
```

## Running the service

```bash
uvicorn backend.main:app --reload
```

## The API will be available in the localhost
Go to your browser and open the following URL:

```
http://localhost:8000/docs
```

# API Documentation 
Once the server is running, you can access:
- Interactive API documentation: http://localhost:8000/docs

## Available Endpoints

- `POST /get-carbon-emission`: Calculate carbon emissions for a list of products
- `GET /test-get-data`: Get test data for sample productOnce the server is running, you can access:
- Interactive API documentation: http://localhost:8000/docs
- Alternative API documentation: http://localhost:8000/redoc

## Available Endpoints

- `POST /get-carbon-emission`: Calculate carbon emissions for a list of products
- `GET /test-get-data`: Get test data for sample productss
from .models import (
    GetCarbonEmissionRequest,
    GetCarbonEmissionResponse,
    ProductWithCarbonEmission,
)
from fastapi import FastAPI
from .database import PRODUCT_EMISSIONS


app = FastAPI()


# TODO: here some hardcore logic needs to be implemented
# connected to operation on the database
@app.post("/get-carbon-emission", response_model=GetCarbonEmissionResponse)
async def get_carbon_emission(
    request: GetCarbonEmissionRequest,
) -> GetCarbonEmissionResponse:
    response_products = []

    for product in request.products:
        product_name = product.name.lower()

        if product_name not in PRODUCT_EMISSIONS:
            # Product not found in database
            response_products.append(
                ProductWithCarbonEmission(
                    name=product.name,
                    mapping_with_emission={},
                    raw_ingredients=None,
                    raw_ingredients_carbon_emission=None,
                )
            )
            continue

        emission_data = PRODUCT_EMISSIONS[product_name]
        response_products.append(
            ProductWithCarbonEmission(
                name=product.name,
                mapping_with_emission=emission_data["mapping_with_emission"],
                raw_ingredients=emission_data["raw_ingredients_name"],
                raw_ingredients_carbon_emission=emission_data[
                    "raw_ingredients_carbon_emission"
                ],
            )
        )

    return GetCarbonEmissionResponse(products=response_products)


# Test endpoint
@app.get("/test-get-data")
async def test_get_data():
    return [
        {
            "name": "burger",
            "mapping_with_emission": {"Patty": 200, "cheese": 200, "Bun": 100},
        },
        {
            "name": "fries",
            "mapping_with_emission": {"Potato": 50, "Oil": 30},
        },
        {
            "name": "chicken",
            "mapping_with_emission": {"Chicken_meat": 150, "Breading": 30},
        },
    ]

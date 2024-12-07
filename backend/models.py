from pydantic import BaseModel
from typing import Dict, List, Optional


class ProductObject(BaseModel):
    name: str
    volume: Optional[float]
    price: Optional[float]


class GetCarbonEmissionRequest(BaseModel):
    products: List[ProductObject]


class ProductWithCarbonEmission(BaseModel):
    name: str
    mapping_with_emission: Dict[str, int]
    raw_ingredients: Optional[List[str]] = None
    raw_ingredients_carbon_emission: Optional[int] = None


class GetCarbonEmissionResponse(BaseModel):
    products: List[ProductWithCarbonEmission]

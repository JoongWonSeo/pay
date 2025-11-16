from datetime import datetime
from typing import Literal

from pay.model import Model


class TiktokPostEvaluation(Model):
    id: str | None = None
    """id as a internal integer"""
    product_mentioned: bool | None = None
    """Whether the product is mentioned in the post"""
    prominence_of_product: Literal["high", "medium", "low"] | None = None
    """How prominent the product is in the post"""
    target_group_fit: Literal["high", "medium", "low"] | None = None
    """How well the post fits the target group"""
    post_type: (
        Literal["demo", "review", "product recommendation", "trend", "other"] | None
    ) = None
    """Type of post"""
    estimated_ctr: float | None = None
    """Estimated CTR (typically around 0.2% to 5%)"""
    date_evaluated: datetime | None = None
    """Date evaluated"""
    evaluation_text: str | None = None
    """Evaluation"""

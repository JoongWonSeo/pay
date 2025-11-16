from datetime import datetime
from typing import Literal

from pay.agents.post_evaluation_agent import TiktokPostEvaluation
from pay.model import Model
from pay.tiktok import TiktokPost


class ChatMessage(Model):
    role: Literal["payout_agent", "creator"]
    """Role of the message sender"""
    content: str
    """Content of the message"""
    timestamp: datetime
    """Timestamp of the message"""


class ChatBetweenAgentAndCreator(Model):
    chat_history: list[ChatMessage] = []


class Payout(Model):
    chat_between_agent_and_creator: ChatBetweenAgentAndCreator
    """social context between the agent and the creator"""
    number_of_views: int | None = None
    """Number of views of the post"""
    determined_price_per_1k: float | None = None
    """Determined price per 1K views, based on the post evaluation"""
    determined_base_payout: float | None = None
    """Determined base payout for the post, in USDC"""
    determined_penalty: float | None = None
    """Determined penalty for the post, in USDC, so value of x means the payout is reduced by x USDC, always non-negative"""
    penalty_reason: str | None = None
    """Reason for the penalty"""
    determined_bonus: float | None = None
    """Determined bonus for the post, in USDC, so value of x means the payout is increased by x USDC, always non-negative"""
    bonus_reason: str | None = None
    """Reason for the bonus"""
    determined_final_payout: float | None = None
    """Determined final payout based on all factors, in USDC"""
    date_paid: datetime
    """Date paid"""


class PayoutAgentService:
    def __init__(self):
        self.agent_history: list[dict] = []

    async def evaluate_and_pay_for_post(
        self,
        post: TiktokPost,
        post_evaluation: TiktokPostEvaluation,
    ) -> None:
        """Given a tiktok post and its performance evaluation, determine the payout amount and use the locus MCP to pay the tiktok user."""

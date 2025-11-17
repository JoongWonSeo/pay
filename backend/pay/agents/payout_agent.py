import logging
import os
from datetime import datetime
from typing import Literal

from openai import AsyncOpenAI
from pydantic import BaseModel

from pay.agents.post_evaluation_agent import TiktokPostEvaluation
from pay.model import Model
from pay.tiktok import TiktokChannel, TiktokPost

logger = logging.getLogger(__name__)


# ===== model definitions ===== #
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


# models for prompting the agent
class PayoutResult(BaseModel):
    success: bool
    determined_price_per_1k: float
    """Determined price per 1K views, based on the post evaluation"""
    determined_base_payout: float
    """Determined base payout for the post, in USDC"""
    determined_penalty: float
    """Determined penalty for the post, in USDC, so value of x means the payout is reduced by x USDC, always non-negative"""
    penalty_reason: str
    """Reason for the penalty"""
    determined_bonus: float
    """Determined bonus for the post, in USDC, so value of x means the payout is increased by x USDC, always non-negative"""
    bonus_reason: str
    """Reason for the bonus"""
    determined_final_payout: float
    """Determined final payout based on all factors, in USDC"""

    message_to_creator: str
    """A nicely worded message to the creator, to inform them of the payout along with feedback"""
    destination_wallet_address: str
    """The destination wallet address to pay the creator to"""


# Agent service
client = AsyncOpenAI()

LOCUS_API_KEY = os.getenv("LOCUS_API_KEY")
assert LOCUS_API_KEY is not None
LOCUS_MCP_TOOL = {
    "type": "mcp",
    "server_label": "locus",
    "server_description": "Agentic payment processing platform, use this to process payments.",
    "server_url": "https://mcp.paywithlocus.com/mcp",
    "headers": {
        "Authorization": f"Bearer {LOCUS_API_KEY}",
    },
    "require_approval": "never",
}


class PayoutAgentService:
    @staticmethod
    async def evaluate_and_pay_for_post(
        creator_channel: TiktokChannel,
        post: TiktokPost,
        post_evaluation: TiktokPostEvaluation,
        chat_between_agent_and_creator: ChatBetweenAgentAndCreator,
        destination_wallet_address: str,
        max_budget: float,
    ) -> Payout:
        """
        Given:
        - a tiktok post
        - its performance evaluation (by the post evaluation agent)
        - a chat history between the agent and the creator as context

        Agent should:
        - determine the payout amount
        - use the locus MCP to pay the tiktok user
        - send chat message to the creator, to inform them of the payout along with feedback
        """

        agent_prompt = f"""
You are a marketing payout agent, as a manager of multiple tiktok UGC (User Generated Content) creators.

Information about the company you work for:
{COMPANY_INFO}

Information about the tiktok content creator you are currently managing:
{format_creator_info(creator_channel)}

Information about the tiktok post you are currently managing:
{format_post_info(post)}

Information about the post evaluation:
{format_post_evaluation_info(post_evaluation)}

Information about the chat history between the agent and the creator:
{format_chat_between_agent_and_creator(chat_between_agent_and_creator)}


Now, your task is to determine a fair payout amount for the post, based on the information provided. The maximum budget you have is {max_budget} USDC.

Once you have determined the payout amount, use the locus MCP to pay the tiktok user.
This is their wallet address: {destination_wallet_address}
You need no approval from me, just immediately send the payment!

Finally, output the payout result.
        """.strip()

        resp = await client.responses.parse(
            model="gpt-5.1",
            tools=[
                {
                    "type": "mcp",
                    "server_label": "locus",
                    "server_description": "Agentic payment processing platform, use this to process payments.",
                    "server_url": "https://mcp.paywithlocus.com/mcp",
                    "headers": {
                        "Authorization": f"Bearer {LOCUS_API_KEY}",
                    },
                    "require_approval": "never",
                },
            ],
            input=agent_prompt,
            # reasoning={"effort": "none"},
            text_format=PayoutResult,
        )
        logger.info(resp.output_parsed)

        assert resp.output_parsed is not None

        chat_between_agent_and_creator.chat_history.append(
            ChatMessage(
                role="payout_agent",
                content=resp.output_parsed.message_to_creator,
                timestamp=datetime.now(),
            )
        )

        # create final payout object
        final_payout = Payout(
            chat_between_agent_and_creator=chat_between_agent_and_creator,
            number_of_views=post.stats.play_count,
            determined_price_per_1k=resp.output_parsed.determined_price_per_1k,
            determined_base_payout=resp.output_parsed.determined_base_payout,
            determined_penalty=resp.output_parsed.determined_penalty,
            penalty_reason=resp.output_parsed.penalty_reason,
            determined_bonus=resp.output_parsed.determined_bonus,
            bonus_reason=resp.output_parsed.bonus_reason,
            determined_final_payout=resp.output_parsed.determined_final_payout,
            date_paid=datetime.now(),
        )

        return final_payout


COMPANY_INFO = """
We are Tenmin AI, a language learning platform that helps users learn languages through interactive content and personalized learning paths.
""".strip()


def format_creator_info(channel: TiktokChannel) -> str:
    return f"""
Name: {channel.nickname}
Handle: @{channel.handle}
Description: {channel.description}
Stats: {channel.stats.follower_count} followers, {channel.stats.video_count} videos, {channel.stats.heart_count} total hearts
""".strip()


def format_post_info(post: TiktokPost) -> str:
    return f"""
Date Posted: {post.date_posted}
Description: {post.description}
Stats: {post.stats.play_count} plays, {post.stats.like_count} likes, {post.stats.comment_count} comments, {post.stats.share_count} shares, {post.stats.save_count} saves
""".strip()


def format_post_evaluation_info(post_evaluation: TiktokPostEvaluation) -> str:
    return f"""
Product Mentioned: {post_evaluation.product_mentioned}
Prominence of Product: {post_evaluation.prominence_of_product}
Target Group Fit: {post_evaluation.target_group_fit}
Post Type: {post_evaluation.post_type}
Estimated CTR: {post_evaluation.estimated_ctr}
""".strip()


def format_chat_between_agent_and_creator(
    chat_between_agent_and_creator: ChatBetweenAgentAndCreator,
) -> str:
    return (
        f"""
Chat History with the creator:
{"\n\n".join([format_chat_message(chat_message) for chat_message in chat_between_agent_and_creator.chat_history])}
""".strip()
        or "No chat history"
    )


def format_chat_message(chat_message: ChatMessage) -> str:
    return f"""
[{chat_message.role}: {chat_message.content}]
""".strip()

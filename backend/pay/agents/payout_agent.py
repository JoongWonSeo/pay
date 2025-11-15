from pay.synced import TiktokPostEvaluation
from pay.tiktok import TiktokPost


class PayoutAgentService:
    async def evaluate_and_pay_for_post(
        self,
        post: TiktokPost,
        post_evaluation: TiktokPostEvaluation,
    ) -> None:
        """Given a tiktok post and its performance evaluation, determine the payout amount and use the locus MCP to pay the tiktok user."""

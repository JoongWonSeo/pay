from pydantic import BaseModel, ConfigDict


class Model(BaseModel):
    """
    The base model we use for all our models.
    It provides features for better integration with FastAPI.
    """

    model_config = ConfigDict(
        # FastAPI return types and ws-sync state types
        json_schema_serialization_defaults_required=True,
        # Attribute docstrings are used for OpenAPI schema generation
        use_attribute_docstrings=True,
    )

    # # Pydantic currently does not support providing a default JSON schema generator.
    # # So instead, we override the model_json_schema method to use our custom generator by default
    # @classmethod
    # def model_json_schema(cls, *args, **kwargs):
    #     kwargs.pop("schema_generator", None)
    #     return super().model_json_schema(
    #         *args, schema_generator=CustomGenerateJsonSchema, **kwargs
    #     )

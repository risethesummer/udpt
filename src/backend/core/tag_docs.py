from .docs import SPEC

TAG_PROPERTIES = {
    "pk": {
        "type": "integer",
        "example": 1,
    },
    "model": {
        "type": "string",
        "example": "taggit.tag",
    },
    "fields": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "example": "testtag1",
            },
            "slug": {
                "type": "string",
                "example": "testtag1",
            },
        },
    },
}

SPEC.components.schema("TagResponse", {
    "properties": TAG_PROPERTIES,
})


SPEC.path(
    path="/models/tags/records/",
    operations={
        "get": {
            "tags": ["Tag"],
            "summary": "List tags",
            "description": "List tags",
            "parameters": [
                {
                    "name": "search",
                    "in": "query",
                    "description": "Search tags",
                    "required": False,
                    "schema": {
                        "type": "string",
                        "example": "testtag1",
                    },
                },
                {
                    "name": "thread",
                    "in": "query",
                    "description": "Filter by thread",
                    "required": False,
                    "schema": {
                        "type": "integer",
                        "example": 1,
                    },
                },
            ],
            "responses": {
                "200": {
                    "description": "List tags",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "count": {
                                        "type": "integer",
                                        "example": 1,
                                    },
                                    "results": {
                                        "type": "array",
                                        "items": "TagResponse",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
)


SPEC.path(
    path="/models/tags/records/{pk}/",
    operations={
        "get": {
            "tags": ["Tag"],
            "summary": "Retrieve tag",
            "description": "Retrieve tag",
            "parameters": [
                {
                    "name": "pk",
                    "in": "path",
                    "description": "Tag primary key",
                    "required": True,
                    "schema": {
                        "type": "integer",
                        "example": 1,
                    },
                },
            ],
            "responses": {
                "200": {
                    "description": "Retrieve tag",
                    "content": {
                        "application/json": {
                            "schema": "TagResponse",
                        },
                    },
                },
            },
        },
    },
)


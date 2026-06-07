import json
from typing import Any, Dict


def load_config(path: str) -> Dict[str, Any]:
    """Load JSON config from `path` and return as dict."""
    with open(path, "r", encoding="utf-8") as fh:
        return json.load(fh)


def validate_config(cfg: Dict[str, Any]) -> bool:
    """Perform minimal validation of an `optic.json` structure.

    Raises ValueError on invalid config; returns True when valid.
    """
    if not isinstance(cfg, dict):
        raise ValueError("config must be a JSON object")

    if "optic_pipeline" not in cfg:
        raise ValueError("missing 'optic_pipeline' key")

    pipeline = cfg["optic_pipeline"]
    if not isinstance(pipeline, dict):
        raise ValueError("'optic_pipeline' must be an object")

    name = pipeline.get("name")
    stages = pipeline.get("stages")
    if not name or not isinstance(name, str):
        raise ValueError("pipeline must have a string 'name'")
    if not isinstance(stages, list) or len(stages) == 0:
        raise ValueError("pipeline must have a non-empty 'stages' list")

    for idx, s in enumerate(stages):
        if not isinstance(s, dict):
            raise ValueError(f"stage at index {idx} must be an object")
        required = ("stage", "name", "provider", "model", "context_strategy")
        for key in required:
            if key not in s:
                raise ValueError(f"stage {idx} missing required key: {key}")

    return True

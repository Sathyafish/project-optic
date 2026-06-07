import json

from optic.config import load_config, validate_config


def test_load_and_validate(tmp_path):
    cfg = {
        "optic_pipeline": {
            "name": "test-pipeline",
            "stages": [
                {
                    "stage": 1,
                    "name": "gen",
                    "provider": "local",
                    "model": "dummy",
                    "context_strategy": "raw_prompt",
                }
            ],
        }
    }
    p = tmp_path / "optic.json"
    p.write_text(json.dumps(cfg))

    loaded = load_config(str(p))
    assert loaded["optic_pipeline"]["name"] == "test-pipeline"
    assert validate_config(loaded) is True

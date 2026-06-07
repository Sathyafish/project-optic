"""Simple CLI to load and show an `optic.json` pipeline."""

import sys
import argparse
from .config import load_config, validate_config


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(prog="optic", description="Optic minimal CLI")
    parser.add_argument("--config", "-c", default="optic.json", help="Path to optic.json")
    args = parser.parse_args(argv)

    try:
        cfg = load_config(args.config)
    except FileNotFoundError:
        print(f"Config file not found: {args.config}")
        return 2
    except Exception as exc:
        print(f"Failed to read config: {exc}")
        return 2

    try:
        validate_config(cfg)
    except Exception as exc:
        print(f"Invalid optic.json: {exc}")
        return 2

    pipeline = cfg["optic_pipeline"]
    print(f"Pipeline: {pipeline.get('name')}")
    for s in pipeline.get("stages", []):
        print(f"- Stage {s.get('stage')}: {s.get('name')} ({s.get('provider')}/{s.get('model')})")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

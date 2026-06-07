# 👁️ Optic

Optic is a next-generation developer framework that brings **Declarative AI Engineering** directly into your IDE workspace. 

Unlike traditional AI code editors that treat model routing and context management as an opaque black box, Optic gives developers full control to configure, prune, and route multi-stage LLM pipelines using code.

By isolating expensive frontier models (like Claude 4.7 Opus) strictly to high-cognitive windows—and offloading boilerplate generation, linting, and documentation to high-throughput open-source models—**Optic slashes enterprise development token costs by 65% to 80%.**

---

## 🚀 Key Features

* **Declarative Routing:** Define your multi-agent architecture via a simple `optic.json` file in your repository root.
* **Granular Context Pruning:** Eliminate the "Context Tax". Explicitly declare what data transfers between steps, completely wiping out bloated, intermediary chat logs.
* **Model Agnostic Infrastructure:** Seamlessly bridge specialized open-source models (via NVIDIA NIM or MiniMax) with flagship enterprise frontiers.
* **Deterministic Governance:** Ensure sensitive code snippets only hit audited compliance endpoints during explicit evaluation windows.

---

## 🛠️ Configuration (`optic.json`)

Configure your asymmetric pipeline directly in your workspace. Define stages, providers, and exact context compilation strategies:

```json
{
  "optic_pipeline": {
    "name": "Secure-Python-DB-Flow",
    "stages": [
      {
        "stage": 1,
        "name": "Code Generation",

      ## Getting Started (scaffold)

      This repository includes a minimal Python scaffold that can load and validate `optic.json`.

      - Install (recommended in a virtualenv):

      ```bash
      python -m pip install -U build
      python -m pip install -e .
      ```

      - Run the CLI to print pipeline summary:

      ```bash
      optic --config optic.json
      ```

      - Run tests (requires `pytest`):

      ```bash
      python -m pip install pytest
      pytest -q
      ```

      ## ⚙️ Deploy & Use

      Below are concise steps to build, install, run, and package the two main deliverables in this repo: the Python CLI and the VS Code IDE client.

      **Python CLI (`optic`)**

      - Create a virtual environment and install build tools:

      ```bash
      python -m venv .venv
      source .venv/bin/activate
      python -m pip install -U pip build
      ```

      - Build and install locally (editable install for development):

      ```bash
      python -m pip install -e .
      ```

      - Run the CLI to validate or show a pipeline (uses `optic.json` by default):

      ```bash
      optic --config optic.json
      ```

      **Run tests**

      ```bash
      python -m pip install pytest
      pytest -q
      ```

      **VS Code Extension (development)**

      - Open the workspace in VS Code and launch the Extension Development Host:

      ```bash
      code .
      # In VS Code: Run view -> Launch Extension (F5)
      ```

      - In the Extension Development Host window, open the Command Palette (⇧⌘P / Ctrl+Shift+P) and run **Open Optic Pipeline**.

      **VS Code Extension (package and install)**

      - To package the extension for distribution, install `vsce` and create a `.vsix` file:

      ```bash
      npm install -g vsce
      cd ide-client/vscode
      vsce package
      ```

      - Install the generated `.vsix` into VS Code:

      ```bash
      code --install-extension optic-vscode-0.0.1.vsix
      ```

      **Publishing (optional)**

      - Python: publish the built distribution to PyPI using `twine` (follow PyPI publishing best practices).
      - VS Code: publish using `vsce publish` or via the Visual Studio Marketplace (requires a publisher account).

      **Dev notes & next steps**

      - The IDE client currently displays `optic.json` in a webview. Next improvements:
        - Embed `monaco-editor` for inline JSON editing and diagnostics.
        - Wire the webview to the Python backend (`optic` CLI) using the extension host messaging API to run/validate pipelines and stream logs.
        - Add authentication and safe execution sandboxing before invoking any external provider endpoints.

      If you want, I can scaffold the `monaco` editor integration in the webview and hook up `/api/validate` calls to the Python CLI next.

        "provider": "nvidia_nim",
        "model": "meta/llama-3.1-70b-instruct",
        "context_strategy": "raw_prompt"
      },
      {
        "stage": 2,
        "name": "Linter & Logic Review",
        "provider": "minimax",
        "model": "minimax-abab6.5",
        "context_strategy": "previous_stage_only"
      },
      {
        "stage": 3,
        "name": "Security Gatekeeper",
        "provider": "anthropic",
        "model": "claude-4.7-opus",
        "context_strategy": "aggregate_all_history"
      },
      {
        "stage": 4,
        "name": "Markdown Documentation",
        "provider": "nvidia_nim",
        "model": "mistralai/mixtral-8x22b-instruct",
        "context_strategy": "code_only"
      }
    ]
  }
}

const vscode = require('vscode');
const path = require('path');

/**
 * Activate the extension
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const disposable = vscode.commands.registerCommand('optic.open', async () => {
    const panel = vscode.window.createWebviewPanel(
      'opticPipeline',
      'Optic Pipeline',
      vscode.ViewColumn.One,
      { enableScripts: true }
    );

    // Try to load optic.json from workspace root
    let configText = null;
    try {
      const wsFolders = vscode.workspace.workspaceFolders;
      if (!wsFolders || wsFolders.length === 0) {
        throw new Error('No workspace folder open');
      }
      const root = wsFolders[0].uri;
      const cfgUri = vscode.Uri.joinPath(root, 'optic.json');
      const doc = await vscode.workspace.openTextDocument(cfgUri);
      configText = doc.getText();
    } catch (err) {
      configText = null;
    }

    panel.webview.html = getWebviewContent(configText);

    // Handle messages from the webview
    panel.webview.onDidReceiveMessage(async (message) => {
      if (message.command === 'openFile' && message.path) {
        const uri = vscode.Uri.file(message.path);
        const doc = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(doc);
      }
    }, undefined, context.subscriptions);
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

function getWebviewContent(configText) {
  const safeConfig = configText ? configText.replace(/</g, '&lt;') : null;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Optic Pipeline</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 12px; }
    pre { background:#f6f8fa; padding:10px; border-radius:6px; overflow:auto }
    .stage { margin:8px 0; padding:8px; border:1px solid #e1e4e8; border-radius:6px }
    .toolbar { margin-bottom:10px }
    button { margin-right:8px }
  </style>
</head>
<body>
  <div class="toolbar">
    <button id="refresh">Refresh</button>
    <button id="openFile">Open optic.json</button>
  </div>
  <h2>Pipeline</h2>
  <div id="content">
    <div id="no-config">Loading workspace optic.json...</div>
  </div>

  <script>
    const vscode = acquireVsCodeApi && acquireVsCodeApi();
    const raw = ${safeConfig ? '`' + safeConfig + '`' : 'null'};

    function render(cfgText) {
      const content = document.getElementById('content');
      content.innerHTML = '';
      if (!cfgText) {
        content.innerHTML = '<div>No `optic.json` found in workspace root.</div>';
        return;
      }
      try {
        const cfg = JSON.parse(cfgText);
        const pipeline = cfg.optic_pipeline || {};
        const title = document.createElement('div');
        title.textContent = pipeline.name || 'Unnamed pipeline';
        content.appendChild(title);

        const stages = pipeline.stages || [];
        stages.forEach(s => {
          const el = document.createElement('div');
          el.className = 'stage';
          el.innerHTML = `<strong>Stage ${s.stage} - ${s.name}</strong><div>${s.provider}/${s.model}</div><div>Context: ${s.context_strategy}</div>`;
          content.appendChild(el);
        });

        const rawPre = document.createElement('pre');
        rawPre.textContent = JSON.stringify(cfg, null, 2);
        content.appendChild(rawPre);
      } catch (err) {
        content.innerHTML = '<div>Failed to parse optic.json: ' + err.message + '</div>';
      }
    }

    render(raw);

    document.getElementById('refresh').addEventListener('click', () => {
      // ask host to refresh by re-opening the panel (simple approach)
      window.location.reload();
    });

    document.getElementById('openFile').addEventListener('click', () => {
      if (vscode) vscode.postMessage({ command: 'openFile', path: 'optic.json' });
    });
  </script>
</body>
</html>`;
}

module.exports = {
  activate,
  deactivate
};

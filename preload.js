const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('launcher', {
  platform: process.platform,
  appVersion: () => ipcRenderer.invoke('app-version'),
  getConfig: () => ipcRenderer.invoke('get-config'),
  setRoot: (root) => ipcRenderer.invoke('set-root', root),
  pickRoot: () => ipcRenderer.invoke('pick-root'),
  setLaunch: (launch) => ipcRenderer.invoke('set-launch', launch),
  togglePin: (projectPath) => ipcRenderer.invoke('toggle-pin', projectPath),
  listProjects: (root) => ipcRenderer.invoke('list-projects', root),
  projectStats: (projectPath) => ipcRenderer.invoke('project-stats', projectPath),
  projectMetrics: (projectPath) => ipcRenderer.invoke('project-metrics', projectPath),
  projectDetail: (projectPath) => ipcRenderer.invoke('project-detail', projectPath),
  overviewMetrics: (days) => ipcRenderer.invoke('overview-metrics', days),
  projectSummary: (projectPath) => ipcRenderer.invoke('project-summary', projectPath),
  aiSummary: (projectPath, name) => ipcRenderer.invoke('ai-summary', { projectPath, name }),
  setApiKey: (key) => ipcRenderer.invoke('set-api-key', key),
  setAiSummaries: (on) => ipcRenderer.invoke('set-ai-summaries', on),
  setTheme: (theme) => ipcRenderer.invoke('set-theme', theme),
  setAutoTrust: (on) => ipcRenderer.invoke('set-auto-trust', on),
  completeOnboarding: (patch) => ipcRenderer.invoke('complete-onboarding', patch),
  detectClaude: () => ipcRenderer.invoke('detect-claude'),
  checkRoot: (root) => ipcRenderer.invoke('check-root', root),
  createRoot: (root) => ipcRenderer.invoke('create-root', root),
  getContext: () => ipcRenderer.invoke('get-context'),
  openMemoryFolder: () => ipcRenderer.invoke('open-memory-folder'),
  searchTranscripts: (query, filters) => ipcRenderer.invoke('search-transcripts', query, filters),
  readTranscript: (args) => ipcRenderer.invoke('read-transcript', args),
  openProject: (projectPath) => ipcRenderer.invoke('open-project', projectPath),
  copyText: (text) => ipcRenderer.invoke('copy-text', text),
  setTerminal: (val) => ipcRenderer.invoke('set-terminal', val),
  createProject: (root, name) => ipcRenderer.invoke('create-project', { root, name }),
  openInExplorer: (projectPath) => ipcRenderer.invoke('open-in-explorer', projectPath),
  onFsChanged: (cb) => {
    const handler = (_e, scope) => cb(scope);
    ipcRenderer.on('fs-changed', handler);
    return () => ipcRenderer.removeListener('fs-changed', handler);
  },
  onUpdateStatus: (cb) => {
    const handler = (_e, payload) => cb(payload);
    ipcRenderer.on('update-status', handler);
    return () => ipcRenderer.removeListener('update-status', handler);
  },
  installUpdate: () => ipcRenderer.invoke('install-update'),
  checkUpdate: () => ipcRenderer.invoke('check-update'),
});

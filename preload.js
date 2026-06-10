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
  setAdminKey: (key) => ipcRenderer.invoke('set-admin-key', key),
  adminBilling: () => ipcRenderer.invoke('admin-billing'),
  setAiSummaries: (on) => ipcRenderer.invoke('set-ai-summaries', on),
  setTheme: (theme) => ipcRenderer.invoke('set-theme', theme),
  setAccent: (accent) => ipcRenderer.invoke('set-accent', accent),
  setHotkey: (opts) => ipcRenderer.invoke('set-hotkey', opts),
  setRedact: (on) => ipcRenderer.invoke('set-redact', on),
  setAutoTrust: (on) => ipcRenderer.invoke('set-auto-trust', on),
  completeOnboarding: (patch) => ipcRenderer.invoke('complete-onboarding', patch),
  detectClaude: () => ipcRenderer.invoke('detect-claude'),
  checkRoot: (root) => ipcRenderer.invoke('check-root', root),
  createRoot: (root) => ipcRenderer.invoke('create-root', root),
  getContext: () => ipcRenderer.invoke('get-context'),
  openMemoryFolder: () => ipcRenderer.invoke('open-memory-folder'),
  searchTranscripts: (query, filters) => ipcRenderer.invoke('search-transcripts', query, filters),
  searchProjects: (query, list) => ipcRenderer.invoke('search-projects', query, list),
  readTranscript: (args) => ipcRenderer.invoke('read-transcript', args),
  branchSession: (cwd, sessionId) => ipcRenderer.invoke('branch-session', cwd, sessionId),
  resumeSession: (cwd, sessionId) => ipcRenderer.invoke('resume-session', cwd, sessionId),
  gitStatus: (projectPath) => ipcRenderer.invoke('git-status', projectPath),
  activeSession: (preferId) => ipcRenderer.invoke('active-session', preferId),
  activeSessions: () => ipcRenderer.invoke('active-sessions'),
  insights: () => ipcRenderer.invoke('insights'),
  awayDigest: () => ipcRenderer.invoke('away-digest'),
  mcpUsage: () => ipcRenderer.invoke('mcp-usage'),
  setNote: (projectPath, text) => ipcRenderer.invoke('set-note', projectPath, text),
  setLoginItem: (opts) => ipcRenderer.invoke('set-login-item', opts),
  dailyRecap: (opts) => ipcRenderer.invoke('daily-recap', opts),
  openProject: (projectPath, overrides) => ipcRenderer.invoke('open-project', projectPath, overrides),
  setBudget: (b) => ipcRenderer.invoke('set-budget', b),
  setNotifications: (on) => ipcRenderer.invoke('set-notifications', on),
  budgetStatus: () => ipcRenderer.invoke('budget-status'),
  modelSpend: () => ipcRenderer.invoke('model-spend'),
  getRoutines: () => ipcRenderer.invoke('get-routines'),
  saveRoutine: (r) => ipcRenderer.invoke('save-routine', r),
  deleteRoutine: (id) => ipcRenderer.invoke('delete-routine', id),
  toggleRoutine: (id) => ipcRenderer.invoke('toggle-routine', id),
  runRoutine: (id) => ipcRenderer.invoke('run-routine', id),
  onRoutinesUpdated: (cb) => {
    const h = () => cb();
    ipcRenderer.on('routines-updated', h);
    return () => ipcRenderer.removeListener('routines-updated', h);
  },
  toggleArchive: (projectPath) => ipcRenderer.invoke('toggle-archive', projectPath),
  setTag: (projectPath, tag) => ipcRenderer.invoke('set-tag', { projectPath, tag }),
  setClient: (projectPath, client) => ipcRenderer.invoke('set-client', { projectPath, client }),
  clientReport: () => ipcRenderer.invoke('client-report'),
  openInEditor: (projectPath) => ipcRenderer.invoke('open-in-editor', projectPath),
  exportCsv: () => ipcRenderer.invoke('export-csv'),
  copyText: (text) => ipcRenderer.invoke('copy-text', text),
  setTerminal: (val) => ipcRenderer.invoke('set-terminal', val),
  createProject: (root, name) => ipcRenderer.invoke('create-project', { root, name }),
  openInExplorer: (projectPath) => ipcRenderer.invoke('open-in-explorer', projectPath),
  // ---- live preview (launch a project's app/site) ----
  previewScan: (paths) => ipcRenderer.invoke('preview-scan', paths),
  previewDetect: (projectPath) => ipcRenderer.invoke('preview-detect', projectPath),
  previewState: () => ipcRenderer.invoke('preview-state'),
  previewLaunch: (projectPath, name) => ipcRenderer.invoke('preview-launch', projectPath, name),
  previewOpen: (projectPath, name) => ipcRenderer.invoke('preview-open', projectPath, name),
  previewStop: (projectPath) => ipcRenderer.invoke('preview-stop', projectPath),
  previewLog: (projectPath) => ipcRenderer.invoke('preview-log', projectPath),
  setPreviewTarget: (val) => ipcRenderer.invoke('set-preview-target', val),
  claudeAccount: () => ipcRenderer.invoke('claude-account'),
  // ---- agent maker ----
  agentsList: (projectPath) => ipcRenderer.invoke('agents-list', projectPath),
  agentSave: (a) => ipcRenderer.invoke('agent-save', a),
  agentDelete: (args) => ipcRenderer.invoke('agent-delete', args),
  openAgentsFolder: (args) => ipcRenderer.invoke('open-agents-folder', args),
  generateAgentPrompt: (args) => ipcRenderer.invoke('generate-agent-prompt', args),
  onPreviewChanged: (cb) => {
    const handler = (_e, state) => cb(state);
    ipcRenderer.on('preview-changed', handler);
    return () => ipcRenderer.removeListener('preview-changed', handler);
  },
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
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
});

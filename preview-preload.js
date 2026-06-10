// Minimal bridge for the in-app preview window's toolbar.
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('previewBridge', {
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  onNavigate: (handler) => {
    const h = (_e, url) => handler(url);
    ipcRenderer.on('preview-navigate', h);
    return () => ipcRenderer.removeListener('preview-navigate', h);
  },
});

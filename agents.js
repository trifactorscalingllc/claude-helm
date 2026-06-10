// agents.js — create/list/edit/delete Claude Code subagents.
//
// A subagent is a Markdown file with YAML frontmatter, stored in:
//   • global  → ~/.claude/agents/<name>.md      (available in every project)
//   • project → <project>/.claude/agents/<name>.md (scoped to one repo)
//
// Frontmatter: name, description, optional `tools` (comma list; omit = inherit all),
// optional `model` (sonnet|opus|haiku; omit = inherit). Body = the system prompt.

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const NAME_RE = /^[a-z0-9][a-z0-9-]*$/;

function agentsDir(home, scope, projectPath) {
  if (scope === 'project') {
    if (!projectPath) throw new Error('No project selected.');
    return path.join(projectPath, '.claude', 'agents');
  }
  return path.join(home, '.claude', 'agents');
}

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: text.trim() };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const mm = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (mm) meta[mm[1]] = mm[2].trim().replace(/^["']|["']$/g, '');
  }
  return { meta, body: (m[2] || '').trim() };
}

function buildFile(a) {
  const fm = [`name: ${a.name}`, `description: ${(a.description || '').replace(/\n/g, ' ')}`];
  if (Array.isArray(a.tools) && a.tools.length) fm.push(`tools: ${a.tools.join(', ')}`);
  if (a.model && a.model !== 'inherit') fm.push(`model: ${a.model}`);
  return `---\n${fm.join('\n')}\n---\n\n${(a.prompt || '').trim()}\n`;
}

async function listOne(dir, scope, projectPath) {
  let names = [];
  try { names = await fsp.readdir(dir); } catch { return []; }
  const out = [];
  for (const f of names) {
    if (!f.endsWith('.md')) continue;
    let text = '';
    try { text = await fsp.readFile(path.join(dir, f), 'utf8'); } catch { continue; }
    const { meta, body } = parseFrontmatter(text);
    out.push({
      scope,
      projectPath: scope === 'project' ? projectPath : '',
      file: f,
      name: meta.name || f.replace(/\.md$/, ''),
      description: meta.description || '',
      tools: meta.tools ? meta.tools.split(',').map((s) => s.trim()).filter(Boolean) : [],
      model: meta.model || 'inherit',
      prompt: body,
    });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

async function list(home, projectPath) {
  const global = await listOne(agentsDir(home, 'global'), 'global');
  let project = [];
  if (projectPath) project = await listOne(agentsDir(home, 'project', projectPath), 'project', projectPath);
  return { global, project };
}

async function save(home, a) {
  if (!NAME_RE.test(a.name || '')) {
    return { ok: false, error: 'Name must be lowercase letters, numbers and dashes (e.g. code-reviewer).' };
  }
  let dir;
  try { dir = agentsDir(home, a.scope, a.projectPath); } catch (e) { return { ok: false, error: e.message }; }
  try {
    await fsp.mkdir(dir, { recursive: true });
    // a rename removes the old file
    if (a.originalName && a.originalName !== a.name) {
      try { await fsp.unlink(path.join(dir, a.originalName + '.md')); } catch {}
    }
    const file = path.join(dir, a.name + '.md');
    await fsp.writeFile(file, buildFile(a), 'utf8');
    return { ok: true, file };
  } catch (e) { return { ok: false, error: e.message }; }
}

async function remove(home, scope, projectPath, name) {
  let dir;
  try { dir = agentsDir(home, scope, projectPath); } catch (e) { return { ok: false, error: e.message }; }
  try { await fsp.unlink(path.join(dir, name + '.md')); return { ok: true }; }
  catch (e) { return { ok: false, error: e.message }; }
}

function dirFor(home, scope, projectPath) {
  try { return agentsDir(home, scope, projectPath); } catch { return ''; }
}

module.exports = { list, save, remove, dirFor, parseFrontmatter, buildFile };

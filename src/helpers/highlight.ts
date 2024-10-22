import { parse } from '@ein/bash-parser'

// #region ------------------------- Parsing -------------------------
export const NodeType = {
  unknown: 'unknown',
  // Commands
  command: 'command', // Generic command (any of the following)
  program: 'program',
  builtin: 'builtin',
  alias: 'alias',
  commandError: 'commandError',
  // Assignment
  assignment: 'assignment',
  // Redirect
  redirect: 'redirect',
  // Parameters in different formats
  parameter: 'parameter',
  environment: 'environment',
  option: 'option',
  quote: 'quote',
  // Comments
  comment: 'comment',
}

// prettier-ignore
const builtins = [
    'alias', 'alloc',
    'bg', 'bind', 'bindkey', 'break', 'breaksw', 'builtins',
    'case', 'cd', 'chdir', 'command', 'complete', 'continue',
    'default', 'dirs', 'do', 'done',
    'echo', 'echotc', 'elif', 'else', 'end', 'endif', 'endsw',
    'esac', 'eval', 'exec', 'exit', 'export',
    'false', 'fc', 'fg', 'filetest', 'fi', 'for', 'foreach',
    'getopts', 'glob', 'goto',
    'hash', 'hashstat', 'history', 'hup',
    'if',
    'jobid', 'jobs',
    'kill',
    'limit', 'local', 'log', 'login', 'logout',
    'nice', 'nohup', 'notify',
    'onintr',
    'popd', 'printenv', 'pushd', 'pwd',
    'read', 'readonly', 'rehash', 'repeat', 'return',
    'sched', 'set', 'setenv', 'settc', 'setty', 'setvar', 'shift',
    'source', 'stop', 'suspend', 'switch',
    'telltc', 'test', 'then', 'time', 'times', 'trap', 'true', 'type',
    'ulimit', 'umask', 'unalias', 'uncomplete', 'unhash', 'unlimit',
    'unset', 'unsetenv', 'until',
    'wait', 'where', 'which', 'while'
]

function traverseAST(node: any, nodeCB: Function) {
  if (node.commands) {
    for (let cmd of node.commands) traverseAST(cmd, nodeCB)
  } else if (node.type == 'LogicalExpression') {
    traverseAST(node.left, nodeCB)
    traverseAST(node.right, nodeCB)
  } else {
    nodeCB(node)
  }
}

async function parseBash(line: string) {
  if (!line) return null
  try {
    return await parse(line, { insertLOC: true })
  } catch (e: any) {
    if (e.message.startsWith('Unclosed ')) {
      let endQuote = e.message.charAt(e.message.length - 1)
      if (endQuote == '(') endQuote = 'x)'
      else endQuote = 'a' + endQuote
      try {
        return await parse(line + endQuote, { insertLOC: true })
      } catch (ee) {
        // Desperately trying to do partial parsing
        return parseBash(line.substring(0, line.length - 4))
      }
    }
    line = line.substring(0, line.length - 1)
    if (line.length == 0) return null
    return await parseBash(line)
  }
}

// #region ------------------------- Highlighting -------------------------

type ParserLoc = {
  start: {
    char: number
  }
  end: {
    char: number
  }
}

export type ParserHighlight = {
  type: string
  start: number
  end: number
}

function makeHL(type: string, loc: ParserLoc): ParserHighlight {
  return {
    type,
    start: loc.start.char,
    end: loc.end.char,
  }
}

function getCommandType(cmd: string): string {
  if (builtins.includes(cmd)) return NodeType.builtin
  return NodeType.program
}

function getSuffixType(s: any, line: string) {
  if (s.type == 'Redirect') return NodeType.redirect
  if (s.text[0] == '$') return NodeType.environment
  if (s.text[0] == '-') return NodeType.option
  let ch = line[s.loc.start.char]
  if (ch == '"' || ch == "'") return NodeType.quote
  return NodeType.parameter
}

function highlightNode(node: any, hls: ParserHighlight[], line: string) {
  if (node.type != 'Command') return
  if (node.prefix) for (let p of node.prefix) hls.push(makeHL(NodeType.assignment, p.loc))
  if (node.name) hls.push(makeHL(getCommandType(node.name.text), node.name.loc))
  if (node.suffix)
    for (let s of node.suffix) hls.push(makeHL(getSuffixType(s, line), s.loc))
}

function highlightComment(line: string, ast: any, hls: ParserHighlight[]) {
  let extra = line.substring(ast.loc.end.char + 1)
  if (extra.trim().startsWith('#')) {
    let pos = ast.loc.end.char + 1
    hls.push({
      type: NodeType.comment,
      start: line.indexOf('#', pos),
      end: line.length - 1,
    })
  }
}

function highlightSyntaxError(line: string, ast: any, hls: ParserHighlight[]) {
  let extra = line.substring(ast.loc.end.char + 1)
  if (!extra.trim()) return
  hls.push({ type: NodeType.unknown, start: ast.loc.end.char + 1, end: line.length - 1 })
}

export async function highlight(line: string) {
  let ast = await parseBash(line)
  let hls: ParserHighlight[] = []
  if (!ast) return hls
  traverseAST(ast, (n: any) => {
    highlightNode(n, hls, line)
  })
  highlightComment(line, ast, hls)
  highlightSyntaxError(line, ast, hls)
  return hls
}

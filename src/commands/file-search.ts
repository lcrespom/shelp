export type DirInfo = {
  permissions: string
  links: string
  user: string
  group: string
  size: string
  date: string
  time: string
  name: string
}

type DirInfoTable = Record<string, DirInfo>

let lines: string[]
let dirs: DirInfoTable
let selectFilter = ''

function lineToDirInfo(line: string): DirInfo {
  let [permissions, links, user, group, size, month, day, time, year, ...rest] = line
    .split(' ')
    .filter(w => !!w)
  let date = `${month} ${day.padStart(2)} ${year}`
  let name = rest.join(' ')
  if (permissions && permissions.endsWith('@')) permissions = permissions.slice(0, -1)
  if (size) size = size.substring(0, size.length - 1) + ' ' + size[size.length - 1]
  return { permissions, links, user, group, size, date, time, name }
}

export function setDirContents(buffer: string, filter: string) {
  // Prepare a list of DirInfo entries
  let dirList = buffer
    .split('\n')
    .filter(l => !!l) // Remove empty lines, if any
    .filter((_l, i) => i >= 2) // Skip first two lines ("total" and ".")
    .map(lineToDirInfo)
  // Convert it into an object indexed by file name
  dirs = dirList.reduce((dirs: DirInfoTable, dinfo: DirInfo) => {
    dirs[dinfo.name] = dinfo
    return dirs
  }, {})
  // Create a list of file names, to be used by the SelectList widget
  lines = dirList.map(dinfo => dinfo.name)
  selectFilter = filter
  console.log({ dirs, selectFilter })
}

export function getDirInfo(line: string) {
  return dirs[line]
}

export function getDirLines() {
  return lines
}

type DirInfo = {
  permissions: string
  links: string
  user: string
  group: string
  size: string
  date: string
  name: string
}

let dirs: DirInfo[] = []
let selectFilter = ''

function lineToDirInfo(line: string): DirInfo {
  //drwxr-xr-x@  22 luis  staff   704B Oct 23 06:26:15 2024 .
  let [permissions, links, user, group, size, month, day, time, year, name] = line
    .split(' ')
    .filter(w => !!w)
  let date = `${month} ${day.padStart(2)} ${year} - ${time}`
  if (size) size = size.substring(0, size.length - 1) + ' ' + size[size.length - 1]
  return { permissions, links, user, group, size, date, name }
}

export function setDirContents(buffer: string, filter: string) {
  dirs = buffer
    .split('\n')
    .filter(l => !!l) // Remove empty lines, if any
    .filter((_l, i) => i >= 2) // Skip first two lines ("total" and ".")
    .map(lineToDirInfo)
  selectFilter = filter
  console.log({ dirs, selectFilter })
}

export function getDirInfo() {
  return dirs
}

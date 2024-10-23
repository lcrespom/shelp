type DirInfo = {
  all: string
}

let dirs: DirInfo[] = []
let selectFilter = ''

export function setDirContents(buffer: string, filter: string) {
  dirs = buffer
    .split('\n')
    .filter(l => !!l) // Remove empty lines, if any
    .filter(l => !l.startsWith('total '))
    .map(l => ({ all: l }))
  selectFilter = filter
  console.log({ dirs, selectFilter })
}

export function getDirLines() {
  return dirs.map(d => d.all)
}

export function getTypeFromID(id: string) {
  if (id.length === 0) throw new Error('The id was empty string');
  switch (id[0]) {
    case 'n':
      return 'node';
    case 'w':
      return 'way';
    case 'r':
      return 'relation';
    default:
      throw new Error('no type match invalid id ');
  }
}

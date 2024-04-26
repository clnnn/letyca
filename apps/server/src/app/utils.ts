export function extractSQLQuery(inputString: string): string | null {
  const sqlRegex = /SELECT\s+.*?;\s*/gis; // Regular expression to match SQL SELECT statements
  const sqlMatch = inputString.match(sqlRegex);
  if (sqlMatch) {
    return sqlMatch.join(' ');
  } else {
    return inputString; // it is what it is :D
  }
}

export function extractColumnNames(inputString: string): string[] {
  const aliasRegex = /AS\s+(\w+)/gi; // Regular expression to match aliases after AS keyword, case-insensitive
  const matches = inputString.match(aliasRegex);
  const aliases = matches
    ? matches.map((match) => match.split('AS')[1].trim())
    : [];
  return aliases;
}

import { Injectable } from '@nestjs/common';

export type AggregationSQLQuery = {
  dimension?: string;
  aggregatedValue: string;
  rawSQL: string;
};

@Injectable()
export class QueryParsingService {
  parse(rawSQL: string): AggregationSQLQuery {
    const normalizedSQL = rawSQL
      .trim()
      .toLocaleLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/;$/, '');

    // Define a regex to extract the select clause
    const selectRegex = /SELECT\s+(.+?)\s+FROM/i;
    const match = selectRegex.exec(normalizedSQL);

    if (!match) {
      return null;
    }

    const selectClause = match[1];

    // Regex to capture the GROUP BY clause
    const groupByRegex = /GROUP\s+BY\s+(.*?)(\s+ORDER\s+BY|\s*$)/i;
    const groupByMatch = normalizedSQL.match(groupByRegex);

    // Check if the query has a GROUP BY clause
    if (groupByMatch) {
      const groupByClause = groupByMatch[1].trim();
      const groupByColumn = groupByClause.split(' ')[0];

      // Find the column alias or the group by column name
      //   const dimensionMatch = new RegExp(
      //     `\\b(${groupByColumn})\\s+AS\\s+(\\w+)`,
      //     'i',
      const dimensionMatch = new RegExp(
        `\\b(${groupByColumn}::\\w+|${groupByColumn})\\s+as\\s+(\\w+)`,
        'i',
      ).exec(selectClause);
      const dimension = dimensionMatch
        ? dimensionMatch[2]
        : groupByColumn.split('.').pop();

      // Find the aggregated value
      // Split the select clause by comma to get individual columns
      const columns = selectClause.split(',').map((col) => col.trim());
      for (const column of columns) {
        // Check if column contains an aggregate function like COUNT, SUM, etc.
        const aggregationMatch = /COUNT|SUM|AVG|MIN|MAX/i.exec(column);
        if (aggregationMatch) {
          // Extract alias or the function name itself if no alias
          const aliasMatch = /AS\s+(\w+)/i.exec(column);
          const aggregationFunctionName = aggregationMatch[0];
          const aggregatedValue = aliasMatch
            ? aliasMatch[1]
            : aggregationFunctionName;

          return { dimension, aggregatedValue, rawSQL };
        }
      }

      // error?
    } else {
      // No GROUP BY clause; find the aggregated value
      const columns = selectClause.split(',').map((col) => col.trim());
      for (const column of columns) {
        // Check if column contains an aggregate function like COUNT, SUM, etc.
        const aggregationMatch = /COUNT|SUM|AVG|MIN|MAX/i.exec(column);
        if (aggregationMatch) {
          // Extract alias or the function name itself if no alias
          const aliasMatch = /AS\s+(\w+)/i.exec(column);
          const aggregationFunctionName = aggregationMatch[0];
          const aggregatedValue = aliasMatch
            ? aliasMatch[1]
            : aggregationFunctionName;

          return {
            aggregatedValue,
            rawSQL,
          };
        }
      }
    }
  }
}

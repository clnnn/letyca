import { Injectable } from '@nestjs/common';
import { AggrFunc, Cast, Column, ColumnRef, Parser } from 'node-sql-parser';
import { isDeepStrictEqual } from 'util';

export type BasicAggregation = {
  type: 'basicAggregation';
  aggregationColumns: string[];
};

export type GroupingAggregation = {
  type: 'groupingAggregation';
  aggregationColumns: string[];
  dimensionColumns: string[];
};

export type ParseResult = {
  rawSQL: string;
} & (BasicAggregation | GroupingAggregation);

/**
 * TODO
 * - Derived queries: SELECT product_name, sales_price - cost_price AS profit FROM products;
 * - Nested queries: SELECT * FROM (SELECT * FROM products) AS subquery;
 * - With clause: WITH sales AS (SELECT * FROM products) SELECT * FROM sales;
 * - Window functions: SELECT product_name, SUM(unit_price) OVER (PARTITION BY category_id) FROM products;
 * - Non-aggregation functions: SELECT product_name, UPPER(price) FROM products;
 */
@Injectable()
export class QueryParsingService {
  private readonly parser = new Parser();

  parse(rawSQL: string): ParseResult | null {
    const parseResult = this.parser.astify(rawSQL, { database: 'Postgresql' });
    const ast = Array.isArray(parseResult) ? parseResult[0] : parseResult;

    if (ast.type !== 'select') {
      return null;
    }

    const columns = ast.columns as Column[];

    if (!ast.groupby) {
      return {
        ...this.basicAggregation(columns),
        rawSQL,
      };
    } else {
      return {
        ...this.groupingAggregation(columns, ast.groupby),
        rawSQL,
      };
    }
    xw;
  }

  private basicAggregation(columns: Column[]): BasicAggregation {
    const aggregationColumns = columns
      .filter((c) => c.type === 'expr' && c.expr.type === 'aggr_func')
      .map((c) => {
        const aggFunction = c.expr as AggrFunc;
        return c.as ? c.as.toString() : aggFunction.name;
      })
      .map((agg) => agg.toLowerCase());
    return {
      type: 'basicAggregation',
      aggregationColumns,
    };
  }

  private groupingAggregation(
    columns: Column[],
    groupBy: { columns: ColumnRef[] },
  ): GroupingAggregation {
    const aggregationColumns =
      this.basicAggregation(columns).aggregationColumns;

    const dimensionColumns: string[] = [];
    for (const column of columns) {
      if (column.expr.type === 'column_ref') {
        const columnRef = column.expr as ColumnRef;
        for (const groupByColumnRef of groupBy.columns) {
          if (isDeepStrictEqual(columnRef, groupByColumnRef)) {
            if (column.as) {
              dimensionColumns.push(column.as.toString().toLowerCase());
            } else if (typeof columnRef.column === 'string') {
              dimensionColumns.push(columnRef.column.toLowerCase());
            } else {
              dimensionColumns.push(
                columnRef.column.expr.value.toString().toLowerCase(),
              );
            }
          }
        }
      }

      if (column.expr.type === 'cast') {
        const columnRef = (column.expr as Cast).expr as ColumnRef;
        for (const groupByColumnRef of groupBy.columns) {
          if (isDeepStrictEqual(columnRef, groupByColumnRef)) {
            if (column.as) {
              dimensionColumns.push(column.as.toString().toLowerCase());
            } else if (typeof columnRef.column === 'string') {
              dimensionColumns.push(columnRef.column.toLowerCase());
            } else {
              dimensionColumns.push(
                columnRef.column.expr.value.toString().toLowerCase(),
              );
            }
          }
        }
      }
    }

    return {
      type: 'groupingAggregation',
      aggregationColumns,
      dimensionColumns,
    };
  }
}

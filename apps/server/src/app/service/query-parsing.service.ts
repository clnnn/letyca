import { Injectable } from '@nestjs/common';
// import {
//   AggrFunc,
//   Cast,
//   Column,
//   ColumnRef,
//   Function,
//   Parser,
// } from 'node-sql-parser';
import { isDeepStrictEqual } from 'util';
import { parse } from 'pgsql-parser';
import { Node, RawStmt, ResTarget } from '@pgsql/types';

export type BasicAggregation = {
  type: 'basicAggregation';
  aggregationColumns: string[];
};

export type GroupingAggregation = {
  type: 'groupingAggregation';
  aggregationColumns: string[];
  dimensionColumns: string[];
};

export type SQLQuery = {
  rawSQL: string;
} & (BasicAggregation | GroupingAggregation);

export type ParseError = {
  message: string;
};

/**
 * TODO
 * - With clause: WITH sales AS (SELECT * FROM products) SELECT * FROM sales;
 * - Grouping using functions (no alias): SELECT date_trunc('month', o.order_date), SUM(od.quantity * p.unit_price) AS total_sales FROM orders o GROUP BY date_trunc('month', o.order_date);
 * - Non-aggregation functions: SELECT product_name, UPPER(price) FROM products;
 * - Derived queries: SELECT product_name, sales_price - cost_price AS profit FROM products;
 */
@Injectable()
export class QueryParsingService {
  // private readonly parser = new Parser();

  parse(rawSQL: string): SQLQuery | ParseError {
    const stmts = parse(rawSQL);

    if (stmts.length < 1) {
      return {
        message: 'No statement found',
      };
    }

    const rawStmt: RawStmt | undefined = stmts[0]?.RawStmt;

    if (!rawStmt?.stmt) {
      return {
        message: 'No statement found',
      };
    }

    if (!('SelectStmt' in rawStmt.stmt)) {
      return {
        message: 'Only SELECT statements are supported',
      };
    }

    const selectStmt = rawStmt.stmt.SelectStmt;
    if (!selectStmt.groupClause) {
      return {
        ...this.basicAggregation(selectStmt.targetList ?? []),
        rawSQL,
      };
    } else {
      return {
        ...this.groupingAggregation(
          selectStmt.targetList ?? [],
          selectStmt.groupClause ?? [],
        ),
        rawSQL,
      };
    }
  }

  private basicAggregation(targetList: Node[]): BasicAggregation {
    const aggregationColumns = targetList
      .filter((t): t is { ResTarget: ResTarget } => 'ResTarget' in t)
      .map((t) => t.ResTarget)
      .map((t) => {
        if (t.val && 'FuncCall' in t.val) {
          const alias = t.name;
          const funcName = t.val.FuncCall.funcname?.[0];
          const funcNameString =
            funcName &&
            'String' in funcName &&
            'str' in funcName.String &&
            typeof funcName.String.str === 'string'
              ? funcName.String.str
              : null;

          if (
            funcNameString &&
            ['sum', 'avg', 'count', 'max', 'min'].indexOf(funcNameString) !== -1
          ) {
            return alias ?? funcNameString;
          }
        }
        return null;
      })
      .filter((agg): agg is string => agg !== null)
      .map((agg) => agg.toLowerCase());

    return {
      type: 'basicAggregation',
      aggregationColumns,
    };
  }

  private groupingAggregation(
    targetList: Node[],
    groupClause: Node[],
  ): GroupingAggregation {
    const aggregationColumns =
      this.basicAggregation(targetList).aggregationColumns;

    const dimensionColumns: string[] = [];
    for (const groupNode of groupClause) {
      if ('ColumnRef' in groupNode) {
        const groupColumnRef = groupNode.ColumnRef;
        for (const selectNode of targetList) {
          if (
            'ResTarget' in selectNode &&
            selectNode.ResTarget.val &&
            'ColumnRef' in selectNode.ResTarget.val
          ) {
            const selectColumnRef = selectNode.ResTarget.val.ColumnRef;
            if (
              isDeepStrictEqual(groupColumnRef.fields, selectColumnRef.fields)
            ) {
              if (selectNode.ResTarget.name) {
                dimensionColumns.push(selectNode.ResTarget.name);
              } else {
                const field = selectColumnRef.fields?.[0];
                if (
                  field &&
                  'String' in field &&
                  'str' in field.String &&
                  typeof field.String.str === 'string'
                ) {
                  dimensionColumns.push(field.String.str);
                }
              }
            }
          }

          if (
            'ResTarget' in selectNode &&
            selectNode.ResTarget.val &&
            'FuncCall' in selectNode.ResTarget.val
          ) {
            const selectFuncCall = groupColumnRef.fields?.[0];
            if (
              selectFuncCall &&
              'String' in selectFuncCall &&
              'str' in selectFuncCall.String &&
              typeof selectFuncCall.String.str === 'string' &&
              selectNode.ResTarget.name === selectFuncCall.String.str
            ) {
              dimensionColumns.push(selectFuncCall.String.str);
            }
          }

          if (
            'ResTarget' in selectNode &&
            selectNode.ResTarget.val &&
            'TypeCast' in selectNode.ResTarget.val &&
            selectNode.ResTarget.val.TypeCast.arg &&
            'ColumnRef' in selectNode.ResTarget.val.TypeCast.arg
          ) {
            const selectColumnRef =
              selectNode.ResTarget.val.TypeCast.arg.ColumnRef;

            if (
              isDeepStrictEqual(groupColumnRef.fields, selectColumnRef.fields)
            ) {
              if (selectNode.ResTarget.name) {
                dimensionColumns.push(selectNode.ResTarget.name);
              }
            }
          }
        }
      }

      if ('FuncCall' in groupNode) {
        const groupFuncCall = groupNode.FuncCall;
        for (const selectNode of targetList) {
          if (
            'ResTarget' in selectNode &&
            selectNode.ResTarget.val &&
            'FuncCall' in selectNode.ResTarget.val
          ) {
            const selectFuncCall = selectNode.ResTarget.val.FuncCall;
            if (
              isDeepStrictEqual(groupFuncCall.funcname, selectFuncCall.funcname)
            ) {
              if (selectNode.ResTarget.name) {
                dimensionColumns.push(selectNode.ResTarget.name);
              } else {
                const funcName = selectFuncCall.funcname?.[0];
                if (
                  funcName &&
                  'String' in funcName &&
                  'str' in funcName.String &&
                  typeof funcName.String.str === 'string'
                ) {
                  dimensionColumns.push(funcName.String.str);
                }
              }
            }
          }
        }
      }

      continue;
    }

    return {
      type: 'groupingAggregation',
      aggregationColumns,
      dimensionColumns,
    };
  }
}

// private groupingAggregation(
//   columns: Column[],
//   groupBy: { columns: ColumnRef[] },
// ): GroupingAggregation {
//   const aggregationColumns =
//     this.basicAggregation(columns).aggregationColumns;

//   const dimensionColumns: string[] = [];
//   for (const column of columns) {
//     if (column.expr.type === 'column_ref') {
//       const columnRef = column.expr as ColumnRef;
//       for (const groupByColumnRef of groupBy.columns) {
//         if (isDeepStrictEqual(columnRef, groupByColumnRef)) {
//           if (column.as) {
//             dimensionColumns.push(column.as.toString().toLowerCase());
//           } else if (typeof columnRef.column === 'string') {
//             dimensionColumns.push(columnRef.column.toLowerCase());
//           } else {
//             dimensionColumns.push(
//               columnRef.column.expr.value.toString().toLowerCase(),
//             );
//           }
//         }
//       }
//     }

//     if (column.expr.type === 'cast') {
//       const cast = column.expr as Cast;
//       const columnRef = cast.expr as ColumnRef;
//       for (const groupByColumnRef of groupBy.columns) {
//         if (isDeepStrictEqual(columnRef, groupByColumnRef)) {
//           if (cast['as']) {
//             dimensionColumns.push(cast['as'].toString().toLowerCase());
//           } else if (typeof columnRef.column === 'string') {
//             dimensionColumns.push(columnRef.column.toLowerCase());
//           } else {
//             dimensionColumns.push(
//               columnRef.column.expr.value.toString().toLowerCase(),
//             );
//           }
//         }
//       }
//     }

//     if (column.expr.type === 'function') {
//       // not implemented
//     }
//   }

//   return {
//     type: 'groupingAggregation',
//     aggregationColumns,
//     dimensionColumns,
//   };
// }

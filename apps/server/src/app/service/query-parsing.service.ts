import { Injectable, Logger } from '@nestjs/common';
import { isDeepStrictEqual } from 'util';
import { parse } from 'pgsql-parser';
import { Node, RawStmt, ResTarget } from '@pgsql/types';
import { b } from 'baml_client';
import {
  BasicAggregation,
  GroupingAggregation,
  SQLQuery,
} from '@letyca/contracts';

export type InvalidQuery = {
  type: 'invalidQuery';
  errorMessage: string;
};

@Injectable()
export class QueryParsingService {
  async parse(rawSQL: string): Promise<SQLQuery | InvalidQuery> {
    const stmts = parse(rawSQL);

    if (stmts.length < 1) {
      return {
        type: 'invalidQuery',
        errorMessage: 'The provided SQL statement is empty',
      };
    }

    const rawStmt: RawStmt | undefined = stmts[0]?.RawStmt;

    if (!rawStmt?.stmt) {
      return {
        type: 'invalidQuery',
        errorMessage: 'The provided SQL statement is invalid',
      };
    }

    if (!('SelectStmt' in rawStmt.stmt)) {
      return {
        type: 'invalidQuery',
        errorMessage: 'Only SELECT statements are supported',
      };
    }

    const selectStmt = rawStmt.stmt.SelectStmt;
    if (!selectStmt.groupClause) {
      const targetList = selectStmt.targetList ?? [];
      for (const target of targetList) {
        if ('ResTarget' in target && target.ResTarget.val) {
          if ('FuncCall' in target.ResTarget.val) {
            return {
              ...this.basicAggregation(targetList),
              rawSQL,
            };
          }
        }
      }

      const axis = await b.ExtractChartAxis(rawSQL);
      Logger.log(axis);
      return {
        type: 'nonAggregation',
        dimensionColumns: [axis.xAxisKey],
        aggregationColumns: [axis.yAxisKey],
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
                const field =
                  selectColumnRef.fields?.[1] ?? selectColumnRef.fields?.[0];
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
            const selectFuncCall =
              groupColumnRef.fields?.[1] ?? groupColumnRef.fields?.[0];
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

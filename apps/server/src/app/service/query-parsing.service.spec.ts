import { QueryParsingService } from './query-parsing.service';

describe('QueryParsingService', () => {
  let service: QueryParsingService;
  const aggregationFunctions = ['avg', 'count', 'max', 'min', 'sum'];

  beforeEach(() => {
    service = new QueryParsingService();
  });

  describe('Basic aggregation with single aggregation function (no alias)', () => {
    test.each(aggregationFunctions)(
      'should return aggregation function name %p',
      (aggFunc) => {
        // given
        const rawSQL = `SELECT ${aggFunc}(unit_price) FROM products`;

        // when
        const result = service.parse(rawSQL);

        // then
        expect(result).toEqual({
          type: 'basicAggregation',
          rawSQL,
          aggregationColumns: [aggFunc],
        });
      },
    );
  });

  describe('Basic aggregation with single aggregation function (with alias)', () => {
    test.each(aggregationFunctions)(
      'should return aggregation function alias for %p',
      (aggFunc) => {
        // given
        const rawSQL = `SELECT ${aggFunc}(unit_price) as price FROM products`;

        // when
        const result = service.parse(rawSQL);

        // then
        expect(result).toEqual({
          type: 'basicAggregation',
          rawSQL,
          aggregationColumns: ['price'],
        });
      },
    );
  });

  describe('Basic aggregation with multiple aggregation functions (no alias)', () => {
    it('should return multiple aggregation function names', () => {
      // given
      const rawSQL = `SELECT avg(unit_price), count(product_id) FROM products`;

      // when
      const result = service.parse(rawSQL);

      // then
      expect(result).toEqual({
        type: 'basicAggregation',
        rawSQL,
        aggregationColumns: ['avg', 'count'],
      });
    });
  });

  describe('Basic aggregation with multiple aggregation functions (with alias)', () => {
    it('should return multiple aggregation function aliases', () => {
      // given
      const rawSQL = `SELECT avg(unit_price) as avg_price, count(product_id) as total_products FROM products`;

      // when
      const result = service.parse(rawSQL);

      // then
      expect(result).toEqual({
        type: 'basicAggregation',
        rawSQL,
        aggregationColumns: ['avg_price', 'total_products'],
      });
    });
  });

  describe('Grouping aggregation with single aggregation function (no alias)', () => {
    test.each(aggregationFunctions)(
      'should return aggregation function name %p and dimension column',
      (aggFunc) => {
        // given
        const rawSQL = `SELECT category_id, ${aggFunc}(unit_price) FROM products GROUP BY category_id`;

        // when
        const result = service.parse(rawSQL);

        // then
        expect(result).toEqual({
          type: 'groupingAggregation',
          rawSQL,
          aggregationColumns: [aggFunc],
          dimensionColumns: ['category_id'],
        });
      },
    );
  });

  describe('Grouping aggregation with single aggregation function (with alias)', () => {
    test.each(aggregationFunctions)(
      'should return aggregation function alias for %p and dimension column alias',
      (aggFunc) => {
        // given
        const rawSQL = `SELECT category_id as category, ${aggFunc}(unit_price) as price FROM products GROUP BY category_id`;

        // when
        const result = service.parse(rawSQL);

        // then
        expect(result).toEqual({
          type: 'groupingAggregation',
          rawSQL,
          aggregationColumns: ['price'],
          dimensionColumns: ['category'],
        });
      },
    );
  });

  describe('Grouping aggregation with multiple aggregation functions (no alias)', () => {
    it('should return multiple aggregation function names and dimension column', () => {
      // given
      const rawSQL = `SELECT category_id, avg(unit_price), count(product_id) FROM products GROUP BY category_id`;

      // when
      const result = service.parse(rawSQL);

      // then
      expect(result).toEqual({
        type: 'groupingAggregation',
        rawSQL,
        aggregationColumns: ['avg', 'count'],
        dimensionColumns: ['category_id'],
      });
    });
  });

  describe('Grouping aggregation with multiple aggregation functions (with alias)', () => {
    it('should return multiple aggregation function aliases and dimension column alias', () => {
      // given
      const rawSQL = `SELECT category_id as category, avg(unit_price) as avg_price, count(product_id) as total_products FROM products GROUP BY category_id`;

      // when
      const result = service.parse(rawSQL);

      // then
      expect(result).toEqual({
        type: 'groupingAggregation',
        rawSQL,
        aggregationColumns: ['avg_price', 'total_products'],
        dimensionColumns: ['category'],
      });
    });
  });

  describe('Grouping aggregation with multiple dimension columns (no alias)', () => {
    it('should return multiple dimension columns and aggregation function name', () => {
      // given
      const rawSQL = `SELECT category_id, supplier_id, avg(unit_price) FROM products GROUP BY category_id, supplier_id`;

      // when
      const result = service.parse(rawSQL);

      // then
      expect(result).toEqual({
        type: 'groupingAggregation',
        rawSQL,
        aggregationColumns: ['avg'],
        dimensionColumns: ['category_id', 'supplier_id'],
      });
    });
  });

  describe('Grouping aggregation with multiple dimension columns (with alias)', () => {
    it('should return multiple dimension column aliases and aggregation function alias', () => {
      // given
      const rawSQL = `SELECT category_id as category, supplier_id as supplier, avg(unit_price) as avg_price FROM products GROUP BY category_id, supplier_id`;

      // when
      const result = service.parse(rawSQL);

      // then
      expect(result).toEqual({
        type: 'groupingAggregation',
        rawSQL,
        aggregationColumns: ['avg_price'],
        dimensionColumns: ['category', 'supplier'],
      });
    });
  });

  describe('Grouping aggregation with multiple dimension columns and multiple aggregation functions (no alias)', () => {
    it('should return multiple dimension columns and multiple aggregation function names', () => {
      // given
      const rawSQL = `SELECT category_id, supplier_id, avg(unit_price), count(product_id) FROM products GROUP BY category_id, supplier_id`;

      // when
      const result = service.parse(rawSQL);

      // then
      expect(result).toEqual({
        type: 'groupingAggregation',
        rawSQL,
        aggregationColumns: ['avg', 'count'],
        dimensionColumns: ['category_id', 'supplier_id'],
      });
    });
  });

  describe('Grouping aggregation with multiple dimension columns and multiple aggregation functions (with alias)', () => {
    it('should return multiple dimension column aliases and multiple aggregation function aliases', () => {
      // given
      const rawSQL = `SELECT category_id as category, supplier_id as supplier, avg(unit_price) as avg_price, count(product_id) as total_products FROM products GROUP BY category_id, supplier_id`;

      // when
      const result = service.parse(rawSQL);

      // then
      expect(result).toEqual({
        type: 'groupingAggregation',
        rawSQL,
        aggregationColumns: ['avg_price', 'total_products'],
        dimensionColumns: ['category', 'supplier'],
      });
    });
  });

  describe('Grouping aggregation with casting', () => {
    it('should return dimension column and aggregation function name', () => {
      // given
      const rawSQL = `SELECT category_id::text as category, avg(unit_price) FROM products GROUP BY category_id`;

      // when
      const result = service.parse(rawSQL);

      // then
      expect(result).toEqual({
        type: 'groupingAggregation',
        rawSQL,
        aggregationColumns: ['avg'],
        dimensionColumns: ['category'],
      });
    });
  });
});

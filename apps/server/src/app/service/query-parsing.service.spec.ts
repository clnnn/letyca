import { QueryParsingService } from './query-parsing.service';

describe('QueryParsingService', () => {
  let service: QueryParsingService;

  beforeEach(() => {
    service = new QueryParsingService();
  });

  describe('SELECT AVG(unit_price) from products', () => {
    it('should return aggregation function name and the raw sql', () => {
      // given
      const rawSQL = 'SELECT AVG(unit_price) from products';

      // when
      const result = service.parse(rawSQL);

      // then
      expect(result).toEqual({
        aggregatedValue: 'avg',
        rawSQL,
      });
    });
  });

  describe('SELECT COUNT(*) as total_products FROM products', () => {
    it('should return aggregation function alias and the raw sql', () => {
      // given
      const rawSQL = 'SELECT COUNT(*) as total_products FROM products';

      // when
      const result = service.parse(rawSQL);

      // then
      expect(result).toEqual({
        aggregatedValue: 'total_products',
        rawSQL,
      });
    });
  });

  describe('SELECT p.category_id AS category, COUNT(p.product_id) FROM public.products p GROUP BY p.category_id ORDER BY p.category_id NULLS LAST', () => {
    it('should return dimension alias, aggregation function name and the raw sql', () => {
      // given
      const rawSQL =
        'SELECT p.category_id AS category, COUNT(p.product_id) FROM public.products p GROUP BY p.category_id ORDER BY p.category_id NULLS LAST';

      // when
      const result = service.parse(rawSQL);

      // then
      expect(result).toEqual({
        aggregatedValue: 'count',
        dimension: 'category',
        rawSQL,
      });
    });
  });

  describe('SELECT p.category_id AS category, COUNT(p.product_id) AS total_products FROM public.products p GROUP BY p.category_id ORDER BY p.category_id NULLS LAST', () => {
    it('should return dimension alias, aggregation function alias and the raw sql', () => {
      // given
      const rawSQL =
        'SELECT p.category_id AS category, COUNT(p.product_id) AS total_products FROM public.products p GROUP BY p.category_id ORDER BY p.category_id NULLS LAST';

      // when
      const result = service.parse(rawSQL);

      // then
      expect(result).toEqual({
        aggregatedValue: 'total_products',
        dimension: 'category',
        rawSQL,
      });
    });
  });

  describe('SELECT p.category_id, COUNT(p.product_id) AS total_products FROM public.products p GROUP BY p.category_id;', () => {
    it('should return dimension column, aggregation function alias and raw sql', () => {
      // given
      const rawSQL =
        'SELECT p.category_id, COUNT(p.product_id) AS total_products FROM public.products p GROUP BY p.category_id;';

      // when
      const result = service.parse(rawSQL);

      // then
      expect(result).toEqual({
        aggregatedValue: 'total_products',
        dimension: 'category_id',
        rawSQL,
      });
    });
  });

  describe('SELECT p.category_id::text AS category, COUNT(p.product_id) AS total_products FROM public.products p GROUP BY p.category_id;', () => {
    it('should return dimension alias, aggregation function alias and raw sql', () => {
      // given
      const rawSQL =
        'SELECT p.category_id::text AS category, COUNT(p.product_id) AS total_products FROM public.products p GROUP BY p.category_id;';

      // when
      const result = service.parse(rawSQL);

      // then
      expect(result).toEqual({
        aggregatedValue: 'total_products',
        dimension: 'category',
        rawSQL,
      });
    });
  });

  describe('SELECT category_id, COUNT(product_id) FROM public.products GROUP BY category_id ORDER BY category_id NULLS LAST', () => {
    it('should return dimension column, aggregation function name and raw sql', () => {
      // given
      const rawSQL =
        'SELECT category_id, COUNT(product_id) FROM public.products GROUP BY category_id ORDER BY category_id NULLS LAST';

      // when
      const result = service.parse(rawSQL);

      // then
      expect(result).toEqual({
        aggregatedValue: 'count',
        dimension: 'category_id',
        rawSQL,
      });
    });
  });

  describe('SELECT category_id::text, COUNT(product_id) FROM products GROUP BY category_id ORDER BY category_id NULLS LAST', () => {
    it('should return dimension column, aggregation function name and raw sql', () => {
      // given
      const rawSQL =
        'SELECT category_id::text, COUNT(product_id) FROM public.products GROUP BY category_id ORDER BY category_id NULLS LAST';

      // when
      const result = service.parse(rawSQL);

      // then
      expect(result).toEqual({
        aggregatedValue: 'count',
        dimension: 'category_id',
        rawSQL,
      });
    });
  });

  describe('SELECT category_id, COUNT(product_id) AS total_products FROM public.products GROUP BY category_id ORDER BY category_id NULLS LAST', () => {
    it('should return dimension column, aggregation function alias and the raw sql', () => {
      // given
      const rawSQL =
        'SELECT category_id, COUNT(product_id) AS total_products FROM public.products GROUP BY category_id ORDER BY category_id NULLS LAST';

      // when
      const result = service.parse(rawSQL);

      // then
      expect(result).toEqual({
        aggregatedValue: 'total_products',
        dimension: 'category_id',
        rawSQL,
      });
    });
  });
});

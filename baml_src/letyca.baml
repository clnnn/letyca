
enum ChartType {
  CountLabel @alias("countLabel")
  Pie @alias("pie")
  Bar @alias("bar")
  Line @alias("line")
}

class ChartMetadata {
  chartType ChartType
  title string @description("The title of the chart. Must start with uppercase")
}

function ExtractChartMetadata(userRequest: string) -> ChartMetadata {
  client ChartMetadataOllamaClient
  prompt #"
    {{ userRequest }}

    ```json
    {{ ctx.output_format }}
    ```
  "#
}

test totalNumberOfOrdersByShipCountryInPieChart {
  functions [ExtractChartMetadata]
  args {
    userRequest #"
      total number of orders by ship country in Pie Chart
    "#
  }
}

function GenerateSQL(userRequest: string, ddlStatements: string) -> string {
  client TextToSQLOllamaClient
  prompt #"
    <|begin_of_text|><|start_header_id|>user<|end_header_id|>
    Generate a SQL query to answer this question: `{{ userRequest }}`.
    - If you cannot answer the question with the available database schema, return 'I do not know'
    - Remember that revenue is price multiplied by quantity
    - Remember that cost is supply_price multiplied by quantity
    - In case of aggregation by group, the aggregate function has always the alias 'value'
    - In case of aggregation by group, the group by column has always the alias 'label'
    - In case of simple aggregation like COUNT, the aggregate function has always the alias 'value'

    DDL statements:
    {{ ddlStatements }}
    <|eot_id|><|start_header_id|>assistant<|end_header_id|>

    The following SQL query best answers the question `{{ userRequest }}`:
    ```sql
  "#
}

test totalNumberOfSalespeopleRegionInPieChart {
  functions [GenerateSQL]
  args {
    userRequest "total number of salespeople region in Pie Chart"
    ddlStatements #"
      CREATE TABLE products (
      product_id INTEGER PRIMARY KEY, -- Unique ID for each product
      name VARCHAR(50), -- Name of the product
      price DECIMAL(10,2), -- Price of each unit of the product
      quantity INTEGER  -- Current quantity in stock
    );

    CREATE TABLE customers (
      customer_id INTEGER PRIMARY KEY, -- Unique ID for each customer
      name VARCHAR(50), -- Name of the customer
      address VARCHAR(100) -- Mailing address of the customer
    );

    CREATE TABLE salespeople (
      salesperson_id INTEGER PRIMARY KEY, -- Unique ID for each salesperson
      name VARCHAR(50), -- Name of the salesperson
      region VARCHAR(50) -- Geographic sales region
    );

    CREATE TABLE sales (
      sale_id INTEGER PRIMARY KEY, -- Unique ID for each sale
      product_id INTEGER, -- ID of product sold
      customer_id INTEGER,  -- ID of customer who made purchase
      salesperson_id INTEGER, -- ID of salesperson who made the sale
      sale_date DATE, -- Date the sale occurred
      quantity INTEGER -- Quantity of product sold
    );

    CREATE TABLE product_suppliers (
      supplier_id INTEGER PRIMARY KEY, -- Unique ID for each supplier
      product_id INTEGER, -- Product ID supplied
      supply_price DECIMAL(10,2) -- Unit price charged by supplier
    );

    -- sales.product_id can be joined with products.product_id
    -- sales.customer_id can be joined with customers.customer_id
    -- sales.salesperson_id can be joined with salespeople.salesperson_id
    -- product_suppliers.product_id can be joined with products.product_id  
    "#
  }
}
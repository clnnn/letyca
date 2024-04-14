import { Injectable } from '@nestjs/common';
import { SqlDatabase } from 'langchain/sql_db';
import { Connection } from 'prisma/prisma-client';
import { Ollama } from 'ollama';

@Injectable()
export class QueryService {
  async generate(userRequest: string, connection: Connection): Promise<string> {
    const database = await this.getDatabase(connection);
    const schema = await database.getTableInfo();
    const sqlQuery = await this.createChatCompletion(userRequest, schema);
    console.log(sqlQuery);
    return sqlQuery;
  }

  private getDatabase(connection: Connection): Promise<SqlDatabase> {
    return SqlDatabase.fromOptionsParams({
      appDataSourceOptions: {
        type: 'postgres',
        database: connection.database,
        username: connection.username,
        password: connection.password,
        host: connection.host,
        port: connection.port,
      },
    });
  }

  private async createChatCompletion(
    userRequest: string,
    schema: string
  ): Promise<string> {
    const ollama = new Ollama({ host: 'http://host.docker.internal:11434' });
    await ollama
      .pull({
        model: 'sqlcoder',
      })
      .then((res) => console.log(res));

    const chatResponse = await ollama.generate({
      model: 'sqlcoder',
      stream: false,
      prompt: `
      ### Task
      Generate a PostgreSQL query to answer [QUESTION]${userRequest}[/QUESTION]
      
      ### Instructions
      - Use Table Aliases to prevent ambiguity. For example, "SELECT table1.col1, table2.col1 FROM table1 JOIN table2 ON table1.id = table2.id".
      - Always use 'value' and 'label' column aliases.
      - Generate only the SQL query, with the semicolon at the end. 

      ### Database Schema
      This query will run on a database whose schema is represented in this string:
      CREATE TABLE "public"."categories" (
        category_id smallint NOT NULL, category_name character varying NOT NULL, description text , picture bytea ) 
        CREATE TABLE "public"."customer_customer_demo" (
        customer_id character varying NOT NULL, customer_type_id character varying NOT NULL) 
        CREATE TABLE "public"."customer_demographics" (
        customer_type_id character varying NOT NULL, customer_desc text ) 
        CREATE TABLE "public"."customers" (
        customer_id character varying NOT NULL, company_name character varying NOT NULL, contact_name character varying , contact_title character varying , address character varying , city character varying , region character varying , postal_code character varying , country character varying , phone character varying , fax character varying ) 
        CREATE TABLE "public"."employee_territories" (
        employee_id smallint NOT NULL, territory_id character varying NOT NULL) 
        CREATE TABLE "public"."employees" (
        employee_id smallint NOT NULL, last_name character varying NOT NULL, first_name character varying NOT NULL, title character varying , title_of_courtesy character varying , birth_date date , hire_date date , address character varying , city character varying , region character varying , postal_code character varying , country character varying , home_phone character varying , extension character varying , photo bytea , notes text , reports_to smallint , photo_path character varying ) 
        CREATE TABLE "public"."order_details" (
        order_id smallint NOT NULL, product_id smallint NOT NULL, unit_price real NOT NULL, quantity smallint NOT NULL, discount real NOT NULL) 
        CREATE TABLE "public"."orders" (
        order_id smallint NOT NULL, customer_id character varying , employee_id smallint , order_date date , required_date date , shipped_date date , ship_via smallint , freight real , ship_name character varying , ship_address character varying , ship_city character varying , ship_region character varying , ship_postal_code character varying , ship_country character varying ) 
        CREATE TABLE "public"."products" (
        product_id smallint NOT NULL, product_name character varying NOT NULL, supplier_id smallint , category_id smallint , quantity_per_unit character varying , unit_price real , units_in_stock smallint , units_on_order smallint , reorder_level smallint , discontinued integer NOT NULL) 
        CREATE TABLE "public"."region" (
        region_id smallint NOT NULL, region_description character varying NOT NULL) 
        CREATE TABLE "public"."shippers" (
        shipper_id smallint NOT NULL, company_name character varying NOT NULL, phone character varying ) 
        CREATE TABLE "public"."suppliers" (
        supplier_id smallint NOT NULL, company_name character varying NOT NULL, contact_name character varying , contact_title character varying , address character varying , city character varying , region character varying , postal_code character varying , country character varying , phone character varying , fax character varying , homepage text ) 
        CREATE TABLE "public"."territories" (
        territory_id character varying NOT NULL, territory_description character varying NOT NULL, region_id smallint NOT NULL) 
        CREATE TABLE "public"."us_states" (
        state_id smallint NOT NULL, state_name character varying , state_abbr character varying , state_region character varying ) 

      ### Examples

      #### Example 1 - "total number of products":
      "SELECT COUNT(*) AS value, 'Total Number of Products' AS label FROM products p;"

      #### Example 2 - "total number of products by category":
      "SELECT c.category_name AS label, COUNT(p.product_id) AS value FROM products p JOIN categories c ON p.category_id = c.category_id GROUP BY c.category_name;"

      #### Example 3 - "total number of products by category, ordered by category name":
      "SELECT c.category_name AS label, COUNT(p.product_id) AS value FROM products p JOIN categories c ON p.category_id = c.category_id GROUP BY c.category_name ORDER BY c.category_name;"

      #### Example 4 - "Top 5 customers by revenue":
      "SELECT c.company_name AS label, SUM(od.unit_price * od.quantity) AS value FROM customers c JOIN orders o ON c.customer_id = o.customer_id JOIN order_details od ON o.order_id = od.order_id GROUP BY c.company_name ORDER BY value DESC LIMIT 5;"
      
      ### Answer
      Given the database schema, here is the SQL query that answers [QUESTION]${userRequest}[/QUESTION]
      [SQL]`,
    });

    console.log(chatResponse);
    return this.extractSQLQuery(chatResponse.response);
  }

  extractSQLQuery(inputString: string): string | null {
    const sqlRegex = /SELECT\s+.*?;\s*/gis; // Regular expression to match SQL SELECT statements
    const sqlMatch = inputString.match(sqlRegex);
    if (sqlMatch) {
      // Join multiple matches into a single string
      return sqlMatch.join(' ');
    } else {
      return null; // Return null if no SQL query found
    }
  }
}

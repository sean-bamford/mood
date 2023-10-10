/* eslint-disable no-unsafe-finally */
import login from "../Hooks/useEnvironmentVariables";
import * as db from "neo4j-driver";
let driver: db.Driver;
let result;

async function queryDatabase(query?: string) {
  if (!query) {
    query = "MATCH (n)-[r]-(m) return n,r,m";
  }
  try {
    driver = db.driver(login.uri, db.auth.basic(login.user, login.password));
    await driver.getServerInfo();
  } catch (err: unknown) {
    console.log(`Connection error:\n${err}`);
  } finally {
    try {
      result = await driver.executeQuery(query);
      driver.close();
      return result;
    } catch (err: unknown) {
      console.log(`Query error:\n${err}`);
      result = null;
      return result;
    }
  }
}
export default queryDatabase;

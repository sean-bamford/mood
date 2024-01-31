/* eslint-disable no-unsafe-finally */
import login from "../Hooks/useEnvironmentVariables";
import * as db from "neo4j-driver";
let driver: db.Driver;
let result;

async function queryDatabase(query?: string, parameters?: object) {
  if (!query) {
    query = "MATCH (n)-[r]-(m) return n,r,m";
  }
  try {
    driver = db.driver(login.uri, db.auth.basic(login.user, login.password));
    
    // await console.log(driver.getServerInfo(), driver.isEncrypted())
  } catch (err: unknown) {
    console.log(`Connection error:\n${err}`);
  } finally {
    try {
      if (parameters) {
        result = await driver.executeQuery(query, parameters);
        
      } else {
        result = await driver.executeQuery(query);
      }
      // driver.close();     
      return result;
    } catch (err: unknown) {
      console.log(`Query:\n${query}`,`Query error:\n${err}`);
      result = null;
      return result;
    }
  }
}
export default queryDatabase;
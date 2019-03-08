import { Pool, QueryResult } from "pg";

const dbSettings: any = {
  dev: {
    host: "localhost",
    user: "",
    password: "",
    database: "w8mngr-test",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  },
  test: {
    host: "localhost",
    user: "",
    password: "",
    database: "w8mngr-test",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  }
};

// Pools will use environment variables
// for connection information
const pool = new Pool(dbSettings[process.env.NODE_ENV]);

export interface DBResultType {
  error: string | false | Error;
  result?: QueryResult;
}

export interface DBQueryParameters {
  text: string;
  values?: Array<string | number | Array<string> | Array<number>>;
}

// Our general-purpose query handler
function query({
  text,
  values = []
}: DBQueryParameters): Promise<DBResultType> {
  return new Promise(resolve => {
    pool.connect((err, client, release) => {
      if (err) {
        console.error(err);
        return resolve({ error: err });
      }
      client.query(text, values, (err, result) => {
        release();
        resolve({ error: err || false, result });
      });
    });
  });
}

export { query };

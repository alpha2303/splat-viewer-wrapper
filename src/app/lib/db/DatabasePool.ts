import pg from "pg";
import { Sequelize } from "sequelize";

import { config } from "../config";

export interface DatabasePool {
  client: Sequelize;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

const createDatabasePool = (): DatabasePool => {
  try {
    const client = new Sequelize(config.DATABASE_CONN_STRING, {
      dialect: "postgres",
      dialectModule: pg,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });

    return {
      client,
      connect: async () => {
        await client.authenticate();
      },
      disconnect: async () => {
        await client.close();
      },
    };
  } catch (error) {
    console.error("Error creating database pool:", error);
    throw error;
  }
};

export const databasePool: DatabasePool = createDatabasePool();

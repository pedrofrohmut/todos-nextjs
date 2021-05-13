/* eslint-disable */
// EXECUTED AFTER ALL TESTS - Clean Up

import { truncateDatabase } from "./utils"

export default async () => {
  try {
    await truncateDatabase()
  } catch (err) {
    console.error("Error to jest teardown: " + err.message)
  }
}

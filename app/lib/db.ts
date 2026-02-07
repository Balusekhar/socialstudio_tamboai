import { tablesDB, ID } from "./appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

export async function addRow(tableId: string, data: Record<string, unknown>) {
  return tablesDB.createRow({
    databaseId: DATABASE_ID,
    tableId,
    rowId: ID.unique(),
    data,
  });
}

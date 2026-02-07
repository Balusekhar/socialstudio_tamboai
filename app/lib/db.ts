import { tablesDB, ID, Query } from "./appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

export async function addRow(tableId: string, data: Record<string, unknown>) {
  const rowId = ID.unique();
  await tablesDB.createRow({
    databaseId: DATABASE_ID,
    tableId,
    rowId,
    data,
  });
  return { $id: rowId };
}

export async function listRows(
  tableId: string,
  queries: string[] = [],
) {
  return tablesDB.listRows(DATABASE_ID, tableId, queries);
}

export async function updateRow(
  tableId: string,
  rowId: string,
  data: Record<string, unknown>,
) {
  await tablesDB.updateRow({
    databaseId: DATABASE_ID,
    tableId,
    rowId,
    data,
  });
}

export async function deleteRow(tableId: string, rowId: string) {
  await tablesDB.deleteRow({
    databaseId: DATABASE_ID,
    tableId,
    rowId,
  });
}

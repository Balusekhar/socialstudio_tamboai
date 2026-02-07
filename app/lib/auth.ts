import { account, tablesDB, ID } from "./appwrite";
import { AppwriteException } from "appwrite";

function getErrorMessage(err: unknown): string {
  if (err instanceof AppwriteException) {
    return err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "An unexpected error occurred. Please try again.";
}


export async function signup(name: string, email: string, password: string) {
  try {
    const user = await account.create(ID.unique(), email, password, name);
    // add the user to the database
    await tablesDB.createRow({
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      tableId: process.env.NEXT_PUBLIC_APPWRITE_USERS_TABLE_ID!,
      rowId: ID.unique(),
      data: {
        appwriteId: user.$id,
        email: email,
        name: name,
      }
  });
    await login(email, password);
    return { success: true, data: user };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function login(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return { success: true, data: session };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function logout() {
  try {
    await account.deleteSession("current");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function getUser() {
  try {
    const user = await account.get();
    return { success: true, data: user };
  } catch {
    return { success: false, data: null };
  }
}

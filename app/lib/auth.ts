import { account, ID, tablesDB, Query } from "./appwrite";
import { AppwriteException } from "appwrite";
import { addRow } from "./db";

const USERS_TABLE_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_TABLE_ID!;

function getErrorMessage(err: unknown): string {
  if (err instanceof AppwriteException) {
    return err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "An unexpected error occurred. Please try again.";
}

export { getErrorMessage };

export async function signup(name: string, email: string, password: string) {
  try {
    const user = await account.create(ID.unique(), email, password, name);
    await login(email, password);

    // Add the user to the database
    await addRow(USERS_TABLE_ID, {
      appwriteId: user.$id,
      email,
      name,
    });

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
    const user = await tablesDB.listRows(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_USERS_TABLE_ID!,
      [Query.equal("appwriteId", (await account.get())?.$id)]
    );
    return { success: true, data: user };
  } catch {
    return { success: false, data: null };
  }
}

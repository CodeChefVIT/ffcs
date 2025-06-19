import { NextResponse } from "next/server";
import { google, sheets_v4 } from "googleapis";
import { JWT } from "google-auth-library";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const SHEET_ID = process.env.SHEET_ID;

async function getAuth(): Promise<JWT> {
  return new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: SCOPES,
  });
}

async function appendEmailToSheet(email: string) {
  const authClient = await getAuth();
  const sheets: sheets_v4.Sheets = google.sheets({
    version: "v4",
    auth: authClient,
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: "Sheet1!A:A",
    valueInputOption: "RAW",
    requestBody: {
      values: [[email]],
    },
  });
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    try {
      await appendEmailToSheet(email);
      return NextResponse.json({ message: "Email added successfully" });
    } catch (error: unknown) {
      console.error("Error adding email to sheet:", error);
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: unknown }).code === 403
      ) {
        return NextResponse.json(
          {
            error:
              "Permission denied. Make sure the service account has editor access to the spreadsheet.",
            details: (error as { message?: string }).message,
          },
          { status: 403 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Failed to add email" }, { status: 500 });
  }
}

import { z } from "zod";
import { TamboTool } from "@tambo-ai/react";
import { addRow, listRows, updateRow, deleteRow } from "@/app/lib/db";
import { Query } from "@/app/lib/appwrite";
import TamboCaptions from "./TamboCaptions";
import TamboThumbnail from "./TamboThumbnail";
import TamboMetadata from "./TamboMetadata";
import TamboScriptWriter from "./TamboScriptWriter";
import TamboPhotoCaptions from "./TamboPhotoCaptions";
import TamboLogoCreator from "./TamboLogoCreator";
import TamboReelScript from "./TamboReelScript";
import TamboBrandName from "./TamboBrandName";

// ─── Generative component registrations ───────────────────────────

export const tamboComponents = [
  {
    name: "TamboCaptions",
    description:
      "Auto Captions tool – allows the user to upload a video file and automatically generate SRT captions using Whisper AI. Use this when the user wants to generate captions or subtitles for a video.",
    component: TamboCaptions,
    propsSchema: z.object({}),
  },
  {
    name: "TamboThumbnail",
    description:
      "Thumbnail Designer – generates eye-catching YouTube thumbnails from a text prompt using DALL-E AI. Use this when the user asks for a YouTube thumbnail or wants to design a thumbnail image.",
    component: TamboThumbnail,
    propsSchema: z.object({
      prompt: z
        .string()
        .optional()
        .describe(
          "A detailed description of the thumbnail to generate, e.g. 'A focused developer coding at night with glowing monitors, bold text saying MASTER REACT'. Leave empty if the user did not specify; they can type it in the UI."
        ),
    }),
  },
  {
    name: "TamboMetadata",
    description:
      "SEO Metadata Generator – generates optimized YouTube video descriptions and hashtags. Use this when the user wants SEO metadata, a video description, or hashtags for their video.",
    component: TamboMetadata,
    propsSchema: z.object({
      videoDescription: z
        .string()
        .optional()
        .describe(
          "A description of the video content to generate metadata for, e.g. 'A 10-minute tutorial on building a portfolio website with Next.js'. Leave empty if not specified; user can fill in the UI."
        ),
    }),
  },
  {
    name: "TamboScriptWriter",
    description:
      "YouTube Script Writer – generates full video scripts for YouTube. Use this when the user wants a YouTube script, video script, or asks for script writing help.",
    component: TamboScriptWriter,
    propsSchema: z.object({
      topic: z
        .string()
        .optional()
        .describe("The video topic to write a script about. Leave empty if the user did not specify; they can type it in the UI."),
      duration: z
        .string()
        .optional()
        .describe(
          "Target duration in minutes: '5', '10', '15', or '20'. Defaults to '10'."
        ),
      tone: z
        .string()
        .optional()
        .describe(
          "Script tone: 'educational', 'entertaining', 'motivational', 'conversational', or 'professional'. Defaults to 'educational'."
        ),
    }),
  },
  {
    name: "TamboPhotoCaptions",
    description:
      "Instagram Photo Captions – generates Instagram-ready captions for photos. The user can upload a photo and select a mood. Use this when the user wants photo captions or Instagram captions.",
    component: TamboPhotoCaptions,
    propsSchema: z.object({
      mood: z
        .string()
        .optional()
        .describe(
          "Caption mood: 'casual', 'aesthetic', 'witty', 'inspirational', 'professional', or 'humorous'. Defaults to 'casual'."
        ),
    }),
  },
  {
    name: "TamboLogoCreator",
    description:
      "Logo Creator – designs professional brand logos using AI. Use this when the user wants to create a logo, design a brand logo, or needs a logo for their business.",
    component: TamboLogoCreator,
    propsSchema: z.object({
      brandName: z
        .string()
        .optional()
        .describe("The brand name to create a logo for. Leave empty if not specified; user can fill in the UI."),
      industry: z
        .string()
        .optional()
        .describe(
          "Industry: 'technology', 'fashion', 'food', 'fitness', 'creative', 'ecommerce', 'education', or 'other'. Defaults to 'technology'."
        ),
      style: z
        .string()
        .optional()
        .describe(
          "Logo style: 'minimal', 'bold', 'elegant', 'playful', 'vintage', or 'geometric'. Defaults to 'minimal'."
        ),
    }),
  },
  {
    name: "TamboReelScript",
    description:
      "Instagram Reel Scriptwriter – generates viral Instagram Reel scripts. Use this when the user wants a reel script, Instagram reel content, or short-form video script.",
    component: TamboReelScript,
    propsSchema: z.object({
      topic: z
        .string()
        .optional()
        .describe("The reel topic to write a script about. Leave empty if not specified; user can fill in the UI."),
      format: z
        .string()
        .optional()
        .describe(
          "Script format: 'hook-story-cta', 'tutorial', 'listicle', 'before-after', 'day-in-life', or 'trending'. Defaults to 'hook-story-cta'."
        ),
      duration: z
        .string()
        .optional()
        .describe(
          "Duration in seconds: '15', '30', '60', or '90'. Defaults to '30'."
        ),
    }),
  },
  {
    name: "TamboBrandName",
    description:
      "Brand Name Generator – generates unique brand name suggestions with taglines. Use this when the user wants brand name ideas, business name suggestions, or naming help.",
    component: TamboBrandName,
    propsSchema: z.object({
      keywords: z
        .string()
        .optional()
        .describe(
          "Keywords or description of the brand to generate names for. Leave empty if not specified; user can fill in the UI."
        ),
      industry: z
        .string()
        .optional()
        .describe(
          "Industry: 'technology', 'fashion', 'food', 'fitness', 'creative', 'ecommerce', 'education', 'lifestyle', or 'other'. Defaults to 'technology'."
        ),
      nameStyle: z
        .string()
        .optional()
        .describe(
          "Name style: 'modern', 'playful', 'professional', 'abstract', 'descriptive', or 'short'. Defaults to 'modern'."
        ),
    }),
  },
];

// ─── Calendar tools (CRUD – no UI, just actions) ──────────────────

const CALENDAR_TABLE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_CALENDAR_TABLE_ID!;

export const calendarTools: TamboTool[] = [
  {
    name: "list_calendar_events",
    description:
      "List all content calendar events for the current user. Returns an array of events with id, title, date, and note fields. Use this when the user asks to see, show, view, or list their calendar events.",
    tool: async (input: { userId: string }) => {
      const result = await listRows(CALENDAR_TABLE_ID, [
        Query.equal("owner", input.userId),
      ]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rows = (result as any).rows ?? [];
      return rows.map(
        (r: { $id: string; title: string; date: string; note: string }) => ({
          id: r.$id,
          title: r.title,
          date: r.date,
          note: r.note,
        })
      );
    },
    inputSchema: z.object({
      userId: z
        .string()
        .describe("The current user's ID. This will be provided automatically."),
    }),
    outputSchema: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        date: z.string(),
        note: z.string(),
      })
    ),
  },
  {
    name: "add_calendar_event",
    description:
      "Add a new event to the content calendar. Requires a title and date. Use this when the user wants to add, create, or schedule a new calendar event.",
    tool: async (input: {
      userId: string;
      title: string;
      date: string;
      note?: string;
    }) => {
      // Store date as YYYY-MM-DD only so it displays on the correct calendar day in all timezones
      const d = new Date(input.date);
      const dateOnly = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;

      const row = await addRow(CALENDAR_TABLE_ID, {
        owner: input.userId,
        title: input.title,
        date: dateOnly,
        note: input.note || "",
      });
      return { id: row.$id, title: input.title, date: dateOnly, note: input.note || "" };
    },
    inputSchema: z.object({
      userId: z
        .string()
        .describe("The current user's ID. This will be provided automatically."),
      title: z.string().describe("The event title"),
      date: z
        .string()
        .describe(
          "The event date in a parseable format like YYYY-MM-DD or ISO 8601"
        ),
      note: z
        .string()
        .optional()
        .describe("Optional note or description for the event"),
    }),
    outputSchema: z.object({
      id: z.string(),
      title: z.string(),
      date: z.string(),
      note: z.string(),
    }),
  },
  {
    name: "update_calendar_event",
    description:
      "Update an existing calendar event. Requires the event ID and the fields to update. Use this when the user wants to edit, update, or modify a calendar event.",
    tool: async (input: {
      eventId: string;
      title?: string;
      date?: string;
      note?: string;
    }) => {
      const data: Record<string, unknown> = {};
      if (input.title !== undefined) data.title = input.title;
      if (input.date !== undefined) {
        const d = new Date(input.date);
        data.date = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
      }
      if (input.note !== undefined) data.note = input.note;
      await updateRow(CALENDAR_TABLE_ID, input.eventId, data);
      return {
        success: true,
        message: `Event ${input.eventId} updated successfully.`,
      };
    },
    inputSchema: z.object({
      eventId: z.string().describe("The ID of the event to update"),
      title: z.string().optional().describe("New event title"),
      date: z
        .string()
        .optional()
        .describe("New event date in a parseable format"),
      note: z.string().optional().describe("New event note"),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string(),
    }),
  },
  {
    name: "delete_calendar_event",
    description:
      "Delete a calendar event by its ID. Use this when the user wants to remove, delete, or cancel a calendar event.",
    tool: async (input: { eventId: string }) => {
      await deleteRow(CALENDAR_TABLE_ID, input.eventId);
      return {
        success: true,
        message: `Event ${input.eventId} deleted successfully.`,
      };
    },
    inputSchema: z.object({
      eventId: z
        .string()
        .describe("The ID of the event to delete"),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string(),
    }),
  },
];

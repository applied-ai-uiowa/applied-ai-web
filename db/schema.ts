import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

// Single-row table for meeting info
export const meeting = pgTable("meeting", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  datetime: timestamp("datetime").notNull(),
  location: text("location").notNull(),
  details: text("details"),
  rsvpLink: text("rsvp_link"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const tutorials = pgTable("tutorials", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  category: text("category").notNull(), // e.g., "Python", "Machine Learning"
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  githubUrl: text("github_url"),
  category: text("category").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const boardMembers = pgTable("board_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(), // e.g., "President", "VP"
  bio: text("bio"),
  photoUrl: text("photo_url"),
  linkedinUrl: text("linkedin_url"),
  githubUrl: text("github_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

// Type exports for use in Server Actions
export type Meeting = typeof meeting.$inferSelect;
export type InsertMeeting = typeof meeting.$inferInsert;
export type Tutorial = typeof tutorials.$inferSelect;
export type InsertTutorial = typeof tutorials.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;
export type BoardMember = typeof boardMembers.$inferSelect;
export type InsertBoardMember = typeof boardMembers.$inferInsert;

export const episodes = pgTable("episodes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes").notNull(),
  tag: text("tag").notNull(),
  spotifyUrl: text("spotify_url"), // null = "coming soon"
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Episode = typeof episodes.$inferSelect;
export type InsertEpisode = typeof episodes.$inferInsert;

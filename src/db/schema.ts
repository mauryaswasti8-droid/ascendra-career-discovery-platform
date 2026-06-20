import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const careers = pgTable("careers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  overview: text("overview").notNull(),
  futureGrowth: text("future_growth").notNull(),
  requiredDegrees: json("required_degrees").$type<string[]>().notNull(),
  recommendedMajors: json("recommended_majors").$type<string[]>().notNull(),
  salaryMin: integer("salary_min").notNull(),
  salaryMax: integer("salary_max").notNull(),
  skillsRequired: json("skills_required").$type<string[]>().notNull(),
  bestCountries: json("best_countries").$type<string[]>().notNull(),
  extracurriculars: json("extracurriculars").$type<string[]>().notNull(),
  category: text("category").notNull(),
  tags: json("tags").$type<string[]>().notNull(),
  isEmerging: boolean("is_emerging").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const opportunities = pgTable("opportunities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  eligibility: text("eligibility").notNull(),
  deadline: text("deadline").notNull(),
  location: text("location").notNull(),
  funding: text("funding").notNull(),
  benefits: text("benefits").notNull(),
  requirements: text("requirements").notNull(),
  website: text("website").notNull(),
  applicationLink: text("application_link").notNull(),
  source: text("source").notNull(),
  category: text("category").notNull(),
  featured: boolean("featured").default(false),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  officialLink: text("official_link").notNull(),
  category: text("category").notNull(),
  guidance: json("guidance").$type<string[]>().notNull(),
  tools: json("tools").$type<string[]>().notNull(),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const savedItems = pgTable("saved_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  itemType: text("item_type").notNull(), // 'career', 'opportunity', 'resource'
  itemId: integer("item_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const recentlyViewed = pgTable("recently_viewed", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  itemType: text("item_type").notNull(),
  itemId: integer("item_id").notNull(),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
});

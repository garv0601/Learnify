import { pgTable, integer, varchar, boolean, json } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  subscriptionID: varchar("subscriptionID"),
});

export const coursesTable = pgTable("courses", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  cid: varchar("cid").notNull().unique(),
  name: varchar("name"),
  description: varchar("description"),
  noOfChapters: integer("noOfChapters").notNull(),
  level: varchar("level").notNull(),
  includeVideo: boolean("includeVideo").default(false),
  category: varchar("category"),
  courseJson: json("courseJson"),
  bannerImageUrl: varchar().default(''),
  courseContent: json().default({}),
  userEmail: varchar("userEmail")
    .references(() => usersTable.email)
    .notNull(),
});


export const enrollCourseTable=pgTable('enrollCourse',{
  id:integer().primaryKey().generatedAlwaysAsIdentity(),
  cid:varchar('cid').references(()=>coursesTable.cid),
  userEmail:varchar('userEmail').references(()=>usersTable.email).notNull(),
  completedChapters:json()

})

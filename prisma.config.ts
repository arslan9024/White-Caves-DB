import { defineConfig } from "@prisma/internals";

export default defineConfig({
  datasources: {
    db: {
      provider: "mongodb",
      url: process.env.DATABASE_URL || "mongodb+srv://arslanmalikgoraha_db_user:WhiteCaves2024@whitecavesdb.opetsag.mongodb.net/WhiteCavesDB?retryWrites=true&w=majority",
    },
  },
});

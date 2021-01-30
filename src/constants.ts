import fieldsToRelations from "graphql-fields-to-relations";
export const isProd = process.env.NODE_ENV === "production";

export const loadRelations = fieldsToRelations;

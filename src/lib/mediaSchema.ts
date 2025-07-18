/**
 * Media Files Schema Validation
 * This file contains schema validation rules for the media files collection
 */

/**
 * Media File Schema Validation
 */
export const mediaFileSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["filename", "url", "contentType", "size", "uploadedAt", "category"],
      properties: {
        filename: {
          bsonType: "string",
          description: "Original filename - required"
        },
        url: {
          bsonType: "string",
          description: "URL to access the file - required"
        },
        contentType: {
          bsonType: "string",
          description: "MIME type of the file - required"
        },
        size: {
          bsonType: "int",
          description: "File size in bytes - required"
        },
        uploadedAt: {
          bsonType: "date",
          description: "Date when the file was uploaded - required"
        },
        category: {
          bsonType: "string",
          description: "File category (e.g., blog, project, research) - required"
        },
        alt: {
          bsonType: "string",
          description: "Alternative text for images"
        },
        caption: {
          bsonType: "string",
          description: "Caption for the file"
        },
        tags: {
          bsonType: "array",
          description: "Tags for the file",
          items: {
            bsonType: "string"
          }
        }
      }
    }
  }
};
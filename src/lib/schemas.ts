/**
 * MongoDB Schema Validation
 * This file contains schema validation rules for MongoDB collections
 */

/**
 * Blog Post Schema Validation
 */
export const blogPostSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "slug", "content", "excerpt", "publishedAt", "tags"],
      properties: {
        title: {
          bsonType: "string",
          description: "Title of the blog post - required"
        },
        slug: {
          bsonType: "string",
          description: "URL-friendly slug for the blog post - required"
        },
        content: {
          bsonType: "string",
          description: "Content of the blog post in markdown or rich text - required"
        },
        excerpt: {
          bsonType: "string",
          description: "Short excerpt/summary of the blog post - required"
        },
        publishedAt: {
          bsonType: "date",
          description: "Date when the blog post was published - required"
        },
        updatedAt: {
          bsonType: "date",
          description: "Date when the blog post was last updated"
        },
        tags: {
          bsonType: "array",
          description: "Array of tags for the blog post - required",
          items: {
            bsonType: "string"
          }
        },
        featured: {
          bsonType: "bool",
          description: "Whether the blog post is featured"
        },
        seoMetadata: {
          bsonType: "object",
          description: "SEO metadata for the blog post",
          properties: {
            title: {
              bsonType: "string",
              description: "SEO title"
            },
            description: {
              bsonType: "string",
              description: "SEO description"
            },
            keywords: {
              bsonType: "array",
              description: "SEO keywords",
              items: {
                bsonType: "string"
              }
            }
          }
        }
      }
    }
  }
};

/**
 * Research Paper Schema Validation
 */
export const researchPaperSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "authors", "abstract", "publicationDate", "venue", "categories", "addedAt"],
      properties: {
        title: {
          bsonType: "string",
          description: "Title of the research paper - required"
        },
        authors: {
          bsonType: "array",
          description: "Authors of the research paper - required",
          items: {
            bsonType: "string"
          }
        },
        abstract: {
          bsonType: "string",
          description: "Abstract of the research paper - required"
        },
        publicationDate: {
          bsonType: "date",
          description: "Publication date of the research paper - required"
        },
        venue: {
          bsonType: "string",
          description: "Publication venue (journal, conference, etc.) - required"
        },
        doi: {
          bsonType: "string",
          description: "Digital Object Identifier"
        },
        arxivId: {
          bsonType: "string",
          description: "arXiv identifier"
        },
        pdfUrl: {
          bsonType: "string",
          description: "URL to the PDF of the paper"
        },
        categories: {
          bsonType: "array",
          description: "Categories/topics of the research paper - required",
          items: {
            bsonType: "string"
          }
        },
        personalAnnotations: {
          bsonType: "string",
          description: "Personal annotations on the research paper"
        },
        keyFindings: {
          bsonType: "array",
          description: "Key findings from the research paper",
          items: {
            bsonType: "string"
          }
        },
        relevanceScore: {
          bsonType: "int",
          description: "Relevance score (1-10)",
          minimum: 1,
          maximum: 10
        },
        addedAt: {
          bsonType: "date",
          description: "Date when the paper was added to the collection - required"
        }
      }
    }
  }
};

/**
 * Portfolio Data Schema Validation
 */
export const portfolioDataSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["personalInfo", "skills", "experience", "education", "projects"],
      properties: {
        personalInfo: {
          bsonType: "object",
          required: ["name", "title", "bio", "email"],
          properties: {
            name: {
              bsonType: "string",
              description: "Full name - required"
            },
            title: {
              bsonType: "string",
              description: "Professional title - required"
            },
            bio: {
              bsonType: "string",
              description: "Professional bio - required"
            },
            location: {
              bsonType: "string",
              description: "Location"
            },
            email: {
              bsonType: "string",
              description: "Email address - required"
            },
            socialLinks: {
              bsonType: "object",
              properties: {
                linkedin: { bsonType: "string" },
                github: { bsonType: "string" },
                twitter: { bsonType: "string" },
                scholar: { bsonType: "string" }
              }
            }
          }
        },
        skills: {
          bsonType: "array",
          description: "Skills grouped by category - required",
          items: {
            bsonType: "object",
            required: ["category", "items"],
            properties: {
              category: {
                bsonType: "string",
                description: "Skill category name - required"
              },
              items: {
                bsonType: "array",
                description: "Skills in this category - required",
                items: {
                  bsonType: "string"
                }
              }
            }
          }
        },
        experience: {
          bsonType: "array",
          description: "Professional experience - required",
          items: {
            bsonType: "object",
            required: ["company", "position", "startDate", "description"],
            properties: {
              company: {
                bsonType: "string",
                description: "Company name - required"
              },
              position: {
                bsonType: "string",
                description: "Job position - required"
              },
              startDate: {
                bsonType: "date",
                description: "Start date - required"
              },
              endDate: {
                bsonType: "date",
                description: "End date (null for current positions)"
              },
              description: {
                bsonType: "string",
                description: "Job description - required"
              },
              technologies: {
                bsonType: "array",
                description: "Technologies used",
                items: {
                  bsonType: "string"
                }
              }
            }
          }
        },
        education: {
          bsonType: "array",
          description: "Educational background - required",
          items: {
            bsonType: "object",
            required: ["institution", "degree", "field", "graduationDate"],
            properties: {
              institution: {
                bsonType: "string",
                description: "Educational institution - required"
              },
              degree: {
                bsonType: "string",
                description: "Degree obtained - required"
              },
              field: {
                bsonType: "string",
                description: "Field of study - required"
              },
              graduationDate: {
                bsonType: "date",
                description: "Graduation date - required"
              }
            }
          }
        },
        projects: {
          bsonType: "array",
          description: "Portfolio projects - required",
          items: {
            bsonType: "object",
            required: ["id", "title", "description", "technologies", "featured"],
            properties: {
              id: {
                bsonType: "string",
                description: "Project ID - required"
              },
              title: {
                bsonType: "string",
                description: "Project title - required"
              },
              description: {
                bsonType: "string",
                description: "Project description - required"
              },
              technologies: {
                bsonType: "array",
                description: "Technologies used - required",
                items: {
                  bsonType: "string"
                }
              },
              githubUrl: {
                bsonType: "string",
                description: "GitHub repository URL"
              },
              liveUrl: {
                bsonType: "string",
                description: "Live project URL"
              },
              imageUrl: {
                bsonType: "string",
                description: "Project image URL"
              },
              featured: {
                bsonType: "bool",
                description: "Whether the project is featured - required"
              }
            }
          }
        }
      }
    }
  }
};

/**
 * User Session Schema Validation
 */
export const userSessionSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "role", "createdAt", "expiresAt", "lastActivity"],
      properties: {
        email: {
          bsonType: "string",
          description: "User email - required"
        },
        role: {
          enum: ["admin"],
          description: "User role (only admin allowed) - required"
        },
        createdAt: {
          bsonType: "date",
          description: "Session creation date - required"
        },
        expiresAt: {
          bsonType: "date",
          description: "Session expiration date - required"
        },
        lastActivity: {
          bsonType: "date",
          description: "Last activity timestamp - required"
        }
      }
    }
  }
};
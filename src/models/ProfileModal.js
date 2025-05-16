const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    bio: {
      type: String,
      default: "",
    },

    profilePic: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    // Skill Swap structure
    skillsToTeach: [
      {
        name: { type: String, required: true },
        level: {
          type: String,
          enum: ["beginner", "intermediate", "advanced"],
          default: "intermediate",
        },
        yearsOfExperience: {
          type: Number,
          default: 0,
        },
      },
    ],

    skillsToLearn: [
      {
        name: { type: String, required: true },
        priority: {
          type: String,
          enum: ["low", "medium", "high"],
          default: "medium",
        },
      },
    ],

    experience: [
      {
        title: String,
        company: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],

    education: [
      {
        institution: String,
        degree: String,
        startDate: Date,
        endDate: Date,
        score: Number,
        description: String,
      },
    ],

    interests: [
      {
        category: String,
        name: String,
        level: {
          type: String,
          enum: ["beginner", "intermediate", "advanced"],
          default: "beginner",
        },
      },
    ],

    availability: {
      status: {
        type: String,
        enum: ["available", "busy", "unavailable"],
        default: "available",
      },
      schedule: [
        {
          day: {
            type: String,
            enum: [
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ],
          },
          timeSlots: [
            {
              start: String, // "10:00"
              end: String, // "11:00"
            },
          ],
        },
      ],
      timezone: {
        type: String,
        default: "UTC",
      },
    },

    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      totalRatings: {
        type: Number,
        default: 0,
      },
      reviews: [
        {
          reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
          },
          comment: String,
          date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Optional indexes for performance
// profileSchema.index({ userId: 1 });
profileSchema.index({ "ratings.average": -1 });

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;

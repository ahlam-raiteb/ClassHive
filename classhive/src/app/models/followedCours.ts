import mongoose, { models, Schema } from "mongoose";

const followedCoursesSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cours",
      required: true,
    },
  },
  { timestamps: true }
);

const FollowedCourses = models.FollowedCourses || mongoose.model("FollowedCourses", followedCoursesSchema);

export default FollowedCourses;

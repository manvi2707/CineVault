import mongoose from 'mongoose';

const featuredSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, required: true },
    mediaType: { type: String, enum: ['movie', 'tv'], default: 'movie' },
    title: { type: String, required: true },
    overview: String,
    poster_path: String,
    backdrop_path: String,
    vote_average: Number,
    release_date: String,
    genre_ids: [Number],
    order: { type: Number, default: 0 },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Prevent the same title being featured twice
featuredSchema.index({ tmdbId: 1, mediaType: 1 }, { unique: true });

export default mongoose.model('FeaturedContent', featuredSchema);

const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema(
    {
      text: {
        type: String,
        required: true
      },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
);


const hootSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
        enum: ['News', 'Sports', 'Games', 'Movies', 'Music', 'Television'],
      },

      // referencing the author to the user
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // embedding the comments
    comments: [commentSchema]

    },

  { timestamps: true }

);

const Hoot = mongoose.model('Hoot', hootSchema);

module.exports = Hoot;
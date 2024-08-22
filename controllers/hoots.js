const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Hoot = require('../models/hoot.js');
const router = express.Router();

// ========== Public Routes ===========

// ========= Protected Routes =========

router.use(verifyToken);

// create hoots
router.post('/', async (req, res) => {
    try {
      req.body.author = req.user._id;
      const hoot = await Hoot.create(req.body);
      hoot._doc.author = req.user;
      res.status(201).json(hoot);

    } catch (error) {
      console.log(error);
      res.status(500).json(error);

    }
});

// get all hoots
router.get('/', async (req, res) => {
    try {
        const hoots = await Hoot.find({})
         .populate('author')
         .sort({ createdAt : 'desc' })
         res.status(200).json(hoots)

    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
});

// find specific hoot
router.get('/:hootId', async (req, res) => {
    try {
        const hoot = await Hoot.findById(req.params.hootId).populate('author'); 
        res.status(200).json(hoot);

    } catch (error) {
        res.status(500).json(error);
    }
});

router.put('/:hootId', async (req, res) => {
    try {
      // Find the hoot:
      const hoot = await Hoot.findById(req.params.hootId);
  
      // Check permissions:
      if (!hoot.author.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
      }
  
      // Update hoot:
      const updatedHoot = await Hoot.findByIdAndUpdate(
        req.params.hootId,
        req.body,
        { new: true }
      );
  
      // Append req.user to the author property:
      updatedHoot._doc.author = req.user;
  
      // Issue JSON response:
      res.status(200).json(updatedHoot);

    } catch (error) {
      res.status(500).json(error);

    }
});

//delete 

router.delete('/:hootId', async (req, res) => {
    try {
      // Find the hoot:
      const hoot = await Hoot.findById(req.params.hootId);
  
      // Check permissions:
      if (!hoot.author.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
      }

    // Delete hoot:
    const deletedHoot = await Hoot.findByIdAndDelete(req.params.hootId); 
    res.status(200).json(deletedHoot)

    } catch (error) {
        res.status(500).json(error)
    }
});

// create hoot comments
router.post('/:hootId/comments', async (req, res) => {
    try {
        req.body.author = req.user._id
        const hoot = await Hoot.findById(req.params.hootId)
        hoot.comments.push(req.body)
        await hoot.save()

        const newComment = hoot.comments[hoot.comments.length - 1]
        newComment._doc.author = req.user

        res.status(200).json(newComment)
    } catch (error) {
        res.status(500).json(error)
    }
});

// edit hoot comments
router.put('/:hootId/comments/:commentId', async (req, res) => {
    try {
        const hoot = await Hoot.findById(req.params.hootId);
        const comment = hoot.comments.id(req.params.commentId);
        comment.text = req.body.text;
        await hoot.save();
        res.status(200).json({ message: 'Ok' });

      } catch (err) {
        res.status(500).json(err);

      }
});

// delete hoot comments
router.delete('/:hootId/comments/:commentId', async (req, res) => {
    try {
        const hoot = await Hoot.findById(req.params.hootId);
        hoot.comments.remove({ _id: req.params.commentId });
        await hoot.save();
        res.status(200).json({ message: 'Ok' });
        
    } catch (error) {
        res.status(500).json(err);
    }


});
module.exports = router;

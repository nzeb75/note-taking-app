const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find({userId: req.user.id}).sort({createdAt: -1});
        res.json(notes);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.createNote = async (req, res) => {
    try {
        const {title, content} = req.body;
        const note = new Note({userId: req.user.id, title, content});
        await note.save();
        res.status(201).json(note);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

exports.getNoteById = async (req,res) => {
    try {
        const {id} = req.params;
        const note = await Note.findById(id);
        if (!note) {
          return res.status(404).json({message: 'Note not found' });
        }
        res.status(201).json(note);
      } catch (err) {
        res.status(404).json({error: error.message});
      }
}

exports.updateNote = async (req, res) => {
    try {
        const {title, content} = req.body;
        const note = await Note.findOneAndUpdate(
            {_id: req.params.id, userId: req.user.id},
            {title, content},
            {new: true}
        );
    if(!note)
        return res.status(401).json({message: 'Note not found'});
    res.json(note);
    } catch (error) {
        res.status(404).json({error: error.message});
    }
};

exports.deleteNote = async (res, req) => {
    try {
        const note = await Note.findOneAndDelete({_id: req.params.id, userId: req.user.id});
    if(!note)
        return res.status(404).json({message: 'Note not found'});
        res.json({message: 'Note deleted successfully'});
    } catch (error) {
        res.status(404).json({error: error.message});
    }    
};

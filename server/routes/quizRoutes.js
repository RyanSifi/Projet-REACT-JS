const express = require('express');
const multer = require('multer');
const Quiz = require('../models/Quiz');
const Response = require('../models/Response');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Configuration de Multer pour le téléchargement des images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Créer un nouveau quiz
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    const { title, description, questions } = req.body;
    const image = req.file ? req.file.path : null;

    try {
        const newQuiz = new Quiz({
            title,
            description,
            image,
            questions: JSON.parse(questions),
            author: req.user.id
        });
        await newQuiz.save();
        res.status(201).json(newQuiz);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Récupérer tous les quizzes
router.get('/', async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate('author', 'username');
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Récupérer un quiz par son ID
router.get('/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).populate('author', 'username');
        if (!quiz) return res.status(404).json({ message: 'Quiz non trouvé' });
        res.json(quiz);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Modifier un quiz
router.patch('/:id', authMiddleware, upload.single('image'), async (req, res) => {
    const { title, description, questions } = req.body;
    const image = req.file ? req.file.path : null;

    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ message: 'Quiz non trouvé' });
        if (quiz.author.toString() !== req.user.id) return res.status(403).json({ message: 'Accès refusé' });

        quiz.title = title || quiz.title;
        quiz.description = description || quiz.description;
        if (questions) quiz.questions = JSON.parse(questions);
        if (image) quiz.image = image;

        await quiz.save();
        res.json(quiz);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Supprimer un quiz
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ message: 'Quiz non trouvé' });
        if (quiz.author.toString() !== req.user.id) return res.status(403).json({ message: 'Accès refusé' });

        await quiz.remove();
        res.json({ message: 'Quiz supprimé' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Soumettre une réponse à un quiz
router.post('/:id/response', authMiddleware, async (req, res) => {
    const { answers } = req.body;

    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ message: 'Quiz non trouvé' });

        // Calcul du score
        let score = 0;
        answers.forEach(answer => {
            const question = quiz.questions.id(answer.questionId);
            if (question && question.correctAnswer === answer.selectedOption) {
                score++;
            }
        });

        const newResponse = new Response({
            user: req.user.id,
            quiz: req.params.id,
            answers,
            score
        });
        await newResponse.save();
        res.status(201).json(newResponse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

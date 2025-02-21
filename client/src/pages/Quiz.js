import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Quiz = () => {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/quizzes/${id}`);
                setQuiz(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchQuiz();
    }, [id]);

    const handleChange = (e, questionIndex) => {
        setAnswers({ ...answers, [questionIndex]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Veuillez vous connecter pour soumettre vos réponses.');
            return;
        }
        try {
            await axios.post(
                `http://localhost:5000/api/quizzes/${id}/responses`,
                { answers },
                { headers: { Authorization: token } }
            );
            alert('Réponses soumises avec succès !');
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la soumission des réponses.');
        }
    };

    if (!quiz) return <div>Chargement...</div>;

    return (
        <div>
            <h1>{quiz.title}</h1>
            <p>{quiz.description}</p>
            <form onSubmit={handleSubmit}>
                {quiz.questions.map((question, index) => (
                    <div key={index}>
                        <h3>{question.question}</h3>
                        {question.options.map((option, i) => (
                            <label key={i}>
                                <input
                                    type="radio"
                                    name={`question-${index}`}
                                    value={option}
                                    onChange={(e) => handleChange(e, index)}
                                    required
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                ))}
                <button type="submit">Soumettre les réponses</button>
            </form>
        </div>
    );
};

export default Quiz;

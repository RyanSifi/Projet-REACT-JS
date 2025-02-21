import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/quizzes');
                setQuizzes(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchQuizzes();
    }, []);

    return (
        <div>
            <h1>Liste des quizzes</h1>
            {quizzes.map((quiz) => (
                <div key={quiz._id}>
                    <h2>{quiz.title}</h2>
                    <p>{quiz.description}</p>
                    <Link to={`/quiz/${quiz._id}`}>Voir le quiz</Link>
                </div>
            ))}
        </div>
    );
};

export default Home;

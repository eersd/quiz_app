import React, { useState } from 'react';
import QuestionCard from './components/QuestionCard';
import {fetchQuizQuestions, Difficulty, QuestionState} from './API';
import {GlobalStyle, Wrapper} from './App.styles';


export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;

}

const TOTAL_QUESTIONS = 10;

function App() {
  const [loading,setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  
  console.log(questions);

  const startTrivia = async() => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS, Difficulty.MEDIUM
    );
    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setQuestionNumber(0);
    setLoading(false);
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver){
      const answer = e.currentTarget.value;
      const correct = questions[questionNumber].correct_answer === answer;
      if (correct) setScore((prevScore) => prevScore +1);

      const answerObject = {
        question: questions[questionNumber].question,
        answer,
        correct,
        correctAnswer: questions[questionNumber].correct_answer,
      };
      setUserAnswers(prevAnswer => [...prevAnswer, answerObject]);
    }
  }

  const nextQuestion = () => {
    const nextQuestion = questionNumber +1 ;

    if (nextQuestion === TOTAL_QUESTIONS){
      setGameOver(true);
    }else{
      setQuestionNumber(nextQuestion);
    }
  }

  return (
    <>
      <GlobalStyle/>
      <Wrapper>
        <h1> React Quiz </h1>
        {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
          <button className="app__start" onClick={startTrivia}> 
            Start
          </button>): null}
        
        {!gameOver ? <p className="app__score"> Score: {score}</p> : null}
        
        {loading && <p> Loading Questions ... </p>}
        {!loading && !gameOver && (
          <QuestionCard 
            questionNr={questionNumber +1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[questionNumber].question}
            answers={questions[questionNumber].answers}
            userAnswer={userAnswers ? userAnswers[questionNumber]:undefined}
            callback= {checkAnswer}
          />)}
        
        {!gameOver &&
        !loading && 
        userAnswers.length === questionNumber + 1 &&
          questionNumber !== TOTAL_QUESTIONS - 1  ?(
          <button className="app__next" onClick={nextQuestion}>
            Next Question
          </button>
        ):null}
        
      </Wrapper>
    </>
    );
}

export default App;

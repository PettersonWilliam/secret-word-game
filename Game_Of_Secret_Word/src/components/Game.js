import { useState, useRef } from 'react';
import './Game.css';

//useRef -> ele cria referencia em algum lugar, neste caso ele esat sendo usado para assim que selecionar a letra seja ela correta ou nao ela suma e crie a referencia do cursor no input

const Game = ({verifyLetter, pickedWord, pickedCategory, letters, guessedLetters, wrongLetters, guesses, score }) => {

    const [letter, setLetter] = useState('');
    const lettersInputRef = useRef(null);

    const handleSubmit = e => {
        e.preventDefault();

        verifyLetter(letter);

        setLetter('');

        lettersInputRef.current.focus();// foco na referencia apos o fim do onSubmit
    };

  return (
    <div className='game'>
        <p className="points">
            <span>Pontuação: {score}</span>
        </p>
        <h1>Advinhe a palavra</h1>
        <h3 className='tip'>
            Dica sobre a palavra:
            <span>{pickedCategory}</span>
        </h3>
        <p>Você tem {guesses} tentativa(s).</p>
        <div className="wordContainer">
        {letters.map((letter, i) =>
            guessedLetters.includes(letter) ? (
                <span key={i} className='letter'>
                    {letter}
                </span>
            ) : (
            <span key={i} className='blankSquare'></span>
            )
        )}
        </div>
        <div className="letterContainer">
            <p>Tente Adivinhar a letra:</p>
            <form onSubmit={handleSubmit}>
                <input type="text" name='letter' maxLength= '1' required onChange={(e) => setLetter(e.target.value)} value={letter} ref={lettersInputRef}//ref = seta referencia
                /> {/*alterando a letra com base no evento*/}
                <button>Jogar</button> {/* colocar uma função aqui */}
            </form>
        </div>
        <div className="wrongLettersContainer">
            <p>Letras já ultilizadas: </p>
            {wrongLetters.map((letter, i) => (
            <span key={i}>{letter}, </span>
            ))}
        </div>
    </div>
  )
}

export default Game;

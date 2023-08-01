import './App.css';

//hooks
import { useState, useCallback, useEffect} from 'react';

//data - dados
import { wordsList } from './data/words';

//componentes
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

//estados da aplicação
const stages = [
    {id: 1, name: 'start'},
    {id: 2, name: 'game'},
    {id: 3, name: 'end'}
];

const guessesQty = 3;

function App() {
    const [ gameStage, setGameStage ] = useState(stages[0].name);// estagio inicial
    const [ words ] = useState(wordsList);

    const [ pickedWord, setPickedWord ] = useState('');
    const [ pickedCategory, setPickedCategory ] = useState('');
    const [ letters, setletters ] = useState([]);

    const [guessedLetters, setGuessedLetters] = useState([]); //letras advinhadas
    const [wrongLetters, setWrongLetters] = useState([]); // letras erradas - tentativas
    const [guesses, setGuesses] = useState(guessesQty); // chances -- 3 tentativas
    const [score, setScore] = useState(0);//pontuação doz usuário - que vai ganhando a cada rodada

    const pickWordAndCategory = useCallback(() => { //  const pickWordAndCategory = useCallback(() => quando precisamos ultilizar o calback envolvendo na funcao e para que ano fique 
        const categories = Object.keys(words);//essas sao todas minhas categorias
        const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]; //neste metodo retiramps uma palavra aleatoria - Math.floor('arredondando pra baixo') Math.radom('aleatorio')

        //resgate da palavra aleatoria para poder renderizar no jogo / words[category]- quantidade de palavras que tenha na minha categoria
        // neste caso vamos ver a dica pro usuario e a resposta, nao mostra na tela
        const word = words[category][Math.floor(Math.random() * words[category].length)];

        return { word, category };
    }, [words]);
    //start do jogo
    const startGame = useCallback(() => {
        // limpando todas as letras
        clearLetterStates();
        const { word, category } = pickWordAndCategory();

        //criando um array das letras
        let wordLetters = word.split(''); //(split) caso precise separar as letras

        //temos que fazer essa transformacao nas letras pois o javascript ele é case incensitive por default a primeira letra vem como maiuscula, fazemos da seguinte forma:
        //pegamos nossa letra, iteramos sobre cada uma e transformamos para lowercase - ou seja minúscula

        wordLetters = wordLetters.map((l) => l.toLowerCase()); // normalizando as letras

        //setando os estadodos
        setPickedWord(word);
        setPickedCategory(category);
        setletters(wordLetters);


        setGameStage(stages[1].name);

    }, [pickWordAndCategory]);
    // verificando as letras do input
    const verifyLetter = letter => {
        //normalizando as letras
        const normalizerdLetter = letter.toLowerCase();

        //verificando se as letras erradas e as letras advinhadas, se algum desses forem verdadeiros ele retorna.(pois nao faz sentido o usuario faca de novo o processo sabendo das letras que ele mesmo pôs)
        if (guessedLetters.includes(normalizerdLetter) || wrongLetters.includes(normalizerdLetter)) {
            return;
        }

        //incluindo as chances das letras acertadas(tentativas)
        if (letters.includes(normalizerdLetter)) {
            setGuessedLetters(actualGuessedLetters => [ //letras corretas
                ...actualGuessedLetters,//recebemos o array e as letras normalizadas
                normalizerdLetter
            ]);
        } else {
            setWrongLetters(actualWrongLettres => [// letras ja ultilizadas ou seja letras erradas
                ...actualWrongLettres,//recebemos o array e as letras normalizadas
                normalizerdLetter
            ]);

            //diminuindo as tentativas, pois possivelmenta na regra de nosso jogo por partida temos apenas 3 chances
            setGuesses(actualGuesses => actualGuesses -1);
        }
    };
    //useEffect -> ele pode monitorar algum dado que agente escola, nesse caso o da guesses vaisero estado que vamos monitorar e colocamos como segundo parametro o dado que queremos monitorar

    // ESTAMOS MONITORANDO NESTE CASO, QUANDO ACONTECER DE ACABAR AS TENTATIVAS DO JOGADOR, ELA VAI MOSTRAR O ESTADO DO FIM DO JOGO E REDIRECIONA PRA TELA DE FIM DE JOGO

    // sendo que dentro desse monitoramensto quando ocorrer o termino do jogo tera que resetar o jogo limpando todos os campos

    const clearLetterStates = () => {
        setGuessedLetters([]); // setando as letras ultilizadas para array vazio
        setWrongLetters([]); // setando as letras ultilizadas para array vazio
    }

    // useEffect -> podemos ter varios, pois ele é que verifica os estados de nossa aplicacao

    // aqui estamos verificando se as tentativas acabaram para setar o usuaria para tela de fim de jogo
    useEffect(() => {
        //reseat do jogo
        if (guesses <= 0) {
            clearLetterStates();// limpando as letras
            setGameStage(stages[2].name); // estado de game over
        }
    }, [guesses]);

    // verificando a condicao de vitoria, ou seja, a cada acerto da palavra vamos passar para as palavra adiante
    useEffect(() => {
        //neste caso vamos precisar fazer uma simples checagem de letras, pois temos palavras que temos letras repetidas ex: OVO e nao vamos querer em um jogo quando o usuario selecionar a lera nao ter de selecionar novamente
        const uniqueLetters = [...new Set(letters)]; // neste caso vamos ter um array de letras unicas

        //AQUI FAZEMOS NOSSA CONDICAO DE VITORIA
        if (guessedLetters.length === uniqueLetters.length) { //ou seja quando a mesma quantidade de letras forem igual a s letras acertadas do jogodevemos passar pra proxima palavra
            setScore((actualScore) => actualScore += 100); // implementandoa pontuação no jogo

            //aqui restartamos nosso jogo para que o usuario possa passar pra proxiam palavra secreta
            startGame();
        }

    }, [guessedLetters, letters, startGame]); // aqui dentro desse segundo parametro como sabemos passamos tudo que foi monitorado

    //RESTART o jogo
    const retry = () => {
        setScore(0); // nesse caso setamos os valores pra 0 pois queremos iniciar
        setGuesses(guessesQty);

        setGameStage(stages[0].name); // jogamos ele la pro  inicio
    };

    return (
        <div className="App">
            {gameStage === 'start' && <StartScreen startGame={startGame}/>}
            {gameStage === 'game' && (
                <Game
                    verifyLetter={verifyLetter}
                    pickedWord={pickedWord}
                    pickedCategory={pickedCategory}
                    letters={letters}
                    guessedLetters={guessedLetters}
                    wrongLetters={wrongLetters}
                    guesses={guesses}
                    score={score}
                />
            )}
            {gameStage === 'end' && <GameOver retry={retry} score={score} />}
        </div>
    );
};

export default App;

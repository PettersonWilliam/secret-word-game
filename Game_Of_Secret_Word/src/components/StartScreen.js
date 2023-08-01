import './StartScreen.css';

const StartScreen = ({startGame}) => {
    return <div className='start'>
        <h1>Jogo Da Palavra Secreta</h1>
        <p>Clique abaixo para começar a jogar</p>
        <button onClick={startGame}>Começar o Jogo</button>
    </div>
};

export default StartScreen;

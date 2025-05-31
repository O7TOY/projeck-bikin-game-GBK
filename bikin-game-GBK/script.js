  class Start {
        constructor() {
            this.playerName = 'eja';
            this.botName = 'wut wut';
            this.playerOption = '';
            this.botOption = '';
            this.winner = '';
        }
        get getBotOption() {
            return this.botOption;
        }
        set setBotOption(option) {
            this.botOption = option;
        }
        get getPlayerOption() {
            return this.playerOption;
        }
        set setPlayerOption(option) {
            this.playerOption = option;
        }
        botBrain() {
            const options = ['✌️', '✊', '✋'];
            const randomIndex = Math.floor(Math.random() * options.length);
            this.setBotOption = options[randomIndex];
            console.log("wut wut memilih: " + this.getBotOption);
        }
        winnerCheck() {
            if (this.getPlayerOption === this.getBotOption) {
                this.winner = 'Seri';
            } else if (
                (this.getPlayerOption === '✌️' && this.getBotOption === '✊') ||
                (this.getPlayerOption === '✊' && this.getBotOption === '✋') ||
                (this.getPlayerOption === '✋' && this.getBotOption === '✌️')
            ) {
                this.winner = this.botName;
            } else {
                this.winner = this.playerName;
            }
            console.log("pemenang nya adalah: " + this.winner);
            document.querySelector('.result').textContent = `pemenang: ${this.winner}`;
        }
        matchResult() {
            let message = '';
            if (this.winner === this.playerName) {
                message = "MENANG👍";
            }
            else if (this.winner === this.botName) {
                message = "KALAH 😢";
            } else {
                message = "SERII😜";
            }
            document.querySelector('.result').textContent = message;
        }
    }

    const startGame = new Start();

    if (!document.getElementById('inGame')) {
        const summaryDiv = document.querySelector('.summary');
        const inGameDiv = document.createElement('div');
        inGameDiv.id = 'inGame';
        summaryDiv.appendChild(inGameDiv);

        const resultDiv = document.createElement('div');
        resultDiv.id = 'result';
        summaryDiv.appendChild(resultDiv);
    }

    function pickOption(params) {
        startGame.setPlayerOption = params;
        console.log("eja memilih: " + startGame.getPlayerOption);
        startGame.botBrain();

        const inGame = document.getElementById('inGame');
        const result = document.getElementById('result');

        inGame.textContent = "...";
        result.textContent = "...";
        setTimeout(() => {
            inGame.textContent = `eja memilih: ${startGame.getPlayerOption}`;
            result.textContent = `wut wut memilih: ${startGame.getBotOption}`;
            startGame.winnerCheck();
            startGame.matchResult();
        }, 1000);
    }
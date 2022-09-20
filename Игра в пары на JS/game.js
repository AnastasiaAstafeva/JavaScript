(function(){
    //массив с парами цифра от 1 до 8
    let numberCards = ['1', '1', '2', '2', '3', '3', '4' , '4', '5', '5', '6', '6', '7', '7', '8', '8'];

    //перемешиваем массив
    function shuffle (array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    let newNumberCards = shuffle(numberCards);
     
    //массив для проверки пар
    let testArr = [];

    //счетчик дублей
    let counter = 0;

    const container = document.querySelector('.cards');

    //создаем карточки
    for (let i = 0; i < newNumberCards.length; i++) {
        let card = document.createElement('div');
        card.classList.add('card');
        card.textContent = newNumberCards[i];
        container.append(card);

        //события на клике на карточку
        function onClick () {
            //добавляем в массив значение карточки
            let result = card.textContent;
            testArr.push(result);
            
            //одна карточка просто открывается
            if (testArr.length <= 1) {
                card.classList.add('card-open');
            }
            
            //две проверяются на совместимость
            if (testArr.length > 1 && testArr.length < 3) {
                card.classList.add('card-open');
                if (testArr[0] === testArr[1]) {
                    //функция замены классов
                    check('card-double');
                    testArr = [];
                    //счетчик дублей
                    counter++;
                    //функция при совпадении всех карт
                    if (counter === 8) {
                        win();  
                    }
                } 
            } 
            //при нажатии на третью закрываются первые две
            if (testArr.length >= 3) {
                //функция замены классов
                check('card');
                card.classList.add('card-open');
                testArr = testArr.slice(-1);
            }
        }

        

        card.addEventListener('click', onClick);    
    };

    //функция замены классов
    function check (className) {
        let cardOpen = container.querySelectorAll('.card-open');
        for (i = 0; i < cardOpen.length; i++) {
            cardOpen[i].className = className;
        }
    }

    //функция при совпадении всех карт
    function win () {
        let button = document.createElement('button');
        button.classList.add('btn');
        button.textContent = 'Сыграть еще!'
        container.append(button);

        button.addEventListener('click', reset);
    }

    
    function reset () {
        document.location.reload();
    }
    
})();

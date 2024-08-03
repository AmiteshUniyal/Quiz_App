let Questions = [];
let currentQuestion = 0;
let score = 0;

async function fetchQuestions() {
    try {
        const resp = await fetch('https://opentdb.com/api.php?amount=10');
        if (!resp.ok) {
            throw new Error("Couldn't Fetch Questions! Please Try Again");
        }
        const data = await resp.json();
        Questions = data.results;
        console.log(Questions);
        loadQues();
    } catch (err) {
        console.error(err);
        document.getElementById("ques").innerHTML = `<h5 style="background-color:red">${err}</h5>`;
    }
}

function loadQues() {
    if (Questions.length === 0) {
        document.getElementById("ques").innerHTML = `
            <h5 class="wait">Please Wait:: <br> Fetching Questions...🕛</h5>
        `;
        return;
    }
    const currentQues = Questions[currentQuestion];
    document.getElementById("ques").innerText = currentQues.question;
    const opt = document.getElementById("opt");
    opt.innerHTML = "";
    const options = [currentQues.correct_answer, ...currentQues.incorrect_answers];
    options.sort(() => Math.random() - 0.5);
    options.forEach((option) => {
        opt.innerHTML += `
            <div>
                <input type="radio" name="answer" value="${option}" id="${option}">
                <label for="${option}">${option}</label>
            </div>
        `;
    });
}

function nextQuestion() {
    if (currentQuestion < Questions.length - 1) {   
        currentQuestion++;
        loadQues();
    } else {
        document.getElementById("opt").remove();
        document.getElementById("ques").remove();
        document.getElementById("btn").remove();
        showTotal();
    }
}

function checkAnswer() {
    const selectedAns = document.querySelector('input[name="answer"]:checked');
    if (!selectedAns) {
        alert("Please select an answer!");
        return;
    }
    if (selectedAns.value === Questions[currentQuestion].correct_answer) {
        score++;
    }
    nextQuestion();
}

function showTotal() {
    const totalScore = document.querySelector('#score');
    score > 5 ? totalScore.innerText = `Your Score:- ${score}/10 🎉` : totalScore.innerText = `Your Score:- ${score}/10 😔`;

    Questions.forEach((ques, idx) => {
        totalScore.innerHTML += `
            <p>
                ${idx + 1}: ${ques.correct_answer}
            </p>
        `;
    });
}

fetchQuestions();

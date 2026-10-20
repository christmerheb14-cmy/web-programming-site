// ======================================================
let total = 0;
const cache = {};

async function getQuestion(index) {
  if (cache[index]) {
    return cache[index];
  }

  const response = await fetch(`/api/question/${index}`);

  if (!response.ok) {
    throw new Error(`Could not load question ${index + 1}`);
  }

  const question = await response.json();
  cache[index] = question;

  return question;
}

 // Populate this array with question objects as needed.
// Each question object should have the following structure:
//   {
//     question:
//       "Which keyword declares a block-scoped variable that can later be reassigned?",
//     choices: ["var", "let", "const", "static"],
//     answer: 1,
//     explanation:
//       "let declares a block-scoped variable whose value may later be reassigned.",
//   },

// ======================================================
// APPLICATION STATE
// ======================================================
let currentQuestion = 0;
const userAnswers = [];

// ======================================================
// SAVE AN ANSWER
// ======================================================
function saveAnswer(choiceIndex) {
    userAnswers[currentQuestion] = choiceIndex;
  //   Save the user's answer for the current question.
}

// ======================================================
// NAVIGATION
// ======================================================
function goNext() {
    if (currentQuestion < total - 1) {
        currentQuestion++;
        renderQuestion();
    }
  //   Move to the next question if not at the last question.
}

function goPrevious() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
  //   Move to the previous question if not at the first question.
}

function goFirst() {
    currentQuestion = 0;
    renderQuestion();
  //   Move to the first question.
}
function goLast() {
    currentQuestion = total - 1;
    renderQuestion();
  //   Move to the last question.
}

// ======================================================
// CALCULATE SCORE
// ======================================================
async function calculateScore() {
    let score = 0;

    for (let i = 0; i < total; i++) {
       const question = await getQuestion(i);

    if (userAnswers[i] === question.answer) {
       score++;
  }
}


    return score;
  //   Calculate the user's score based on their answers.
}

// ======================================================
// CALCULATE PERCENTAGE
// ======================================================
function calculatePercentage(score) {
     return Math.round((score / total) * 100);
  //   Calculate the percentage score based on the total number of questions.
}

// ======================================================
// PERFORMANCE MESSAGE
// ======================================================
function getPerformanceMessage(percentage) {
    if (percentage >= 80) {
        return "Excellent";
    } else if (percentage >= 60) {
        return "Good";
    } else if (percentage >= 50) {
        return "Pass";
    } else {
        return "Needs improvement";
    }
  //   Return a performance message based on the percentage score.
}

// ======================================================
// BUILD CORRECTION
// ======================================================
async function buildCorrection() {
  let correction = "";
  
  
  for (let i = 0; i < total; i++) {
    const question = await getQuestion(i);

    const userAnswerIndex = userAnswers[i];

    const userAnswer =
      userAnswerIndex === undefined
        ? "Not Answered"
        : question.choices[userAnswerIndex];

    const correctAnswer = question.choices[question.answer];

    const result =
      userAnswerIndex === question.answer
        ? "Correct"
        : "Incorrect";

    correction +=
      "Question " + (i + 1) + "\n" +
      "Question: " + question.question + "\n" +
      "Your answer: " + userAnswer + "\n" +
      "Correct answer: " + correctAnswer + "\n" +
      "Result: " + result + "\n" +
      "Explanation: " + question.explanation + "\n" +
      "----------------------------------------\n\n";
  }

  return correction;
    }

 

  //   Build a correction string that includes the question, the user's answer,
  //   the correct answer, and an explanation for each question.


// ======================================================
// PROVIDED INTERFACE CODE
//
// DOM manipulation and events will be studied later.
// ======================================================

// ======================================================
// SUBMIT QUIZ
// ======================================================
async function submitQuiz() {
  const score = await calculateScore();
  const percentage = calculatePercentage(score);
  const message = getPerformanceMessage(percentage);
  const correction = await buildCorrection();

  showResults(score, percentage, message, correction);
}



async function renderQuestion() {
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");

  loading.hidden = false;
  error.hidden = true;
  error.textContent = "";

  try {
    const q = await getQuestion(currentQuestion);

    document.getElementById("progress").textContent =
      `Question ${currentQuestion + 1} of ${total}`;

    document.getElementById("questionText").textContent = q.question;

    const choicesContainer = document.getElementById("choices");
    choicesContainer.innerHTML = "";

    for (let i = 0; i < q.choices.length; i++) {
      const label = document.createElement("label");
      label.className = "choice";

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "answer";
      radio.value = i;

      if (userAnswers[currentQuestion] === i) {
        radio.checked = true;
      }

      radio.onclick = function () {
        saveAnswer(i);
      };

      label.appendChild(radio);
      label.appendChild(document.createTextNode(" " + q.choices[i]));
      choicesContainer.appendChild(label);
    }

    document.getElementById("firstBtn").disabled = currentQuestion === 0;
    document.getElementById("previousBtn").disabled = currentQuestion === 0;
    document.getElementById("nextBtn").disabled =
      currentQuestion === total - 1;
    document.getElementById("lastBtn").disabled =
      currentQuestion === total - 1;
  } catch (err) {
    error.textContent = "Could not load the question. Please try again.";
    error.hidden = false;
    console.error(err);
  } finally {
    loading.hidden = true;
  }
}


// ======================================================
// DISPLAY RESULTS
// ======================================================
function showResults(score, percentage, message, correction) {
  document.getElementById("quizPanel").style.display = "none";
  document.getElementById("resultsPanel").style.display = "block";
  document.getElementById("scoreText").textContent =
    `Score: ${score} / ${total}`;
  document.getElementById("percentageText").textContent =
    `Percentage: ${percentage}%`;
  document.getElementById("performanceText").textContent = message;
  document.getElementById("correction").textContent = correction;
}

// ======================================================
// START APPLICATION
// ======================================================
async function init() {
  const error = document.getElementById("error");

  try {
    const response = await fetch("/api/questions/count");

    if (!response.ok) {
      throw new Error("Could not load the question count.");
    }

    const data = await response.json();
    total = data.count;

    await renderQuestion();
  } catch (err) {
    error.textContent = "Could not start the quiz. Please try again.";
    error.hidden = false;
    console.error(err);
  }
}

init();


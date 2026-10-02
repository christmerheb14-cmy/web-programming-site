// ======================================================
// QUESTIONS
// ======================================================
const questions = [
  {
    question: "What does F1 qualifying determine?",
    choices: [
      "The championship winner",
      "The starting grid for the race",
      "The fastest pit stop",
      "The order of the team standings",
    ],
    answer: 1,
    explanation:
      "Qualifying determines the starting positions, or grid, for the Grand Prix.",
  },

  {
    question: "What is the name given to the first position on the starting grid?",
    choices: ["Pole position", "Front row", "Grid one", "Launch position"],
    answer: 0,
    explanation:
      "Pole position is the first place on the starting grid, usually awarded to the fastest driver in qualifying.",
  },

  {
    question: "How many points does the winner of a standard F1 Grand Prix receive?",
    choices: ["18", "20", "25", "26"],
    answer: 2,
    explanation:
      "The winner of a standard Formula 1 Grand Prix receives 25 championship points.",
  },

  {
    question: "Which organization governs Formula 1?",
    choices: ["FIFA", "FIA", "UEFA", "FIM"],
    answer: 1,
    explanation:
      "The FIA, or Fédération Internationale de l’Automobile, governs Formula 1 and many other forms of motorsport.",
  },

  {
    question: "What does DRS stand for in Formula 1?",
    choices: [
      "Driver Racing System",
      "Drag Reduction System",
      "Dynamic Racing Setup",
      "Downforce Regulation System",
    ],
    answer: 1,
    explanation:
      "DRS stands for Drag Reduction System. It opens part of the rear wing to reduce drag and increase straight-line speed.",
  },

  {
    question: "Which championship is awarded to the team with the most points?",
    choices: [
      "World Drivers’ Championship",
      "World Constructors’ Championship",
      "Grand Prix Championship",
      "Team Racing Championship",
    ],
    answer: 1,
    explanation:
      "The World Constructors’ Championship is awarded to the team that scores the most points during the season.",
  },

  {
    question: "What is the purpose of a pit stop?",
    choices: [
      "To change tyres or make repairs",
      "To increase the race distance",
      "To determine the starting grid",
      "To restart the engine before qualifying",
    ],
    answer: 0,
    explanation:
      "During a pit stop, a team can change tyres, repair the car, or make other necessary adjustments.",
  },

  {
    question: "What does a red flag mean during an F1 session?",
    choices: [
      "The fastest driver has been disqualified",
      "The session has been stopped",
      "The race is entering its final lap",
      "Drivers must use soft tyres",
    ],
    answer: 1,
    explanation:
      "A red flag stops the session, usually because of an accident, dangerous conditions, or another serious incident.",
  },

  {
    question: "What is an F1 Sprint?",
    choices: [
      "A short race held during selected Grand Prix weekends",
      "A tyre-changing competition",
      "A qualifying lap for reserve drivers",
      "A practice session for new teams",
    ],
    answer: 0,
    explanation:
      "An F1 Sprint is a shorter race held during selected Grand Prix weekends, with championship points awarded to the top finishers.",
  },

  {
    question: "What safety device surrounds the cockpit of a modern F1 car?",
    choices: ["Roll bar", "Halo", "Safety shield", "Cockpit cage"],
    answer: 1,
    explanation:
      "The halo is a strong protective structure designed to help shield the driver’s head from debris and impacts.",
  },
];
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
const userAnswers = new Array(questions.length);

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
    if (currentQuestion < questions.length - 1) {
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
    currentQuestion = questions.length - 1;
    renderQuestion();
  //   Move to the last question.
}

// ======================================================
// CALCULATE SCORE
// ======================================================
function calculateScore() {
    let score = 0;

    for (let i = 0; i < questions.length; i++) {
        if (userAnswers[i] === questions[i].answer) {
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
     return Math.round((score / questions.length) * 100);
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
function buildCorrection() {
  let correction = "";
  
  
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];

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
function submitQuiz() {
  const score = calculateScore();
  const percentage = calculatePercentage(score);
  const message = getPerformanceMessage(percentage);
  const correction = buildCorrection();
  showResults(score, percentage, message, correction);
}

function renderQuestion() {
  const q = questions[currentQuestion];

  // --------------------------------------------------
  // QUESTION NUMBER
  // --------------------------------------------------
  document.getElementById("progress").textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;

  // --------------------------------------------------
  // QUESTION
  // --------------------------------------------------
  document.getElementById("questionText").textContent = q.question;

  // --------------------------------------------------
  // CHOICES
  // --------------------------------------------------
  const choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = "";
  for (let i = 0; i < q.choices.length; i++) {
    const label = document.createElement("label");
    label.className = "choice";
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "answer";
    radio.value = i;
    // Restore an answer previously selected
    // by the user.
    if (userAnswers[currentQuestion] === i) {
      radio.checked = true;
    }
    // When the user selects this answer,
    // save its index.
    radio.onclick = function () {
      saveAnswer(i);
    };
    label.appendChild(radio);
    label.appendChild(document.createTextNode(" " + q.choices[i]));
    choicesContainer.appendChild(label);
  }

  // --------------------------------------------------
  // NAVIGATION BUTTONS
  // --------------------------------------------------
  document.getElementById("firstBtn").disabled = currentQuestion === 0;
  document.getElementById("previousBtn").disabled = currentQuestion === 0;
  document.getElementById("nextBtn").disabled =
    currentQuestion === questions.length - 1;
  document.getElementById("lastBtn").disabled =
    currentQuestion === questions.length - 1;
}

// ======================================================
// DISPLAY RESULTS
// ======================================================
function showResults(score, percentage, message, correction) {
  document.getElementById("quizPanel").style.display = "none";
  document.getElementById("resultsPanel").style.display = "block";
  document.getElementById("scoreText").textContent =
    `Score: ${score} / ${questions.length}`;
  document.getElementById("percentageText").textContent =
    `Percentage: ${percentage}%`;
  document.getElementById("performanceText").textContent = message;
  document.getElementById("correction").textContent = correction;
}

// ======================================================
// START APPLICATION
// ======================================================
renderQuestion();

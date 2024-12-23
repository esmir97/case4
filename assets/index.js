// import { renderStart } from "./components/home/renderHome.js";
import { establishWebsocket } from "./logic/client.js";
import { renderEnding } from "./components/ending/ending.js";
// import { renderQuizNav, renderQuizHeader, renderQuizQuestion } from "./components/quiz/renderQuiz.js";
// import { renderWrongAnswer } from "./components/wrongAnswer/renderWrongAnswer.js";

export const ws = establishWebsocket();
const wrapper = document.getElementById("wrapper");

// renderStart(wrapper);
// renderQuizNav(wrapper);
// renderRanking(wrapper, false);
// renderQuizHeader(wrapper);
//renderQuizCounter(wrapper);
// renderQuizQuestion(wrapper);

//renderWrongAnswer(wrapper);
// renderFinalScore(wrapper);

renderEnding(wrapper);


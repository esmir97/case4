import { renderStart } from "./components/home/renderHome.js";
import { establishWebsocket } from "./logic/client.js";
// import { renderQuizNav, renderQuizHeader, renderQuizQuestion } from "./components/quiz/renderQuiz.js";
// import { renderWrongAnswer } from "./components/wrongAnswer/renderWrongAnswer.js";

export const ws = establishWebsocket();
const wrapper = document.getElementById("wrapper");

//renderStart(wrapper);
// renderQuizNav(wrapper);
// renderQuizHeader(wrapper);
// renderQuizQuestion(wrapper);
//renderCorrectAnswer(wrapper);

renderWrongAnswer(wrapper);
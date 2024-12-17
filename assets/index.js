// import { renderStart } from "./components/home/renderHome.js";
import { renderQuizNav, renderQuizHeader, renderQuizQuestion } from "./components/quiz/renderQuiz.js";

const wrapper = document.getElementById("wrapper");

// renderStart(wrapper);
renderQuizNav(wrapper);
renderQuizHeader(wrapper);
renderQuizQuestion(wrapper);
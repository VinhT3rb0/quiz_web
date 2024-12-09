import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import ViewQuiz from "./pages/ViewQuiz/ViewQuiz";
import Result from './pages/result/result.jsx';
import CreateQuiz from "./pages/createQuiz/createQuiz";
import CreateQuestion from "./pages/createQuestion/createQuestion";
import MyLibrary from "./components/myLibrary/myLibrary";
import Explore from "./components/explore/explore.jsx";
import InforQuiz from "./components/inforQuiz/inforQuiz";
import QuizList from "./pages/quizList/quizList";
import QuizDetail from "./pages/quizDetail/quizDetail";
import ExamContent from "./components/examContent/examContent";
import DoExam from "./pages/doExam/doExam";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import ReportQuizResult from "./pages/reportQuizResult/reportQuizResult";
import ChangePassword from "./pages/changePassword/changePassword";
import Profile from "./pages/profile/profile";
import EditQuiz from "./pages/editQuiz/editQuiz";
import Edit from "./pages/editQuiz/edit";
import EditQuestion from "./pages/editQuiz/editQuestion";
import ForgotPassword from "./pages/forgetPassword/forgotPassword.jsx";
import { FileProvider } from "./components/context/ContextFileImage.jsx";
import VerifyAccount from "./pages/VerifyAccount/VerifyAccount.jsx";
import Competion from "./pages/Competion/Competion.jsx";
import JoinCompetition from "./pages/joinCompetition/joinCompetition.jsx";
import PrivateRoute from "./components/privateRouter/privateRouter.jsx";
import CreateCompetition from "./pages/createCompetition/createCompetition.jsx";
import CreateQuizCompetition from "./pages/createQuizCompetition/createQuizCompetition.jsx";
import ShowQuizCompe from "./components/showQuizCompe/showQuizCompe.jsx";
import QuestionCompe from "./components/questionCompe/questionCompe.jsx";
import UserCompetitions from "./pages/userCompetitions/userCompetitions.jsx";
import Update from "./pages/updateCompetition/update.jsx";
import UpdateCompetition from "./pages/updateCompetition/updateCompetiton.jsx";
import ExamCompetition from "./pages/examCompetition/examCompetition.jsx";
import Test from "./pages/Test/Test.jsx";
import Test2 from "./pages/Test/Test2.jsx";
import FavoriteQuizzes from "./pages/favoriteQuizzes/favoriteQuizzes.jsx";
import ReportCompetition from "./pages/reportCompetition/reportCompetition.jsx";
import CreateQuizAI from "./pages/createQuizAI/createQuizAI.jsx";
import CompeWithFile from "./components/questionCompe/CompeWithFile.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    <FileProvider>
      <Router future={{ v7_startTransition: true }}>
        <Routes>
          <Route path="/verify" element={<VerifyAccount />} />
          <Route path="/test" element={<Test2 />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<App />}>
              <Route path="/joincompetition/:code" element={<JoinCompetition />} />
              <Route path="/mylibrary" element={<MyLibrary />} />
              <Route path="/ViewQuiz" element={<ViewQuiz />} />
              <Route path="/" element={<Explore />} />
              <Route path="/result/:idResult" element={<Result />} />
              <Route path="/resultdetail/:idResult" element={<Result />} />
              <Route path="/reportquizresult" element={<ReportQuizResult />} />
              <Route path="/usercompetitions" element={<UserCompetitions />} />
              <Route path="/reportcompetition/:competitionId" element={<ReportCompetition />} />
              <Route path="/favorexam" element={<FavoriteQuizzes />} />
              <Route path="/createquiz" element={<CreateQuiz />}>
                <Route path="createquizAI" element={<CreateQuizAI />} />
                <Route path="inforquiz" element={<InforQuiz />} />
                <Route path="createquestion" element={<CreateQuestion />} />
              </Route>
              <Route path="/createcompetition" element={<CreateCompetition />}>
                <Route path="competition" element={<Competion />} />
                <Route path="createquizcompetition/:competitionId" element={<CreateQuizCompetition />} />
                <Route path="questioncompe/:competitionId" element={<QuestionCompe />} />
                <Route path="withfile/:competitionId" element={<CompeWithFile />} />
                <Route path="showquizcompe/:competitionId" element={<ShowQuizCompe />} />
              </Route>
              <Route path="/update" element={<Update />}>
                <Route path="updatecompetition/:competitionId" element={<UpdateCompetition />} />
              </Route>
              <Route path="/edit" element={<Edit />}>
                <Route path="editquiz/:id" element={<EditQuiz />} />
                <Route path="editquestion/:id" element={<EditQuestion />} />
              </Route>
              <Route path="/quizlist" element={<QuizList />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/quizlist" element={<QuizList />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>

        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/quizdetail" element={<QuizDetail />} >
              <Route path="examcontent/:id" element={<ExamContent />} />
            </Route>
            <Route path="/changepass" element={<ChangePassword />} />
            <Route path="/doexam/:id" element={<DoExam />} />
            <Route path="/examcompetition/:id" element={<ExamCompetition />} />
          </Route>
        </Routes>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpass" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </FileProvider>
  // </React.StrictMode >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

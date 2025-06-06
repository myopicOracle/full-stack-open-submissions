import { useState } from "react";
import "./App.css";
import ProjectName from "./ProjectName"
import Header from "./Header"
import Button from "./Button";
import Statistics from "./Statistics";

function App() {
  const [score, setScore] = useState(0);
  const [rating, setRating] = useState({
    good: 0,
    neutral: 0,
    bad: 0,
  });

  const all = rating.good + rating.bad + rating.neutral;
  const average = all && score / all;
  const positive = all && (rating.good / all) * 100 + " %";

  console.log(score, all, average, positive);

  return (
    <>
      <ProjectName />
      <Header title="give feedback" />
      {/* Remember that when changing state that is OBJECT, can't just change 1 when using setState() */}
      <Button
        text="good"
        onClick={() => {
          setRating({ ...rating, good: rating.good + 1 });
          setScore(score + 1);
        }}
      />
      <Button
        text="neutral"
        onClick={() => {
          setRating({ ...rating, neutral: rating.neutral + 1 });
          setScore(score + 0);
        }}
      />
      <Button
        text="bad"
        onClick={() => {
          setRating({ ...rating, bad: rating.bad + 1 });
          setScore(score - 1);
        }}
      />

      <Header title="statistics" />
      <Statistics
        rating={rating}
        all={all}
        average={average}
        positive={positive}
      />
      {/* {console.log(rating.good, rating.neutral, rating.bad, rating, setRating)} */}
    </>
  );
}

export default App;

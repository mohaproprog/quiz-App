import { useEffect, useRef, useState } from 'react'
import Data from './Assets/data.js'
import './quiz.css'

function Quiz() {
  // states
  const [index,setIndex] = useState(0);
  const [question,setQuestion] = useState(Data[index]);
  const [lock,setLock] = useState(false);
  const [score,setScore] = useState(0);
  const [result,setResult] = useState(false);
  const [showHistory,setHistory] = useState(false);
  const [scoreHistory,setScoreHistory] = useState([]);
  const [load,setLoaded] = useState(false);

  useEffect(()=>{

    const saved = localStorage.getItem("savedHistory");
    if (saved) setScoreHistory(JSON.parse(saved));
  },[])
  useEffect(()=>{
    setTimeout(() => {
      localStorage.setItem("savedHistory", JSON.stringify(scoreHistory));
      setLoaded(true);
    },2000);
  },[scoreHistory])


  // options and giving the right question bg
  const option1 = useRef(null)
  const option2 = useRef(null)
  const option3 = useRef(null)
  const option4 = useRef(null);
  const optionArray = [option1,option2,option3,option4]
  useEffect(()=>{
    setQuestion(Data[index])
  },[index])
  // next questions
  function next(){
    if (!lock) return;
    
    if(Data.length -1 === index ){
      setResult(true);
      setScoreHistory([...scoreHistory,score])
      console.log(scoreHistory);
      
      return;
    }
    setIndex(prev=> prev +1);
    setLock(false);
    // console.log(Data.length);
    // console.log(index);
    
    
    optionArray.map((option)=>{
      option.current.classList.remove("correct");
      option.current.classList.remove("wrong");
    })

  }
  // choosing answer
  function option(e,answer){
    if (lock) return;
    if(Data[index].ans === answer){
      e.target.classList.add("correct");
      setScore(prev=> prev +1)
      setLock(true);
      
      
    }
    else{
      e.target.classList.add("wrong")
      setLock(true);
      optionArray[Data[index].ans -1].current.classList.add("correct");
      
    }

  }
  function restart(){
    setIndex(0);
    setScore(0);
    setLock(false);
    setResult(false);

    
  }

  // history
  function history(){
    if(!showHistory){
      setHistory(true);
      
    }
  }
  function hideHistory (){
    setHistory(false)
  }

  // function deletedScore(indexToDelete){
  //   const updated = scoreHistory.filter((_,i)=>
  //      i !== indexToDelete
  //   )
  //   setScoreHistory(updated)
  // }

  function DeleteScore(indexToDelete) {
  const updated = scoreHistory.filter((_, i) => i !== indexToDelete);
  setScoreHistory(updated);
}




  return (
    !result?
    <div className="container">
      <div className="header">

      <h2>Quiz App</h2>
      <i  onClick={history} className="fa-solid fa-clock-rotate-left"></i>
      </div>
      <hr />
      <div className="questions">
        <p>{index +1}. {question.question}</p>
        <li ref={option1} onClick={(e)=>{option(e,1)}}>{question.option1}</li>
        <li ref={option2} onClick={(e)=>{option(e,2)}}>{question.option2}</li>
        <li ref={option3} onClick={(e)=>{option(e,3)}}>{question.option3}</li>
        <li ref={option4} onClick={(e)=>{option(e,4)}}>{question.option4}</li>
      </div>
      <button onClick={next}>Next</button>
      <p>{index +1} of {Data.length } questions</p>
      {showHistory&& <div className="history">
        <i onClick={hideHistory} className="fa-solid fa-xmark"></i>
        <h4>Your History</h4>

        {!load? <div className='loading'>
          <div className='loading1'></div>
          <div className='loading2'></div>
          <div className='loading3'></div>
        </div> : <div className='scores'>
          {scoreHistory.length === 0? 
          <li>No history yet</li>:
          <ul>{scoreHistory.map((score,i)=>(
            <li key={i} style={{borderBottom: "2px solid white", padding:7, margin: 4, borderRadius:8}}>Your score: {score} <i onClick={()=>DeleteScore(i)} className="fa-solid fa-trash"></i></li>
          ))}</ul>
          
        }
        </div>}

        
      </div>}
      
    </div>
    
    :
    <div className="result">
    <p>Your score is {score}</p>
    <p>so you {score < Data.length /2? <span className='failed'>Failed</span>:<span className='passed'>Passed</span>}</p>
    <button onClick={restart}>Restart</button>
    </div>
  )
}

export default Quiz
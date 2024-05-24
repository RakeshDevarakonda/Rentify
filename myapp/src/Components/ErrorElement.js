import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ErrorElement() {
  const navigate = useNavigate();
  let [counter, setCounter] = useState(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',flexDirection:'column'}}>
      <h1 style={{textAlign:'center',marginBottom:'20px'}}>Bro, You Came To the Wrong Page</h1>
      <h5 style={{textAlign:'center'}}>Wait, I'll Redirect you in {counter} seconds...</h5>
    </div>
  );
}
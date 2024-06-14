import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './Register.css'

const Register = () => {

    const [username,setUsername]=useState("");
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [otp,setOtp]=useState("");
    const [confrimPassword,setConfrimPassword]=useState("");
    const [password,setPassword]=useState("");
    const [current,setCurrent]=useState("one");
    const [msg,setMsg]=useState("");
    const navigate=useNavigate();

    async function handlesubmit(){
        if(username==="" || name==="" || email==="" || otp==="" || password==="" || confrimPassword===""){
            setMsg("Every feild is Required");
        }
        else if(password!==confrimPassword){
            setMsg("passwords and confirm pass doesn't matching");
        }
        else{
            console.log(`${username} ${name} ${email}`);

            const response=await fetch("http://localhost:5000/auth/register/verifyotp",{
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({"username":username,"name":name,"email":email,"otp":otp,"password":password})
            });
            const res1=await response.json();

            setMsg(res1.message);
            console.log("entered")
        }
    }

    async function sendOtp(){
        if(username==="" || name==="" || email===""){
            setMsg("username name email feilds are required for Otp Required");
        }
        else{
            console.log(`${username} ${name} ${email}`);
            
            const response=await fetch("http://localhost:5000/auth/register/sendotp",{
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({"username":username,"email":email})
            });
            const res1=await response.json();

            if(await res1.message==="Account Successfully Registered"){
                navigate("/Login");
            }
            setMsg(res1.message);
        }
    }

  return (
    <div id='totalregisterbox'>
    <div className='registerbox'>

        <div className='regbox'>
            <h1 style={{margin:"0px",color:"rgb(83, 117, 226)"}}>REGISTRATION</h1>
            <input className='detailsbox' type="text"  onChange={e => {setMsg(""); setUsername(e.target.value)}} placeholder='Username'/>

            <input className='detailsbox' type="text" onChange={e => {setMsg("");setName(e.target.value)}} placeholder='Name'/>

            <input className='detailsbox' type="text" onChange={e => {setMsg("");setEmail(e.target.value)}} placeholder='Email'/><br></br>

            <button className='regbtn' onClick={sendOtp}>Send Otp</button><br></br>

            <input className='detailsbox' type="text"  onChange={e => {setMsg("");setOtp(e.target.value)}} placeholder='OTP'/>

            <input className='detailsbox' type="password" onChange={e => {setMsg("");setPassword(e.target.value)}} placeholder='password'/>

            <input className='detailsbox' type="password" onChange={e => {setMsg("");setConfrimPassword(e.target.value)}} placeholder='Confrim password'/>
            {msg.length>0?<div>
            <p style={{textAlign:"center",marginTop:"15px",marginBottom:"0px",fontSize:"14px"}}>{msg}</p>
            </div>:<></>}
            <br />
            <button className='regbtn ' onClick={handlesubmit}>Register</button>

            <p style={{fontSize:"14px",marginTop:"20px",fontWeight:"bold"}}>Already have a Account <Link style={{fontSize:"14px",marginTop:"20px",color:"rgb(83, 117, 226)",fontWeight:"bold"}} to="/Login">Log in</Link></p>
        </div>
    </div>
    </div>
  )
}

export default Register
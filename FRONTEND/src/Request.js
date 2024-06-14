import React, {useState ,useEffect} from 'react'
import { redirect, useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
import Title from './Title'
import './Request.css'

const Request = () => {

    const [skills,setskills]=useState("");
    const [description,setdes]=useState("");
    const [msg,setmsg]=useState("");
    const navigate=useNavigate();


    useEffect(() => {
        const fetchData = async () => {
          try {

            const response=await fetch("http://localhost:5000/profile/getprofile",{
            method:"get",
            credentials:"include",
                    headers:{
                        "Content-Type":"application/json"
                    }
            });
            const res=await response.json();
            let res1=await res;
            if(await res1.message==="Unauthorized"){
                navigate("/Login");
            }
          } catch (error) {
                navigate("/Login");
            console.error('Error fetching or parsing data:', error);
          }
        };
    
        fetchData();
    }, []);


    async function handlerequestsubmit(){
        try {
            if(skills==="" || description===""){
                setmsg("Both the skills and description are required fields");
                return;
            }

            const response=await fetch("http://localhost:5000/teamrequest/upload",{
            method:"post",
            credentials:"include",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({"skills":skills,"description":description})
            });
            const res=await response.json();
            let res1=await res;
            if(await res1.message==="Unauthorized"){
                navigate("/Login");
            }
            setmsg(await res1.message);
            setskills("");
            setdes("");
          } catch (error) {
            console.error('Error fetching or parsing data:', error);
          }
    }
  return (
    <>
    <NavBar />
    <Title />
    <div className='totalrequestbox'>
        <h1 style={{color:"rgb(83, 117, 226)",marginTop:"15px"}}>TEAM MEMBER REQUEST</h1>
        <input id='teamuploadbox' type="text" value={skills} onChange={(e)=>setskills(e.target.value)}  placeholder='enter skills and separate with Comma( , )'/>
        <textarea id='teamuploadarea' value={description} onChange={(e)=>setdes(e.target.value)} placeholder='Description'></textarea>
        <button id='uploadsubmitbtn' onClick={handlerequestsubmit}>Submit</button>
        <div>
            <p>{msg}</p>
        </div>
    </div>
    
    </>
  )
}

export default Request
import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import { useNavigate } from 'react-router-dom';
import './Search.css';
import Title from './Title';
import { domain } from "./Hostdata";

const Search = () => {

  const [searchbar,setsearchbar]=useState("");
  const [isverified,setverified]=useState(false);
  const navigate=useNavigate();
  const[userprofiles,setprofiles]=useState([]);
  const [nores,setnores]=useState("");


  function handleopen(uname){
    navigate("/DisplayProfile/"+uname);
  }

  async function searchskills(){
    if(!searchbar || searchbar==="")
        return;
    console.log("skills :"+searchbar);
      try{
        const response=await fetch(domain+"/profile/getprofiles/"+searchbar,{
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
          console.log("success");
          let currentUser=await res[0];
          console.log("ooo---"+await res[1]);
          if(!(await res[1])){
            setnores("No results found for the given skills");
            setprofiles([]);
          }
          else if(await res[1].length>0){
            setprofiles(await res[1]);
            setnores("");
          }

          console.log(userprofiles);
      } 
      catch (error) {
        console.error('Error fetching or parsing data:', error);
      }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      searchskills();
    }
  };

  return (
    <>
    <NavBar />
    <Title />
    <div className='boxforsearch'>
          <input className='searchinput' onKeyDown={handleKeyPress} type="text" value={searchbar} onChange={(e)=>setsearchbar(e.target.value)} placeholder='Enter skills' />
          <button className='searchbtn' onClick={searchskills}>Search</button>
    </div>
    <div className='totalprofilebox'>
            <div className='skillsboxforsearch'>
                  <center style={{marginRight:"60px"}}><p>{nores}</p></center>
            {
              userprofiles.map((e,k) => 
                                          <div className='profilebox'>
                                          <div className='dpbox'> 
                                            {e.profile_name?(<img id='dp'src={e.profile_name} alt="Error" />)
                                            :(<img id='dp'src={require("./logo.jpg")} alt="Error" />)}
                                          </div>
                                          <div className='detailbox'>
                                            <p>Name  : {e.name}</p>
                                            <p>Location  : {e.city},{e.state},{e.country}</p>
                                            <p>Skills  : {e.skill}</p>
                                            <button className='openbtn' onClick={()=>handleopen(e.username)}>open</button>
                                          </div>
                                          </div>
                                      )
            }
            </div>
      </div>
    </>)
}

export default Search
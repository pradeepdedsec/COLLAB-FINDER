import React, {useState ,useEffect} from 'react'
import { redirect, useNavigate } from 'react-router-dom'
import AdminNavBar from'./AdminNavBar'
import './AdminHome.css'
import AdminTitle from './AdminTitle';

const AdminHome = () => {

    const [name,setname]=useState("");
    const navigate=useNavigate();

    useEffect(() => {
        const fetchData = async () => {
          try {

            
            const response=await fetch("http://localhost:5000/admin/profile/getprofile",{
            method:"get",
            credentials:"include",
                    headers:{
                        "Content-Type":"application/json"
                    }
            });
            const res=await response.json();
            let res1=await res;
            if(await res1.message==="Unauthorized"){
                navigate("/AdminLogin");
            }
            setname(await res1.name);
            console.log("Success");
          } catch (error) {
              console.error('Error fetching or parsing data:', error);
              navigate("/AdminLogin");
          }
        };
    
        fetchData();
      }, []); 


      

  return (

        <div>
          <AdminNavBar />
          <AdminTitle />
           <div className='aouterhomebox'>
              <div className='atotalhomebox'>
                <div className='ahomebox'>
                  <p>Welcome to our collaborative project platform! Our platform is designed to 
                    facilitate seamless collaboration among students by providing a dedicated space 
                    for project development and team formation. With a focus on connecting students 
                    with complementary skills and interests, our platform aims to eliminate the challenges 
                    often associated with finding project collaborators.For administrators, our platform offers 
                    comprehensive tools for managing user accounts, monitoring user activity, and collecting feedback. 
                    Admins have the ability to track user accounts, oversee user messages, and review feedback submissions. 
                    Additionally, admins can take appropriate actions, such as deleting user accounts, to ensure a 
                    positive and productive environment for all users.</p>
                </div>
            </div>
            <div className='aimgboxdiv'>
            <img className='ahomeimg' src={require("./images/home-img.png")} alt="image" />
          </div>
          </div>
        </div>
  )
}

export default AdminHome;
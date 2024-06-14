import React, {useState ,useEffect} from 'react'
import { redirect, useNavigate } from 'react-router-dom'
import AdminNavBar from './AdminNavBar'
import './AdminFeedback.css'
import AdminTitle from './AdminTitle'

const AdminFeedback = () => {

    const [feeds,setfeeds]=useState([]);
    const [username,setusername]=useState("");
    const [msg,setmsg]=useState("");
    const navigate=useNavigate();


    useEffect(() => {
        const fetchData = async () => {
          try {

            const response=await fetch("http://localhost:5000/admin/feedback",{
            method:"get",
            credentials:"include",
                    headers:{
                        "Content-Type":"application/json"
                    }
            });
            const res=await response.json();
            let res1=await res;
            if(await res1.message==="Unauthorized"){
                console.log("unauth");
                navigate("/AdminLogin");
            }
            if(await res1){
                console.log("one");
                console.log(await res1);
                setfeeds(await res1);
            }
            else{
                console.log("two");
                navigate("/AdminLogin");
            }
            console.log("Success");
          } catch (error) {
            console.error('Error fetching or parsing data:', error);
            console.log("last");
            navigate("/AdminLogin");
          }
        };
    
        fetchData();
      }, []);


  return (
    <>
    <AdminNavBar />
    <AdminTitle />
    <div className='aouterbox'>
                          <div className='aupfeedbox'>
                              
                              <div className='afeed'>Feedbacks</div>
                          </div>
      {
      feeds.map((e,k) => <div className='afeedbox'>
                              <div className='auserbox'>{e.username}</div>
                              <div className='afeed'>{e.feedback}</div>
                          </div>)
      }
    </div>
    </>
  )
}

export default AdminFeedback
'use client'
import './Ex.scss';
import { useState,useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import API_URL from '@/config'
import ModalXp from './ModalXp/ModalXp'

interface xp{
    id: number;
    name : string;
    startDate : string;
    endDate : string;
}

interface RepeatClassNTimesProps {
    className: string;
    n: number;
    xpData: xp[];
  }

const Xp = () => {
  const [name,setName] = useState('')
  const [startDate,setStartDate] = useState('')
  const [endDate,setEndDate] = useState('')
  const [xpData,setXpData] = useState<xp[]>([])
  const [modalOpen, setModalOpen] = useState(false);

    const handleAddXp = async (e:any)  =>{
      e.preventDefault()
      const id = Cookies.get("id");
      axios.post(API_URL+'/api/v1/experiences', {
        "name": name,
        "startDate": startDate,
        "endDate": endDate,
        "candidate": {
          "id": id
        }
        }/*, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }*/)
        .then(function (response) {
          setXpData(prevXpData => [...prevXpData, response.data]);
        console.log(response);
        alert("Your post had been sent to admin ")
        })
        .catch(function (error) {
        alert(error.message);
        });
    }

    const handleDelete = async (e:any, id:number) =>{
      e.preventDefault()
      axios.delete(API_URL+'/api/v1/experiences/'+String(id))
       .catch(function (error) {
        console.log(error);
       });
       const updatedXpData = xpData.filter(xp => xp.id !== id)
       setXpData(updatedXpData)
    }

    const [currentId, setCurrentId] = useState(0);
    const [currentName, setCurrentName] = useState("");
    const [currentStartDate, setCurrentStartDate] = useState("");
    const [currentEndDate, setCurrentEndDate] = useState("");
    const handleApplyClick = (id:number, name:string, startDate: string, endDate:string) => {
      setCurrentId(id);
      setCurrentName(name);
      setCurrentStartDate(startDate);
      setCurrentEndDate(endDate);
      setModalOpen(true);
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            Cookies.set("id","1")
            const id = Cookies.get("id");
            const response = await axios.get(API_URL+'/api/v1/experiences/byCandidate/'+String(id));         
            setXpData(response.data);
          } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
          }
        };
        fetchData();
  }, []);

  const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, xpData }) => {
    if(xpData.length != 0)
      return(
        <>
        {xpData.map((xp) => (
          <div key={xp.id} className={className}>
          <h1>{xp.name} :</h1>
          <p>
            startDate: {xp.startDate}
          </p>
          <p>Close Date: {xp.endDate}</p>
          <button onClick={(e) => handleDelete(e, xp.id)}>Delete</button>
          <button onClick={() => handleApplyClick(xp.id, xp.name, xp.startDate, xp.endDate)}>Modify</button>
          <ModalXp isOpen={modalOpen} id={currentId} name={currentName} startDate={currentStartDate} endDate={currentEndDate} onClose={() => setModalOpen(false)} setXpData={setXpData} />
        </div>
        ))}
        </>
      )
    }

    return(
      <>
        
        <div className="jobs">
          <h1 id='add'>Add Experience</h1>
        <div className='add' id='addEx'>
              <label htmlFor="name">Name:</label>
              <input type="text" placeholder='Enter name project' value={name} onChange={(e) => setName(e.target.value)}/>
              <label htmlFor="startDate">Start Date:</label>
              <input 
              type="date" 
              id="startDate" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              />
              <label htmlFor="CloseDate">End Date:</label>
              <input 
              type="date" 
              id="CloseDate" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              />
            <button onClick={handleAddXp}>add xp</button>
        </div>
            <h1>Experiences</h1>
            <div className='lists'>
                  <RepeatClassNTimes className="list" n={xpData.length} xpData={xpData} />
            </div>
        </div>
      </>
    )
}

export default Xp;
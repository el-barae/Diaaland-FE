'use client'
import { useState,useEffect } from 'react';
import axios from 'axios';
import API_URL from '@/config'

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
  const [xpData,setXpData] = useState<xp[]>([])


    useEffect(() => {
        const fetchData = async () => {
          try {
            const token = localStorage.getItem("token");
            const id = localStorage.getItem("IDSelected");
            const response = await axios.get(API_URL+'/api/v1/profiles/experiences/byCandidate/'+String(id), {
              headers: {
                'Authorization': 'Bearer ' + token
              }
            });         
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
        </div>
        ))}
        </>
      )
    }

    return(
      <>   
        <div className="jobs">
            <h1>Experiences</h1>
            <div className='lists'>
                  <RepeatClassNTimes className="list" n={xpData.length} xpData={xpData} />
            </div>
        </div>
      </>
    )
}

export default Xp;
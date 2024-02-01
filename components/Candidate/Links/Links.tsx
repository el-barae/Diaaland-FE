'use client'
import './Links.scss'
import { useState,useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface education{
    id: number;
    name : string;
    startDate : string;
    endDate : string;
}

interface certificate{
    id: number;
    name: string;
}

interface link{
    id: number;
    url: string;
}

interface RepeatClassNTimesProps1 {
    className: string;
    n: number;
    educationsData: education[];
  }

const Links = () => {

    const handleAddEducation = async (e:any)  =>{
        e.preventDefault()
        const id = Cookies.get("id");
        axios.post('http://localhost:7777/api/v1/educations', {
          "name": name,
          "startDate": startDate,
          "endDate": endDate,
          }/*, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }*/)
          .then(function (response) {
          console.log(response);
          alert("Your post had been sent to admin ")
          })
          .catch(function (error) {
          alert(error.message);
          });
      }
  
      const handleDelete = async (e:any, id:number) =>{
        e.preventDefault()
        axios.delete('http://localhost:7777/api/v1/educations')
         .catch(function (error) {
          console.log(error);
         });
      }

    const [name,setName] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [educationsData,setEducationsData] = useState<education[]>([])

    const RepeatClassNTimes: React.FC<RepeatClassNTimesProps1> = ({ className, n, educationsData }) => {
        if(educationsData.length != 0)
          return(
            <>
            {educationsData.map((education) => (
              <div key={education.id} className={className}>
              <h1>{education.name} :</h1>
              <p>
                startDate: {education.startDate}
              </p>
              <p>Close Date: {education.endDate}</p>
              <button onClick={(e) => handleDelete(e, education.id)}>Delete</button>
            </div>
            ))}
            </>
          )
        }

        useEffect(() => {
            const fetchData = async () => {
              try {
                Cookies.set("id","1")
                const id = Cookies.get("id");
                const response = await axios.get('http://localhost:7777/api/v1/educations');         
                setEducationsData(response.data);
              } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
              }
            };
            fetchData();
      }, []);

    return(
        <>
            <div className="jobs">
                    <div className="education">
                        <h1>Education</h1>
                        <div className='add'>
                            <div className='part1'>
                                <label htmlFor="name">Name:</label>
                                <input type="text" placeholder='Enter name education' value={name} onChange={(e) => setName(e.target.value)}/>
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
                                <button onClick={handleAddEducation}>add education</button>
                            </div>
                            <div className='part2'>
                                <div className='lists' id='ls1'>
                                    <RepeatClassNTimes className="list" n={educationsData.length} educationsData={educationsData} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="certificats">
                        <h1>Certificates</h1>
                        <div className='add'>
                            <div className='part1'>
                                <label htmlFor="name">Name:</label>
                                <input type="text" placeholder='Enter name certificate' value={name} onChange={(e) => setName(e.target.value)}/>

                                <button onClick={handleAddEducation}>add certificate</button>
                            </div>
                            <div className='part2'>
                                <div className='lists' id='ls2'>
                                    <RepeatClassNTimes className="list" n={educationsData.length} educationsData={educationsData} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="others">
                        <h1>Other links</h1>
                        <div className='add'>
                            <div className='part1'>
                                <label htmlFor="name">Url:</label>
                                <input type="text" placeholder='Enter url' value={name} onChange={(e) => setName(e.target.value)}/>
                                <button onClick={handleAddEducation}>add link</button>
                            </div>
                            <div className='part2'>
                                <div className='lists' id='ls3'>
                                    <RepeatClassNTimes className="list" n={educationsData.length} educationsData={educationsData} />
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </>
    )
}

export default Links;
import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "@/config";

interface Message {
    id: number;
    email: string;
    subject: string;
    message: string;
    date: string;
  }

  interface RepeatClassNTimesProps {
    className: string;
    n: number;
    messagesData: Message[];
  }
  const token = localStorage.getItem("token");

  const handleDelete = async (e:any, idM:number) =>{
    e.preventDefault()
    var ID = localStorage.getItem("ID");
    axios.delete(API_URL+'/api/v1/messages/'+String(idM), {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
     .catch(function (error) {
      console.log(error);
     });
  }

  const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, messagesData }) => {
    if(messagesData.length != 0)
      return(
        <>
        {messagesData.map((m) => (
          <div key={m.id} className={className}>
          <h1>{m.subject} :</h1>
          <p>
            Email: {m.email} <br/> Date: {m.date} 
          </p>
          <p>Message: {m.message}</p>
          <button onClick={(e) => handleDelete(e, m.id)}>Delete</button>
        </div>
        ))}
        </>
      )
    }

const Messages = () =>{
    const [messagesData, setMessagesData] = useState<Message[]>([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(API_URL+'/api/v1/messages', {
              headers: {
                'Authorization': 'Bearer ' + token
              }
            });         
            setMessagesData(response.data);
          } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
          }
        };
        fetchData();
  }, []);
    
    return (
        <div className='jobs'>
        <h1>Messages</h1>
                <div className='lists'>
                  <RepeatClassNTimes className="list" n={messagesData.length} messagesData={messagesData} />
                </div>
         </div>
    );
}

export default Messages;
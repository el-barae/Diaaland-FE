import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "@/config";
import './Messages.scss'
import Modal from "./ModalMessages/ModalMessages"

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

const Messages = () =>{
    const [messagesData, setMessagesData] = useState<Message[]>([]);

    const handleDelete = async (e:any, idM:number) =>{
      e.preventDefault()
      var ID = localStorage.getItem("ID");
      try{
      axios.delete(API_URL+'/api/v1/messages/'+String(idM), {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      const updatedMessagesData = messagesData.filter(m => m.id !== idM)
          setMessagesData(updatedMessagesData)
      }catch(error) {
        console.log(error);
       };
    }

    const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, messagesData }) => {
      if(messagesData.length != 0)
        return(
          <>
          {messagesData.map((m) => (
            <div key={m.id} className={className}>
            <h1>{m.email}</h1>
            <p>
              Subject: {m.subject} <br/> Date: {m.date} 
            </p>
            <span> Message:</span>
            <p className="text ml-8">    {m.message}</p>
            <button onClick={(e) => handleDelete(e, m.id)}>Delete</button>
          </div>
          ))}
          </>
        )
      }

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(API_URL+'/api/v1/messages/recipient/DIAALAND', {
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

  const [modalOpen, setModalOpen] = useState(false);
  const handleAdd = () =>{
    setModalOpen(true);
  }
    
    return (
        <div className='panel'>
        <h1>Messages</h1>
        <button type="button" className="button" onClick={() => handleAdd()}>
          <span className="button__text">Add</span>
          <span className="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" height="24" fill="none" className="svg"><line y2="19" y1="5" x2="12" x1="12"></line><line y2="12" y1="12" x2="19" x1="5"></line></svg></span>
          </button>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}/>
                <div className='lists' id="messages">
                  <RepeatClassNTimes className="list" n={messagesData.length} messagesData={messagesData} />
                </div>
         </div>
    );
}

export default Messages;
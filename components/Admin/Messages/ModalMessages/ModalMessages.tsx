import React, { useState,useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import "../../jobs/ModalJobs/ModalJobs.scss";
import API_URL from "@/config";
import swal from "sweetalert";

interface Message {
  id: number;
  email: string;
  subject: string;
  message: string;
  date: string;
  recipient: string;
  view: boolean;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
  }

  export default function Modal({ isOpen, onClose}: ModalProps) {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [date, setDate] = useState('');
    const [recipient, setRecipient] = useState('');
    const router = useRouter();

    const toggleModal = () => {
      onClose();
    };

    const handleSend = async (e: any) => {
      e.preventDefault();
      const token = localStorage.getItem("token")
      axios
        .post(API_URL+'/api/v1/messages', {
          "email": "elfallous@gmail.com",
          "subject": subject,
          "message": message,
          "date": "2024-04-16T12:00:00",
          "recipient": recipient,
          "view": false
        }, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })
        .then(function (response) {
          swal('Email sent', '', 'success');
          onClose();
        })
        .catch(function (error) {
          swal('Email not send', '', 'error');
          console.log(error);
        });
    };

    useEffect(() => {
      if (isOpen) {
        document.body.classList.add('active-modal');
      } else {
        document.body.classList.remove('active-modal');
      }
  
      return () => {
        document.body.classList.remove('active-modal');
      };
    }, [isOpen]);
    

    return (
      <>
        {isOpen && (
          <div className="modal-jobs">
            <div onClick={toggleModal} className="overlay"></div>
              <button id="close-btn" onClick={toggleModal}>CLOSE</button>
              <div className="modal-content">
              <label htmlFor="subject">Subject:</label>
        <input
          type="text"
          id="subject"
          placeholder="Enter subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <label htmlFor="recipient">Recipient(email):</label>
        <input
          type="text"
          id="recipient"
          placeholder="Enter recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
  <button onClick={handleSend}>Send</button>
              </div>
          </div>
        )}
      </>
    );
  }
  
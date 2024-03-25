import React, { useState,useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./ModalJobs.scss";
import API_URL from "@/config";

interface Customer {
  id: number;
  name: string;
  email: string;
  address: string;
  city: string;
  country: string;
  description: string;
  logo: string;
}

interface ModalProps {
    isOpen: boolean;
    id: number;
    name: string;
    email: string;
    address: string;
    city: string;
    country: string;
    description: string;
    logo: string;
    onClose: () => void;
    setCustomerData: React.Dispatch<React.SetStateAction<Customer[]>>;
  }

  export default function Modal({ isOpen, id, name, email, address, city, country, description, logo, onClose, setCustomerData }: ModalProps) {
    const [McustomerId, setCustomerId] = useState(id);
    const [McustomerName, setCustomerName] = useState(name);
    const [McustomerEmail, setCustomerEmail] = useState(email);
    const [McustomerAddress, setCustomerAddress] = useState(address);
    const [McustomerCity, setCustomerCity] = useState(city);
    const [McustomerCountry, setCustomerCountry] = useState(country);
    const [McustomerDescription, setCustomerDescription] = useState(description);
    const [McustomerLogo, setCustomerLogo] = useState(logo);
    

    const toggleModal = () => {
      onClose();
    };

    const handleModifyCustomer = async (e: any) => {
      e.preventDefault();
      const idC = Cookies.get('id');
      axios
        .put(API_URL+'/api/v1/jobs/' + String(id), {
          id: id,
          name: McustomerName,
          email: McustomerEmail,
          address: McustomerAddress,
          city: McustomerCity,
          country: McustomerCountry,
          description: McustomerDescription,
          logo: McustomerLogo
        })
        .then(function (response) {
          setCustomerData(prevCData => {
            const updatedCData = prevCData.map(customer => {
              if (customer.id === id) {
                return {
                  ...customer,
                  name: McustomerName,
                  email: McustomerEmail,
                  address: McustomerAddress,
                  city: McustomerCity,
                  country: McustomerCountry,
                  description: McustomerDescription,
                  logo: McustomerLogo
                };
              }
              return customer;
            });
            return updatedCData;
          });
          onClose();
        })
        .catch(function (error) {
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

    const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCustomerName(value);
    };
    
    const handleCustomerEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCustomerEmail(value);
    };
    
    const handleCustomerAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCustomerAddress(value);
    };
    
    const handleCustomerCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCustomerCity(value);
    };
    
    const handleCustomerCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCustomerCountry(value);
    };
    
    const handleCustomerDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setCustomerDescription(value);
    };
    
    const handleCustomerLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCustomerLogo(value);
    };
    

    return (
      <>
        {isOpen && (
          <div className="modal-jobs">
            <div onClick={toggleModal} className="overlay"></div>
              <button id="close-btn" onClick={toggleModal}>CLOSE</button>
              <div className="modal-content">
              <label htmlFor="customerName">Customer Name:</label>
  <input type="text" id="customerName" placeholder="Enter customer name" value={McustomerName} onChange={(e) => setCustomerName(e.target.value)} />
  <label htmlFor="customerEmail">Customer Email:</label>
  <input type="email" id="customerEmail" placeholder="Enter customer email" value={McustomerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
  <label htmlFor="customerAddress">Customer Address:</label>
  <input type="text" id="customerAddress" placeholder="Enter customer address" value={McustomerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />
  <label htmlFor="customerCity">Customer City:</label>
  <input type="text" id="customerCity" placeholder="Enter customer city" value={McustomerCity} onChange={(e) => setCustomerCity(e.target.value)} />
  <label htmlFor="customerCountry">Customer Country:</label>
  <input type="text" id="customerCountry" placeholder="Enter customer country" value={McustomerCountry} onChange={(e) => setCustomerCountry(e.target.value)} />
  <label htmlFor="customerDescription">Customer Description:</label>
  <textarea className="desc" id="customerDescription" placeholder="Enter customer description" value={McustomerDescription} onChange={(e) => setCustomerDescription(e.target.value)} />
  <label htmlFor="customerLogo">Customer Logo:</label>
  <input type="text" id="customerLogo" placeholder="Enter customer logo URL" value={McustomerLogo} onChange={(e) => setCustomerLogo(e.target.value)} />
  <button onClick={handleModifyCustomer}>Modify Customer</button>
              </div>
          </div>
        )}
      </>
    );
  }
  
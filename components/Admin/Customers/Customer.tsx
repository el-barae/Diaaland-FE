'use client'
import './Customers.scss'
import { useState ,useEffect} from "react"
import axios from 'axios'
import React from 'react';
import API_URL from '@/config'
import Modal from './ModalCustomers/ModalCustomers';

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

  interface RepeatClassNTimesProps {
    className: string;
    n: number;
    customersData: Customer[];
  }

    const handleDelete = async (e:any, idC:number) =>{
      e.preventDefault()
      axios.delete(API_URL+'/api/v1/customers'+'/'+String(idC))
       .catch(function (error) {
        console.log(error);
       });
    }

const Customers = () =>{
    const [customersData, setCustomersData] = useState<Customer[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
const [customerId, setCustomerId] = useState(0); 
const [customerName, setCustomerName] = useState('');
const [customerEmail, setCustomerEmail] = useState('');
const [customerAddress, setCustomerAddress] = useState('');
const [customerCity, setCustomerCity] = useState('');
const [customerCountry, setCustomerCountry] = useState('');
const [customerDescription, setCustomerDescription] = useState('');
const [customerLogo, setCustomerLogo] = useState('');

const handleModifyClick = (e:any, id:number, name:string, email:string, address:string, city:string, country:string, description:string, logo:string) => {
  setCustomerId(id);
  setCustomerName(name);
  setCustomerEmail(email);
  setCustomerAddress(address);
  setCustomerCity(city);
  setCustomerCountry(country);
  setCustomerDescription(description);
  setCustomerLogo(logo);
  setModalOpen(true);
};

const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, customersData }) => {
  if(customersData.length != 0)
    return(
      <>
      {customersData.map((c) => (
        <div key={c.id} className={className}>
        <h1>{c.name} :</h1>
        <p>
          Description: {c.description}</p>
        <button onClick={(e) => handleDelete(e, c.id)}>Delete</button>
        <button onClick={(e) => handleModifyClick(e, c.id, c.name, c.email, c.address, c.city, c.country, c.description, c.logo)}>Modify</button>
        <Modal isOpen={modalOpen} id={customerId} name={customerName} email={customerEmail} address={customerAddress} city={customerCity} country={customerCountry} description={customerDescription} logo={customerLogo} onClose={() => setModalOpen(false)} setCustomerData={setCustomersData} />
      </div>
      ))}
      </>
    )
  }

    useEffect(() => {
        const fetchData = async () => {
          try{
            const response = await axios.get(API_URL+'/api/v1/customers');         
            setCustomersData(response.data);
          } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
          }
        };
        fetchData();
  }, []);

  return(
    <>
    <div className='jobs'>
        <h1>Customers</h1>
                <div className='lists'>
                  <RepeatClassNTimes className="list" n={customersData.length} customersData={customersData} />
                </div>
    </div>
    </>
  );
}
export default Customers;
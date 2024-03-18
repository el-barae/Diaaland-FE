'use client'
import './Customers.scss'
import { useState ,useEffect} from "react"
import axios from 'axios'
import React from 'react';
import API_URL from '@/config'

interface Customer {
    id: number;
    name: string;
    description: string;
  }

  interface RepeatClassNTimesProps {
    className: string;
    n: number;
    customersData: Customer[];
  }

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
        </div>
        ))}
        </>
      )
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
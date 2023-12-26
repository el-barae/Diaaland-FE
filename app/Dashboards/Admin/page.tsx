'use client'
import Image from 'next/image'
import { useState ,useEffect} from "react"
import axios from 'axios'
import React from 'react';
import Cookies from 'js-cookie';
import './style.scss';
import {ThemeProvider} from 'next-themes'
import Navbar from '@/components/HomePage/Navbar/Navbar'

const Admin = () =>{
    return (
        <ThemeProvider enableSystem={true} attribute="class">
            <Navbar/>
            <h1>Page Admin</h1>
        </ThemeProvider>
    );
}
  
  export default Admin;


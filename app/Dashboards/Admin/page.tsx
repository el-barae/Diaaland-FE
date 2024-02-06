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
            <div className="admin">
    <div className="navigation">
        <ul>
            <li>
                <a href="#">
                    <span className="title">Brand Name</span>
                </a>
            </li>

            <li>
                <a href="#">
                    <span className="title">Dashboard</span>
                </a>
            </li>

            <li>
                <a href="#">
                    <span className="title">Customers</span>
                </a>
            </li>

            <li>
                <a href="#">
                    <span className="title">Messages</span>
                </a>
            </li>

            <li>
                <a href="#">
                    <span className="title">Help</span>
                </a>
            </li>

            <li>
                <a href="#">
                    <span className="title">Settings</span>
                </a>
            </li>

            <li>
                <a href="#">
                    <span className="title">Password</span>
                </a>
            </li>

            <li>
                <a href="#">
                    <span className="title">Sign Out</span>
                </a>
            </li>
        </ul>
    </div>
    <div className="main">
        <div className="topbar">

            <div className="search">
                <label>
                    <input type="text" placeholder="Search here"></input>
                </label>
            </div>

            <div className="user">
            </div>
        </div>

        <div className="cardBox">
            <div className="card">
                <div>
                    <div className="numbers">1,504</div>
                    <div className="cardName">Daily Views</div>
                </div>
            </div>

            <div className="card">
                <div>
                    <div className="numbers">80</div>
                    <div className="cardName">Sales</div>
                </div>
            </div>

            <div className="card">
                <div>
                    <div className="numbers">284</div>
                    <div className="cardName">Comments</div>
                </div>
            </div>

            <div className="card">
                <div>
                    <div className="numbers">$7,842</div>
                    <div className="cardName">Earning</div>
                </div>
            </div>
        </div>

        <div className="details">
            <div className="recentOrders">
                <div className="cardHeader">
                    <h2>Recent Orders</h2>
                    <a href="#" className="btn">View All</a>
                </div>

                <table>
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Price</td>
                            <td>Payment</td>
                            <td>Status</td>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>Star Refrigerator</td>
                            <td>$1200</td>
                            <td>Paid</td>
                            <td><span className="status delivered">Delivered</span></td>
                        </tr>

                        <tr>
                            <td>Dell Laptop</td>
                            <td>$110</td>
                            <td>Due</td>
                            <td><span className="status pending">Pending</span></td>
                        </tr>

                        <tr>
                            <td>Apple Watch</td>
                            <td>$1200</td>
                            <td>Paid</td>
                            <td><span className="status return">Return</span></td>
                        </tr>

                        <tr>
                            <td>Addidas Shoes</td>
                            <td>$620</td>
                            <td>Due</td>
                            <td><span className="status inProgress">In Progress</span></td>
                        </tr>

                        <tr>
                            <td>Star Refrigerator</td>
                            <td>$1200</td>
                            <td>Paid</td>
                            <td><span className="status delivered">Delivered</span></td>
                        </tr>

                        <tr>
                            <td>Dell Laptop</td>
                            <td>$110</td>
                            <td>Due</td>
                            <td><span className="status pending">Pending</span></td>
                        </tr>

                        <tr>
                            <td>Apple Watch</td>
                            <td>$1200</td>
                            <td>Paid</td>
                            <td><span className="status return">Return</span></td>
                        </tr>

                        <tr>
                            <td>Addidas Shoes</td>
                            <td>$620</td>
                            <td>Due</td>
                            <td><span className="status inProgress">In Progress</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="recentCustomers">
                <div className="cardHeader">
                    <h2>Recent Customers</h2>
                </div>

                <table>
                    <tr>
                        <td width="60px">
                            <div className="imgBx"></div>
                        </td>
                        <td>
                            <h4>David <br/> <span>Italy</span></h4>
                        </td>
                    </tr>

<tr>
    <td width="60px">
        <div className="imgBx"></div>
    </td>
    <td>
        <h4>Amit <br/> <span>India</span></h4>
    </td>
</tr>

<tr>
    <td width="60px">
        <div className="imgBx"></div>
    </td>
    <td>
        <h4>David <br/> <span>Italy</span></h4>
    </td>
</tr>

<tr>
    <td width="60px">
        <div className="imgBx"></div>
    </td>
    <td>
        <h4>Amit <br/> <span>India</span></h4>
    </td>
</tr>

<tr>
    <td width="60px">
        <div className="imgBx"></div>
    </td>
    <td>
        <h4>David <br/> <span>Italy</span></h4>
    </td>
</tr>

<tr>
    <td width="60px">
        <div className="imgBx"></div>
    </td>
    <td>
        <h4>Amit <br/> <span>India</span></h4>
    </td>
</tr>

<tr>
    <td width="60px">
        <div className="imgBx"></div>
    </td>
    <td>
        <h4>David <br/> <span>Italy</span></h4>
    </td>
</tr>

<tr>
    <td width="60px">
        <div className="imgBx"></div>
    </td>
    <td>
        <h4>Amit <br/> <span>India</span></h4>
    </td>
</tr>
</table>
</div>
</div>
</div>
</div>


        </ThemeProvider>
    );
}
  
  export default Admin;


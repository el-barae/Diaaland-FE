'use client';
import { useState, useEffect, useRef } from 'react';
import './Profile.scss';
import axios from 'axios';
import Image from 'next/image';
import RegisterImg from '@/public/images/registeration.png';
import API_URL from '@/config';

type Candidate = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    city: string;
    country: string;
    address: string;
    accountStatus: string;
    phoneNumber: string;
    jobStatus: string;
    expectedSalary: string;
    linkedIn: string;
    gitHub: string;
    portfolio: string;
    blog: string;
    description: string;
    resumeLink?: string;
    photoLink?: string;
};

const Profile = () => {
    const [candidate, setCandidate] = useState<Candidate>({
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
        city: '',
        country: '',
        address: '',
        accountStatus: '',
        phoneNumber: '',
        jobStatus: '',
        expectedSalary: '',
        linkedIn: '',
        gitHub: '',
        portfolio: '',
        blog: '',
        description: '',
        resumeLink: '',
        photoLink: ''
    });

    const [resumeURL, setResumeURL] = useState<string | null>(null);
    const [photoURL, setPhotoURL] = useState<string | null>(null);

    useEffect(() => {
        const fetchCandidate = async () => {
            const id = localStorage.getItem('IDSelected');
            const token = localStorage.getItem('token');
            if (!id || !token) {
                console.error('ID or token is missing');
                return;
            }

            try {
                const response = await axios.get<Candidate>(API_URL + `/api/v1/candidates/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setCandidate(response.data);
                setResumeURL(API_URL + `/api/v1/candidates/resumefile/${id}`);
                setPhotoURL(API_URL + `/api/v1/candidates/image/${id}`);
            } catch (error) {
                console.error('Error fetching candidate data:', error);
            }
        };

        fetchCandidate();
    }, []);

	const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [resumeName, setResumeName] = useState<string>('');
    const resumeInputRef = useRef<HTMLInputElement | null>(null);

    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoName, setPhotoName] = useState<string>('');
    const photoInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const fetchResumeFile = async () => {
            const token = localStorage.getItem('token');
            if (!token || !resumeURL) {
                return;
            }

            try {
                const response = await fetch(resumeURL, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const blob = await response.blob();
                const fileName = String(candidate.resumeLink); 
                const file = new File([blob], String(fileName.split('/').pop()), { type: 'application/pdf' });
                setResumeFile(file);
                setResumeName(file.name);
            } catch (error) {
                console.error('Error fetching resume file:', error);
            }
        };

        fetchResumeFile();
    }, [resumeURL]);

    const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);

    useEffect(() => {
      const fetchPhotoFile = async () => {
        const token = localStorage.getItem('token');
        if (!token || !photoURL) {
            return;
        }
    
        try {
            console.log('Fetching photo file with token:', token);
            const response = await fetch(photoURL, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            console.log('Photo file fetch response:', response);
    
            if (!response.ok) {
                console.error('Error fetching photo file - response not ok:', response);
                throw new Error('Network response was not ok');
            }
            
            const blob = await response.blob();
            setPhotoBlob(blob);
            const fileName = String(candidate.photoLink); 
            const file = new File([blob], String(fileName.split('/').pop()) , { type: 'image/jpeg' });
            setPhotoFile(file);
            setPhotoName(file.name);
        } catch (error) {
            console.error('Error fetching photo file:', error);
        }
    };    
  
      fetchPhotoFile();
  }, [photoURL]);

    return (
        <div className="form-candidate">
            <div className='div1'>
                <h1>Profile</h1>
                <br />
                <label>First name</label>
                <p>{candidate.firstName}</p>

                <label>Last name</label>
                <p>{candidate.lastName}</p>

                <label>Email</label>
                <p>{candidate.email}</p>

                <div className="nation">
                    <label>City</label>
                    <p>{candidate.city}</p>

                    <label>Country</label>
                    <p>{candidate.country}</p>
                </div>

                <div className="url-address">
                    <label>Address</label>
                    <p>{candidate.address}</p>
                </div>

                <label>Account status</label>
                <p>{candidate.accountStatus}</p>

                <label>Phone</label>
                <p>{candidate.phoneNumber}</p>

                <label>Job status</label>
                <p>{candidate.jobStatus}</p>
            </div>

            <div className='div2'>
                <label>Expected salary</label>
                <p>{candidate.expectedSalary}</p>

                <label>LinkedIn</label>
                <p>{candidate.linkedIn}</p>

                <label>GitHub</label>
                <p>{candidate.gitHub}</p>

                <label>Portfolio</label>
                <p>{candidate.portfolio}</p>

                <label>Blog</label>
                <p>{candidate.blog}</p>

                <label>Description</label>
                <p>{candidate.description}</p>

                <div className="upload-section">
                <label htmlFor="image">Image</label>
                    <input
                        type="file"
                        ref={photoInputRef}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                    <div>
                    {photoBlob ? (
                    <img
                        src={URL.createObjectURL(photoBlob)}
                        alt="Candidate Photo"
                        style={{ marginLeft: '40px', borderRadius: '20px', width: '250px', height: '280px' }}
                    />
                    ) : (
                   <p>not have image profile</p>
                    )}
                    </div>

                </div>
            <div className="upload-section">
                <label htmlFor="resume">Resume CV</label>
                    <input
                        type="file"
                        ref={resumeInputRef}
                        accept=".pdf,.doc,.docx"
                        style={{ display: 'none' }}
                    />
                    <div >
                        {resumeName ? resumeName : 'not have Resume'}
                    </div>
					{resumeName && (
        	<div>
          		<a style={{backgroundColor: 'rgb(108, 162, 209)', color: 'white', padding:'5px', borderRadius: '15px'}} href={URL.createObjectURL(resumeFile!)} download={resumeName}>
            		Download
          		</a>
        	</div>)}
            </div>
		</div>


            <div className="div-image">
                <Image
                    src={RegisterImg}
                    width={400}
                    height={600}
                    alt="register image"
                />
            </div>
        </div>
    );
};

export default Profile;

'use client'
import { useState, useRef, useEffect, useContext, useCallback } from 'react';
import '../../../app/(accounts)/register/style.scss';
import './Profile.scss'
import Image from 'next/image'
import RegisterImg from '@/public/images/registeration.png'
import axios from 'axios';
import swal from 'sweetalert';
import API_URL from '@/config';
import { CustomerContext } from '../../../app/Dashboards/Customer/page';

type Customer = {
    id: number,
    name: string,
    email: string,
    address: string,
    city: string,
    country: string,
    phoneNumber: string,
    url: string,
    description: string,
    logo?: string
}

const Profile = () => {
    const { token, customerId } = useContext(CustomerContext);
    const [customer, setCustomer] = useState<Customer>({
        id: 0,
        name: '',
        email: '',
        address: '',
        city: '',
        country: '',
        phoneNumber: '',
        url: '',
        description: '',
        logo: ''
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoBlob, setLogoBlob] = useState<Blob | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const logoInputRef = useRef<HTMLInputElement | null>(null);

    // Optimized file fetch
    const fetchLogoFile = useCallback(async () => {
        if (!token || !customerId) return;

        try {
            const response = await fetch(`${API_URL}/api/v1/users/customers/logo/${customerId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to fetch logo');

            const blob = await response.blob();
            setLogoBlob(blob);
            
            const fileName = customer.logo ? String(customer.logo.split('/').pop()) : 'logo.jpg';
            const file = new File([blob], fileName, { type: blob.type });
            setLogoFile(file);
        } catch (error) {
            console.error('Error fetching logo:', error);
        }
    }, [token, customerId, customer.logo]);

    // Fetch customer data only once
    useEffect(() => {
        if (!customerId || !token) return;

        const fetchCustomer = async () => {
            setIsLoading(true);

            try {
                const response = await axios.get<Customer>(
                    `${API_URL}/api/v1/users/customers/${customerId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                setCustomer(response.data);

                // Fetch logo if available
                if (response.data.logo) {
                    await fetchLogoFile();
                }
            } catch (error) {
                console.error('Error fetching customer data:', error);
                swal("Failed to load profile", "", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCustomer();
    }, [customerId, token]); // Removed fetchLogoFile from dependencies

    // Optimized handlers
    const handleFileSelect = useCallback((inputRef: React.RefObject<HTMLInputElement>) => {
        inputRef.current?.click();
    }, []);

    const handleLogoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            setLogoBlob(file);
        }
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCustomer(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    // Optimized upload
    const uploadLogo = useCallback(async (file: File | null): Promise<string | null> => {
        if (!file || !token || !customerId) return null;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post<string>(
                `${API_URL}/api/v1/users/files/uploadLogo/${customerId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error uploading logo:', error);
            return null;
        }
    }, [token, customerId]);

    // Optimized submit handler
    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!token || !customerId) {
        swal("Authentication required", "", "error");
        return;
    }

    setIsSaving(true);

    try {
        let logoUrl = customer.logo;

        // 1️⃣ Upload du logo si changé
        if (logoFile && logoBlob !== null) {
            const formData = new FormData();
            formData.append("file", logoFile);

            const uploadResponse = await axios.post(
                `${API_URL}/api/v1/users/uploadLogo/${customerId}`,
                formData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            logoUrl = uploadResponse.data; // le nom du fichier retourné
        }

        // 2️⃣ Mettre à jour le reste du profil
        const updateResponse = await axios.put(
            `${API_URL}/api/v1/users/customers/${customerId}`,
            {
                ...customer,
                logo: logoUrl
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        setCustomer(prev => ({ ...prev, logo: logoUrl }));

        swal("Profile updated successfully!", "", "success");
    } catch (error) {
        console.error("Error updating profile:", error);
        swal("Failed to update profile.", "", "error");
    } finally {
        setIsSaving(false);
    }
}, [token, customerId, customer, logoFile, logoBlob]);


    // Loading state
    if (isLoading) {
        return (
            <div className="form-candidate">
                <div className="loading-state">Loading profile...</div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="form-candidate">
            <div className="div1">
                <h1>Profile</h1>
                <br />
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter your name"
                    value={customer.name}
                    onChange={handleInputChange}
                />
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    value={customer.email}
                    onChange={handleInputChange}
                    required
                />
                <label htmlFor="address">Address</label>
                <input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Enter your address"
                    value={customer.address}
                    onChange={handleInputChange}
                />
                <label htmlFor="city">City</label>
                <input
                    type="text"
                    name="city"
                    id="city"
                    placeholder="Enter your city"
                    value={customer.city}
                    onChange={handleInputChange}
                />
                <label htmlFor="country">Country</label>
                <input
                    type="text"
                    name="country"
                    id="country"
                    placeholder="Enter your country"
                    value={customer.country}
                    onChange={handleInputChange}
                />
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    placeholder="Enter your phone number"
                    value={customer.phoneNumber}
                    onChange={handleInputChange}
                />
                <label htmlFor="url">Website URL</label>
                <input
                    type="text"
                    name="url"
                    id="url"
                    placeholder="Enter your website URL"
                    value={customer.url}
                    onChange={handleInputChange}
                />
            </div>
            
            <div className="div2">
                <label htmlFor="description">Description</label>
                <textarea
                    name="description"
                    id="description"
                    placeholder="Enter a description"
                    value={customer.description}
                    onChange={handleInputChange}
                ></textarea>
                
                <label htmlFor="logo">Logo</label>
                <input
                    type="file"
                    ref={logoInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleLogoChange}
                />
                <div 
                    onClick={() => handleFileSelect(logoInputRef)} 
                    style={{ cursor: 'pointer', textAlign: 'center' }}
                >
                    {logoBlob ? (
                        <img
                            src={URL.createObjectURL(logoBlob)}
                            alt="Customer Logo"
                            style={{ 
                                marginLeft: '40px', 
                                borderRadius: '20px', 
                                width: '200px', 
                                height: '220px',
                                objectFit: 'cover'
                            }}
                        />
                    ) : (
                        <button
                            type="button"
                            onClick={() => handleFileSelect(logoInputRef)}
                            style={{ backgroundColor: 'rgb(108, 162, 209)' }}
                        >
                            Choose Logo
                        </button>
                    )}
                </div>

                <button type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Modify'}
                </button>
            </div>
            
            <div className="div-image">
                <Image
                    src={RegisterImg}
                    width={400}
                    height={600}
                    alt="register image"
                />
            </div>
        </form>
    );
};

export default Profile;
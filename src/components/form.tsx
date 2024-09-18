"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';

const FormPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [code, setCode] = useState("");
  const [formCode, setFormCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedDay: any = localStorage.getItem("day");
    const currentDay = new Date().getDate(); 

    if (storedToken === `458-965-778-669-887-${storedDay}` && storedDay == currentDay) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault(); 

    try {
      const response = await axios.post('/api/admin', { email: username, password });
      setCode(response.data.code);
    } catch (error) {
      setError('تسجيل الدخول غير صالح');
      console.error(error);
    }
  };

  const handleVerifyCode = () => {
    if (formCode === code) {
      const currentDay = new Date().getDate();
      localStorage.setItem("code" , code as any)
      localStorage.setItem("token", `${code}-${currentDay}`);
      localStorage.setItem("day", currentDay.toString());
      setIsAuthenticated(true);
    }
  };

  // دالة لإرسال بيانات الفيديو إلى API
  const handleVideoSubmit = async () => {
    try {
      await axios.post('/api/send', { url, title , code : localStorage.getItem("code") });
      alert('تم إرسال الفيديو بنجاح');
    } catch (error) {
      console.error('Error sending video:', error);
      alert('حدث خطأ أثناء إرسال الفيديو');
    }
  };

  if (isAuthenticated) {
    return (
      <div dir='rtl' className='h-screen w-full flex justify-center items-center flex-col p-5'>
        <Card className='w-1/2 p-5'>
          <CardHeader>
            <CardTitle>
              انشاء فيديو
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Input 
              className='mt-5' 
              placeholder='URL' 
              value={url}
              onChange={(e) => setUrl(e.target.value)} // تحديث حالة URL
            />
            <Input 
              className='mt-5' 
              placeholder='العنوان' 
              type='text' 
              value={title}
              onChange={(e) => setTitle(e.target.value)} // تحديث حالة title
            />
          </CardContent>

          <CardFooter>
            <Button onClick={handleVideoSubmit}>
              نشر
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div dir='rtl' className='h-screen w-full flex justify-center items-center flex-col p-5'>
      <Card className='w-1/2 p-5'>
        <CardHeader>
          <CardTitle>
            تسجيل الدخول
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Input 
            className='mt-5' 
            placeholder='username' 
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
          />
          <Input 
            className='mt-5' 
            placeholder='password' 
            type='password' 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />

          {code === "" ? (
            <div></div>
          ) : (
            <div>
              <Input 
                placeholder='code' 
                onChange={(e) => setFormCode(e.target.value)} 
              />
              <Button onClick={handleVerifyCode}>
                تحقق
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button onClick={handleSubmit}>
            تسجيل الدخول
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default FormPage;

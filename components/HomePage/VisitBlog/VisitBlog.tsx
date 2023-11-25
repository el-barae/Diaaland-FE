import React from 'react'
import Link from 'next/link'
import { RxArrowTopRight } from 'react-icons/rx'
import './VisitBlog.scss'

export default function VisitBlog() {
  return (
    <div className='blog'>
      <div className="container">
        <h3>Want to Empowere Careers and Transforme IT Recruitment</h3>
        <div className="blog-content">
          <p>Explore captivating stories, expert advice, and cutting-edge strategies to drive career growth and transform the IT recruitment landscape</p>
          <Link href="#" >
            Visit Blog
            <RxArrowTopRight />
          </Link>
        </div>
      </div>
    </div>
  )
}

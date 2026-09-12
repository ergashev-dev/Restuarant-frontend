import React, { useEffect, useState } from 'react'
import { getCategories } from '../services/categariosService'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export default function Home() {

  return (
    <div>
        <Navbar />
        <Sidebar />
    </div>
  )
}

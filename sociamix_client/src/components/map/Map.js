import React, { useEffect, useState } from 'react'
import Navbar from '../navbar/Navbar'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import './map.css'


export default function Map() {

  return (
    <div className="App">
      <Navbar />
      <MapContainer center={[48.583, 7.75]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

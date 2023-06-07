import React, { useEffect, useState } from 'react'
import leo from '../../assets/leo.jpg'
import './profil.css'
import background from '../../assets/background.jpg'
import { Check, Close, Edit, PersonAdd, PersonRemove, Send } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import api from '../../api/api'

export default function Profil({ userId, type }) {

  const myProfile = useSelector((state) => state.user)

  const [userDetails, setUserDetails] = useState(undefined)
  const [friendsList, setFriendsList] = useState([])
  const [isFriend, setIsFriend] = useState(false);
  const [isEditing, setIsEditing] = useState(false)
  const [description, setDescription] = useState("")

  const { id } = useParams();

  function getProfil() {
    api.get('/api/users/' + id)
      .then(res => {
        setUserDetails(res.data)
        setFriendsList(res.data.friends)
        setIsFriend(res.data.friends.includes(myProfile?._id))
        setDescription(res.data.desc)
      }
      )
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getProfil()
  }, [id, myProfile?._id])


  function addRemoveFriend() {
    if (!isFriend) {
      api.put('/api/users/' + id + '/follow')
        .then(res => {
          setIsFriend(true)
          setFriendsList([...friendsList, myProfile?._id])

        })
        .catch(err => console.log(err))
    } else {
      api.put('/api/users/' + id + '/unfollow')
        .then(res => {
          setIsFriend(false)
          setFriendsList(friendsList.filter((friend) => friend !== myProfile?._id))
        })
        .catch(err => console.log(err))
    }
  }

  function sendAndClose() {
    api.put('/api/users/' + myProfile._id, { desc: description })
      .then(res => {
        setIsEditing(false)
        getProfil()
      }
      )
      .catch(err => console.log(err))

  }











  return (
    <div className='profil'>
      <div className="profil_header">
        <img src={"/assets/" + userDetails?.coverPicture} alt="background" className="profil_header_background" />
        <img src={"/assets/" + userDetails?.profilePicture} alt="profilpicture" className="profil_header_photo" />
        <div className="profil_infos">
          <div className="profil_header_name">{`${userDetails?.firstName} ${userDetails?.name}`}

            {myProfile?._id === id && isEditing === false ?
              <button className='profil_header_button' onClick={() => setIsEditing(true)}><Edit /></button>
              :
              myProfile?._id === id && isEditing === true
                ?
                <><button className='profil_header_button' onClick={() => setIsEditing(false)}><Close /></button> <button className='profil_header_button' onClick={() => sendAndClose()}><Check /></button></>
                :
                null
            } {myProfile?._id === id ? null : !isFriend ? <button className='profil_header_button' onClick={addRemoveFriend}><PersonAdd /></button> : <button className='profil_header_button' onClick={addRemoveFriend}><PersonRemove /></button>} </div>
          <div className="profil_header_stats">{friendsList.length} friend(s)</div>
          {isEditing ? <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} /> : <div className="profil_header_description">{userDetails?.desc}</div>}
        </div>
      </div>
    </div>
  )
}

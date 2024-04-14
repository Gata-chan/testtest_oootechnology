import React, { useState } from 'react'
import './CreateStyles.scss'
import PathNavComponent from '../../components/pathNav/PathNavComponent.tsx'
import { Avatar, Button, FormControl, Input, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material'
import staticavatar from '../../components/static/images/animal_static.jpg'
import { CloudArrowUp } from 'react-bootstrap-icons'
import { useAddUserMutation, useGetFoodsQuery } from '../../api/apiSlice.ts'
import * as Yup from 'yup'

function CreatePage(props) {
    const [formEntries, setFormEntries] = useState ({
        username: '',
        email: '',
        birthdate: '',
        favorite_food_ids: [],
        upload_photo: {}
    })
    const [file, setFile] = useState(undefined);
    const [imgData, setImgData] = useState(staticavatar);
    const [addUser, userObject] = useAddUserMutation();

    const [errors, setErrors] = useState({})
    var formData = new FormData()

    const {
        data:foods,
        isLoading:isFoodsLoading
    } = useGetFoodsQuery()

    const handleOnChange = event => {
        const { name, value } = event.target;
        setFormEntries({ ...formEntries, [name]: value });
    };

    const handlePhoto = e => {
        if (e.target.files[0]) {
            setFile(e.target.files[0])
            const reader = new FileReader();
            reader.addEventListener("load", () => {
              setImgData(reader.result);
              
            });
            reader.readAsDataURL(e.target.files[0]);
            
        }
    }

    const validationSchema = Yup.object({
        "username":Yup.string().required("Username is required"),
        "email":Yup.string().email("Invalid Email").required("Email is required"),
        "birthdate":Yup.date().required("Birthdate is required")
    })

    async function handleSubmit() {
        setFormEntries({...formEntries, upload_photo: file})
        var isValid = false

        formData.append("username",formEntries.username)
        formData.append("email", formEntries.email)
        formData.append("birthdate", formEntries.birthdate.split('-').reverse().join('.'))
        formData.append("favorite_food_ids", formEntries.favorite_food_ids)
        formData.append("upload_photo", file)
        setErrors({})
        
        try {
            await validationSchema.validate(formEntries, {abortEarly:false})
            isValid = validationSchema.isValidSync(formEntries, {abortEarly:false})
            if (isValid) {
                const res = await addUser(formData).unwrap()
                window.location.replace(`/user/view/${res.id}`)
            }
        } catch (error) {
            
            const newError = {}
            
            error.inner.forEach((err)=> {
                newError[err.path] = err.message
            })
            
            setErrors(newError)
            
        }
        
        /*  */
    }

  return (
    <div className='create-page'>
        <div className='create-page-nav'>
            <PathNavComponent path={'Users / Create'}/>
        </div>
        <div className='create-page-form'>
            <div className='create-page-form__image'>
                <Avatar sx={{width: 190, height:190}} src={imgData}/>
                <Button color='success' variant='contained' endIcon={<CloudArrowUp/>}>
                    <input onChange={handlePhoto} type="file" />
                </Button>
            </div>
            <div className='create-page-form__fields'>
                <div>
                    <InputLabel>Username</InputLabel>
                    <Input name='username' value={formEntries.username} 
                    onChange={handleOnChange} placeholder='username' type='text'/>
                    {errors.username && <div className='error'>{errors.username}</div>}
                </div>
                <div>
                    <InputLabel>Email</InputLabel>
                    <Input name='email' value={formEntries.email} 
                    onChange={handleOnChange} placeholder='email' type='text'/>
                    {errors.email && <div className='error'>{errors.email}</div>}
                </div>
                <div>
                    <InputLabel>Birthdate</InputLabel>
                    <Input name='birthdate' value={formEntries.birthdate} 
                    onChange={handleOnChange} placeholder='birthdate' type='date'/>
                    {errors.birthdate && <div className='error'>{errors.birthdate}</div>}
                </div>
                <div>
                <FormControl sx={{ m: 1, width: 120 }}>
                    <InputLabel id="multiple-name-label">Food</InputLabel>
                    <Select
                      labelId="multiple-name-label"
                      id="multiple-name"
                      multiple
                      value={formEntries.favorite_food_ids}
                      onChange={handleOnChange}
                      input={<OutlinedInput label="Food" />}
                      name='favorite_food_ids'
                      >
                      {isFoodsLoading? <p>...Loading</p>:
                      (Object.entries(foods).map((food) => (
                        <MenuItem
                          key={food[0]}
                          value={food[0]}
                          >
                          {food[1]}
                        </MenuItem>
                          )))}
                    </Select>
                    </FormControl>
                </div>
                <Button onClick={() => handleSubmit()} variant='contained' color='success'>Create</Button>
            </div>
        </div>
        
    </div>
  )
}

export default CreatePage
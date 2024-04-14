import React, { useEffect, useState } from 'react'
import './UpdateStyles.scss'
import PathNavComponent from '../../components/pathNav/PathNavComponent.tsx'
import { useGetFoodsQuery, useGetViewUserQuery, useUpdateUserMutation } from '../../api/apiSlice.ts'
import staticavatar from '../../components/static/images/animal_static.jpg'
import { Avatar, Button, CircularProgress, FormControl, Input, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material'
import * as Yup from 'yup'
import { CloudArrowUp } from 'react-bootstrap-icons'

function UpdatePage() {
    const urlId = window.location.pathname.split("update/")[1]

    const [formEntries, setFormEntries] = useState ({
        username: '',
        email: '',
        birthdate: '',
        favorite_food_ids: [],
        upload_photo: {}
    })
    const [file, setFile] = useState(undefined);
    const [imgData, setImgData] = useState(staticavatar);

    const [errors, setErrors] = useState({})
    var formData = new FormData()

    const [updateUser] = useUpdateUserMutation()

    const validationSchema = Yup.object({
        "username":Yup.string().required("Username is required"),
        "email":Yup.string().email("Invalid Email").required("Email is required"),
        "birthdate":Yup.date().required("Birthdate is required")
    })

    const {
        data:user,
        isSuccess:isUserSuccess,
        isError:isUserError,
        error:userError
    } = useGetViewUserQuery(urlId)

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
    

    async function handleSubmit() {
        setFormEntries({...formEntries, upload_photo: file})
        var isValid = false

        formData.append("username",formEntries.username)
        formData.append("email", formEntries.email)
        formData.append("birthdate", formEntries.birthdate.split('-').reverse().join('.'))
        formData.append("favorite_food_ids", formEntries.favorite_food_ids)
        formData.append("upload_photo", file)
        setErrors({})

        const data = {
            id:urlId,
            formData:formData
        }
        
        try {
            await validationSchema.validate(formEntries, {abortEarly:false})
            isValid = validationSchema.isValidSync(formEntries, {abortEarly:false})
            if (isValid) {
                console.log(formEntries.favorite_food_ids);
                
               const res = await updateUser(data).unwrap() 
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
    <div className='update-page'>
        <div className="update-page-nav">
            <PathNavComponent path={'Users / Update / ' + urlId}/>
        </div>
        <div className='update-page-form'>
            <div className='update-page-form__image'>
                    <Avatar sx={{width: 190, height:190}} src={imgData}/>
                    <Button color='success' variant='contained' endIcon={<CloudArrowUp/>}>
                        <input onChange={handlePhoto} type="file" />
                    </Button>
                </div>
                <div className='update-page-form__fields'>
                    {isUserSuccess? 
                    <>
                    <div onLoad={() => setFormEntries({...formEntries,favorite_food_ids:user.favorite_food_ids})}>
                        <InputLabel>Username</InputLabel>
                        <Input name='username' value={formEntries.username} 
                        onChange={handleOnChange} placeholder={user.username} type='text'/>
                        {errors.username && <div className='error'>{errors.username}</div>}
                    </div>
                    <div>
                        <InputLabel>Email</InputLabel>
                        <Input name='email' value={formEntries.email} 
                        onChange={handleOnChange} placeholder={user.email} type='text'/>
                        {errors.email && <div className='error'>{errors.email}</div>}
                    </div>
                    <div>
                        <InputLabel>Birthdate</InputLabel>
                        <Input name='birthdate' value={formEntries.birthdate} 
                        onChange={handleOnChange} placeholder='birthdate' type='date'/>
                        {errors.birthdate && <div className='error'>{errors.birthdate}</div>}
                    </div> 
                    </>
                    :
                    <CircularProgress/>
                    }
                    
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
                    <Button onClick={() => handleSubmit()} variant='contained' color='success'>Update</Button>
                </div>
            </div>
        </div>
  )
}

export default UpdatePage
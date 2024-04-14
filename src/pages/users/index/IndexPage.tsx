import React, { useEffect } from 'react'
import './IndexStyles.scss'
import PathNavComponent from '../../components/pathNav/PathNavComponent.tsx'
import { Avatar, Box, Button, CircularProgress, FormControl, Input, InputLabel, MenuItem, OutlinedInput, Select, TextField} from '@mui/material'
import {Eye, Pen, PlusCircle, Trash} from 'react-bootstrap-icons'
import staticavatar from '../../components/static/images/animal_static.jpg'
import axios from 'axios';

import {
  useGetFoodsQuery,
  useGetIndexQuery,
  useGetSearchUserQuery,
  useDeleteUserMutation
} from "../../api/apiSlice.ts"
import {
  TablePagination
} from '@mui/base/TablePagination';

function IndexPage() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [content, setContent] = React.useState();
  const [searchFields, setSearchFields] = React.useState({
    id:"",
    username:"",
    email:"",
    birthdateStart:"",
    birthdateEnd:"",
    favourite_food_id:[]
  })
  
  var rowNumber = 0

  const {
    data:users,
    isLoading:isUsersLodaing,
    isFetching:isUsersFetching,
    refetch: usersRefetch
  } = useGetIndexQuery()
  
  useEffect(()=>{
    axios.get('http://tasks.tizh.ru/v1/user/index')
    .then((response) => {
      setContent(response.data)
    })
  },[isUsersFetching])

  const {
    data: foods,
    isLoading:isFoodsLoading
  } = useGetFoodsQuery()
  
  const {
    data: foundUsers,
    isFetching: isFoundUsersFetching,
    refetch: foundUsersRefetch
  } = useGetSearchUserQuery(searchFields)
  


  const [deleteUser] = useDeleteUserMutation()
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOnChange = event => {
    const { name, value } = event.target;
    setSearchFields({ ...searchFields, [name]: value });
  };

  async function handleSubmit() {
    console.log(searchFields);
    console.log(foundUsers)
    console.log(content)
    await foundUsersRefetch().then(() => {
      setContent(foundUsers)
    })
    console.log(foundUsers)
    console.log(content)
  }
  const handlePress = e => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className='index-page'>
      <div className='index-page-nav'>
        <PathNavComponent path='Users'/>
        <Box className='index-page__box'>
          <Button href='/user/create' variant='outlined' color='success' endIcon={<PlusCircle size={18}/>}> Create User</Button>
        </Box>
      </div>  
      <div className='index-page__table'>
        <table>       
          <thead>
            <tr>
              <th>
              </th>
              <th>
                <TextField id="standard-search" 
                label="Search ID" 
                type="search" variant="standard"
                name='id' value={searchFields.id} onChange={handleOnChange}
                onBlur={handleSubmit} onKeyDown={handlePress}/>
              </th>
              <th>
              </th>
              <th>
                <TextField id="standard-search" 
                label="Search Name" 
                type="search" variant="standard"
                name='username' value={searchFields.username} onChange={handleOnChange}
                onBlur={handleSubmit} onKeyDown={handlePress}/>
              </th>
              <th>
                <TextField id="standard-search" 
                label="Search Email" type="search" 
                variant="standard"
                name='email' value={searchFields.email} onChange={handleOnChange}
                onBlur={handleSubmit} onKeyDown={handlePress}/>
              </th>
              <th>
                <Input type='date'
                name='birthdateStart' value={searchFields.birthdateStart} 
                onChange={handleOnChange}
                onBlur={handleSubmit} onKeyDown={handlePress}></Input>
                <Input type='date'
                name='birthdateEnd' value={searchFields.birthdateEnd} 
                onChange={handleOnChange}
                onBlur={handleSubmit} onKeyDown={handlePress}></Input>
              </th>
              <th>
                <FormControl sx={{ m: 1, width: 120 }}>
                  <InputLabel id="multiple-name-label">Food</InputLabel>
                    <Select
                      labelId="multiple-name-label"
                      id="multiple-name"
                      multiple
                      value={searchFields.favourite_food_id}
                      onChange={handleOnChange}
                      input={<OutlinedInput label="Food" />}
                      name='favourite_food_id'
                      onBlur={handleSubmit} onKeyDown={handlePress}
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
              </th>
              <th>
              </th>
            </tr>
            <tr>
              <th><h2>#</h2></th>
              <th><h2>ID</h2></th>
              <th><h2>Photo</h2></th>
              <th><h2>Name</h2></th>
              <th><h2>Email</h2></th>
              <th><h2>Birthdate</h2></th>
              <th className='index-page__favourite_food_th'><h2>Favourite Food</h2></th>
              <th></th>
            </tr>
          </thead>
          {isUsersLodaing? <> <CircularProgress/>Loading...</> :
          <tbody >
          {(rowsPerPage > 0
            ? content.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : content
          ).map((row) => (
              <tr key={row.id}>
                <td key={rowNumber + row.id - Math.floor(Math.random() * 99999)}>{rowNumber=rowNumber+1}</td>
                <td key={row.id}>{row.id}</td>
                <td key={row.photo_id}>
                  {
                  row.photo_id === null ? 
                  <Avatar sx={{width:80, height: 80}} alt='avatar' src={staticavatar}/> : 
                  <Avatar sx={{width:80, height: 80}} alt='avatar' src={`http://tasks.tizh.ru/file/get?id=${row.photo_id}`}/>
                  }
                </td>
                <td key={row.username}>{row.username}</td>
                <td key={row.email}>{row.email}</td>
                <td key={row.birthdate }>{row.birthdate}</td>
                <td className='index-page__table__favourite__food' key={row.favorite_food_ids}>
                  {row.favorite_food_ids == "" ? <p>Invalid Food Id!</p> : 
                  row.favorite_food_ids.map((food) => (
                    foods[food] == undefined? <p>Invalid Food Id!</p> :
                      <>{foods[food] + ", "}</>
                  ))}
                  </td>
                <td key={Math.floor(Math.random() * 99999)} className='index-page__table__buttons'>
                  <Button href={'/user/view/' + row.id}><Eye/></Button>
                  <Button href={'/user/update/' + row.id}><Pen color='green'/></Button>
                  <Button onClick={() => deleteUser(row.id)}><Trash color='red'/></Button>
                </td>
            </tr>
          ))}
          </tbody>
          
          }

          {isUsersLodaing? <></> :
          <tfoot>
            <tr>
              <TablePagination
               rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
               colSpan={8}
               count={content.length}
               rowsPerPage={rowsPerPage}
               page={page}
               slotProps={{
                 select: {
                   'aria-label': 'rows per page',
                 }
               }}
               onPageChange={handleChangePage}
               onRowsPerPageChange={handleChangeRowsPerPage} 
               className='index-page__table__pagination'
              />
            </tr>
          </tfoot>
          }
        </table>
      </div>
    </div>
  )
}

export default IndexPage
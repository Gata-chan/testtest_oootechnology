import React from 'react'
import './ViewStyles.scss'
import PathNavComponent from '../../components/pathNav/PathNavComponent.tsx'
import { useGetFoodsQuery, useGetViewUserQuery, useDeleteUserMutation} from '../../api/apiSlice.ts'
import { Button, CircularProgress, Box, TableContainer, TableBody, TableRow, TableCell, Table, Avatar } from '@mui/material'
import { EmojiDizzy, Pen, Trash} from 'react-bootstrap-icons'
import staticavatar from '../../components/static/images/animal_static.jpg'

function ViewPage() {
    const urlId = window.location.pathname.split("view/")[1]

    const {
        data:user,
        isSuccess:isUserSuccess,
        isError:isUserError,
    } = useGetViewUserQuery(urlId)

    const {
        data:foods,
        isLoading:isFoodsLoading
    } = useGetFoodsQuery()

    const [deleteUser] = useDeleteUserMutation()

  return (
    <div className='view-page'>
        <div className='view-page-nav'>
            <PathNavComponent path={'Users / '+ urlId}/>
            <Box className='view-page__box'>
                <Button href={'/user/update/' + urlId} variant='outlined' endIcon={<Pen size={18}/>}> Update User </Button>
                <Button onClick={()=>deleteUser(urlId)} variant='outlined' endIcon={<Trash size={18}/>} color='error' > Delete User </Button>
            </Box>
        </div>
        {isUserError? <div className='view-page-404'><h1>NO USER FOUND</h1><EmojiDizzy size={50}/></div>
        : 
        
        isUserSuccess? 
        <div className='view-page-table'>
            <TableContainer className='view-page-table__table__container'>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell component="th">
                                <h3>ID</h3>
                            </TableCell>
                            <TableCell>
                                <p>{user.id}</p>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th">
                                <h3>USERNAME</h3>
                            </TableCell>
                            <TableCell>
                                <p>{user.username}</p>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th">
                                <h3>EMAIL</h3>
                            </TableCell>
                            <TableCell>
                                <p>{user.email}</p>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th">
                                <h3>BIRTHDATE</h3>
                            </TableCell>
                            <TableCell>
                                <p>{user.birthdate}</p>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th">
                                <h3>FAVOURITE FOOD</h3>
                            </TableCell>
                            <TableCell>
                                {isFoodsLoading? <>Loading</>:
                                    <p>
                                        {user.favorite_food_ids.map((id)=>(
                                            foods[id] == undefined? <p>Invalid Food Id!</p> :
                                            foods[id] + ", "
                                        ))} 
                                    </p>                                
                                }
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th">
                                <h3>PICTURE</h3>
                            </TableCell>
                            <TableCell>
                                {
                                    user.photo_id === null ? 
                                    <Avatar sx={{width:150, height: 150}} alt='avatar' src={staticavatar}/> : 
                                    <Avatar sx={{width:150, height: 150}} alt='avatar' src={`http://tasks.tizh.ru/file/get?id=${user.photo_id}`}/>
                                }
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        :
        <div><CircularProgress/></div>
        }
    </div>
  )
}

export default ViewPage
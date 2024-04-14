import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery ({baseUrl:'http://tasks.tizh.ru'}),
    tagTypes:['Users'],
    endpoints: (builder) => ({
        getIndex: builder.query<any, void>({
            query: () => '/v1/user/index',
            providesTags:['Users']
        }),
        getFoods: builder.query<any, void>({
            query: () => '/v1/user/get-food-list'
        }),
        getSearchUser: builder.query<any, any>({
            query: (searchObject) => `/v1/user/index?UserSearch%5Bid%5D=${searchObject.id == ""? '': searchObject.id}&UserSearch%5Busername%5D=${searchObject.username == ""? '': searchObject.username}&UserSearch%5Bemail%5D=${searchObject.email == ""? '': searchObject.email}&UserSearch%5BbirthdateStart%5D=${searchObject.birthdateStart == ""? '': searchObject.birthdateStart.split('-').reverse().join('.')}&UserSearch%5BbirthdateEnd%5D=${searchObject.birthdateEnd == ""? '': searchObject.birthdateEnd.split('-').reverse().join('.')}&UserSearch%5BfoodIds%5D=${searchObject.favourite_food_id[0]==undefined? '' :'&UserSearch%5BfoodIds%5D%5B%5D='+searchObject.favourite_food_id[0]}${searchObject.favourite_food_id[1]==undefined? '' :'&UserSearch%5BfoodIds%5D%5B%5D='+searchObject.favourite_food_id[1]}${searchObject.favourite_food_id[2]==undefined? '' :'&UserSearch%5BfoodIds%5D%5B%5D='+searchObject.favourite_food_id[2]}${searchObject.favourite_food_id[3]==undefined? '' :'&UserSearch%5BfoodIds%5D%5B%5D='+searchObject.favourite_food_id[3]}${searchObject.favourite_food_id[4]==undefined? '' :'&UserSearch%5BfoodIds%5D%5B%5D='+searchObject.favourite_food_id[4]}${searchObject.favourite_food_id[5]==undefined? '' :'&UserSearch%5BfoodIds%5D%5B%5D='+searchObject.favourite_food_id[5]}`,
            providesTags:['Users']
        }),
        deleteUser: builder.mutation<any, number>({
            query:(id) => ({
                url:`/v1/user/delete?id=${id}`,
                method:'DELETE',
                body: id
            }),
            invalidatesTags:['Users']
        }),
        getViewUser: builder.query<any, any>({
            query: (userId) => `/v1/user/view?id=${userId}`,
            providesTags:['Users']
        }),
        addUser: builder.mutation<any,any>({
            query: (formData) =>({
                url:`v1/user/create`,
                method:'POST',
                body:formData,
                formData: true
            }),
            invalidatesTags:['Users']
        }),
        updateUser: builder.mutation<any,any>({
            query: (data) => ({
                url:`v1/user/update?id=${data.id}`,
                method: 'PUT',
                body:data.formData,
                formData:true
            }),
            invalidatesTags:['Users']
        })
    })
}) 
export const {
    useGetIndexQuery,
    useGetFoodsQuery,
    useGetSearchUserQuery,
    useDeleteUserMutation,
    useGetViewUserQuery,
    useAddUserMutation,
    useUpdateUserMutation
} = apiSlice
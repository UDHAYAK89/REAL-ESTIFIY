import { createSlice, } from "@reduxjs/toolkit";

const initialState = 
{
    currentUser : null,
    error : null,
    loading: false
};

const userSlice = createSlice(
    {
        name:'user',
        initialState,
        reducers : 
        {
            SigninStart: (state)=>
                {
                    state.loading = true;
                },
            SigninSuccess : (state , action)=>
                {
                    state.currentUser = action.payload;
                    state.loading = false,
                    state.error = null
                },
            signinFailure : (state , action)=>
                {
                    state.error = action.payload;
                    state.loading = false;
                },
            updateUserStart: (state)=>
            {
               
                state.loading = true;

            },
            updateUserSuccess: (state , action)=>
            {
                state.currentUser = action.payload
                state.loading = false;
                state.error = null;

            },
            updateUserFailure: (state , action)=>
            {
                state.error = action.payload;
                state.loading = false;

            },
            deleteUserSuccess: (state)=>
            {
                state.currentUser = null,
                state.loading = false,
                state.error = null
            },
            deleteUserFailure: (state , action)=>
            {
                state.error = action.payload;
                state.loading = false;

            },
            deleteUserStart: (state)=>
            {
                state.loading = true;

            },
            signOutUserStart: (state)=>
            {
                state.loading = true;
            }, 
            signOutUserSuccess: (state)=>
            {
                state.currentUser = null,
                state.loading = false,
                state.error = null
            },
            signOutUserFailure: (state , action)=>
            {
                state.error = action.payload;
                state.loading = false;
    
            },
        },
    })

export const {SigninStart , SigninSuccess , signinFailure , updateUserStart , updateUserFailure , updateUserSuccess , deleteUserSuccess , deleteUserFailure ,deleteUserStart, signOutUserStart , signUserSuccess , signOutUserFailure } = userSlice.actions;

export default userSlice.reducer;
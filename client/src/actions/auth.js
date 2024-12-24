import * as api from '../api/index.js'
import {AUTH} from '../../src/constants/actionTypes.js'

export const signIn=(formData,history)=>async(dispatch)=>{
    try{
   //log in the user
   const {data}=await api.signIn(formData)
   dispatch({type:AUTH,data});
   history.push('/')//navigate to home
    }catch(error){
        alert(error.response.data); // Show alert with error message
        console.log(error);
    }

}


export const signUp=(formData,history)=>async(dispatch)=>{
    try {
        const { data } = await api.signUp(formData);
        dispatch({ type: AUTH, data });
    
     history.push('/')//navigate to home
    }catch(error){
        alert(error.response.data); // Show alert with error message
        console.log(error.message);


    }

}
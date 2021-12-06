import axios from 'axios'

const url = 'http://94.156.189.137:8000/api/'

export async function getData(route){
    return await axios.get(`${url}${route}`)
}

export async function getDataForId(route,id){
    return await axios.get(`${url}${route}/${id}`)
}

export async function postData(route,obj){
    return await axios.post(`${url}${route}`,obj)
}

export async function deleteDataForId(route,id){
    return await axios.delete(`${url}${route}/${id}`)
}

export async function putDataForId(route,id,obj){
    return await axios.put(`${url}${route}/${id}`,obj)
}

export async function multipleGetDataId(route,ids){
    try{
        let allLoc=ids.map(id => axios(`${url}${route}/${id}`))
        let rez=await Promise.all(allLoc)
        return rez
    } catch(error){
        console.log(error)
        return null
    }

}
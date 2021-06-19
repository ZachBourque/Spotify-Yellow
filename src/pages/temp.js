import queryString from 'query-string'
import { Redirect } from "react-router-dom";




const Temp = (props) => {
    console.log("here1")

        const token = queryString.parse(props.location.search)['t']
        const rtoken = queryString.parse(props.location.search)['rt']
        const expires = queryString.parse(props.location.search)['ex']
        const pfp = queryString.parse(props.location.search)['p']
        const hasAccount = queryString.parse(props.location.search)['a']
        const id = queryString.parse(props.location.search)['id']
        if(hasAccount == "true"){
            localStorage.setItem("data",JSON.stringify(
                {token, rtoken, expires, pfp}
            ))
            return <Redirect to="/"/>
        }
        if(!token || !rtoken || !expires){
            console.error("Uh oh")
            return <Redirect to="/"/>
        } else {
            props.history.push({
                pathname: "/signup",
                state: {
                    isAuthed: true,
                    token,
                    rtoken,
                    expires,
                    id
                }
            })
        }
        return <div></div>
        

    }


export default Temp
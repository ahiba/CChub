import React from 'react'
import {
    DeviceEventEmitter
} from 'react-native'
import {ACTION_HONE} from '../screens/ScreenTab'
export default class BaseComponent extends React.Component{
    constructor(props){
        super(props)
    }
    componentDidMount(){
        this.baseListener = DeviceEventEmitter.addListener('ACTION_BASE',(action,params)=>{
            this.onBaseAction(action,params)
        })
    }
    onBaseAction = (action,params) => {
        if(ACTION_HONE.A_THEME===action){
            this.onThmemeChange(params)
        }
    }
    onThmemeChange = (theme) => {
        if(!theme) return
        this.setState({
            theme:theme
        })
    }
    componentWillUnmount(){
        this.baseListener&&this.baseListener.remove()
    }
}

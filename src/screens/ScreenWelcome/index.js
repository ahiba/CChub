import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as actions from './screenWelcomeRedux'
import { Actions } from 'react-native-router-flux'
import SplashScreen from 'react-native-splash-screen'
import GlobalStyles from '../../../res/styles/GlobalStyles'
import NavigationBar from '../../components/NavigationBar'
class ScreenWelcome extends Component{
    constructor(props){
        super(props)
    }
  resetToScreenTab() {
        let {theme:{theme}} = this.props
        // Actions.TAB({theme:theme})
        Actions.TAB({type: "reset",theme:theme})
        // Actions.reset({sceneKey:'Tab',props:{theme:theme}})
    }
    componentDidMount(){
        let {loadTheme} = this.props
        loadTheme()
        this.timer = setTimeout(()=>{
            SplashScreen.hide()
          this.resetToScreenTab()
        },500)
    }
    componentWillUnmount(){
        this.timer&&clearTimeout(this.timer)
    }
    render(){
        return null
    }
}
export default connect(
    state => {
        let {welcome:theme} = state
        return {
            theme
        }
    },
    dispatch => bindActionCreators({...actions},dispatch)
)(ScreenWelcome)

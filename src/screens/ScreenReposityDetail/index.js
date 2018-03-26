import React,{Component} from 'react'
import {
    View,
    Text,
    DeviceEventEmitter,
    WebView,
    StyleSheet
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import ViewUtils from '../../util/ViewUtils'
import NavigationBar  from '../../components/NavigationBar'
const TRENDING_URL = 'https://github.com/'
export  default class ReposityDetail extends Component{
    constructor(props){
        super(props)
        this.url = this.props.item.html_url ? this.props.item.html_url : TRENDING_URL + this.props.item.fullName
        let title = this.props.item.full_name ? this.props.item.full_name : this.props.item.fullName
        this.state = {
            url:this.url,
            canGoBack:false,
            title:title,
        }
        this.onBack = this.onBack.bind(this)
        this.onNavigationStateChange = this.onNavigationStateChange.bind(this)
    }

    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack,
        });
        console.log('navState.url',navState.url)
    }
    onBack(){
        if(this.state.canGoBack){
            this.webView.goBack()
        }else{
            Actions.pop()
        }
        // this.props.navigator.pop()
    }
    render(){
        let statusBar = {backgroundColor:this.props.theme.themeColor}
        let navigationBar =
            <NavigationBar
                title={this.state.title}
                statusBar = {statusBar}
                style = {this.props.theme.styles.navBar}
                leftButton={ViewUtils.getLeftButton(()=>{this.onBack()})}
            />
        return(
            <View style={styles.container}>
                {navigationBar}
                <WebView
                    ref = {webView=>this.webView=webView}
                    startInLoadingState = {true}
                    onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
                    source={{uri:this.state.url}}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
})

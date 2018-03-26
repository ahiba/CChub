
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    DeviceEventEmitter,
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import ScreenPopular from '../ScreenPopular'
import ScreenTrend from '../ScreenTrend'
import ScreenCollect from '../ScreenCollect'
import ScreenMy from '../ScreenMy'
import {Actions} from 'react-native-router-flux'
import BaseComponent from '../../common/BaseComponent'
export const ACTION_HONE = {A_RESTART:'restart',A_THEME:'theme',}
export default class HomePage extends BaseComponent {
    constructor(props){
        super(props)
        console.log('this.props.theme',this.props.theme)
        this.state={
            selectedTab:'tb_popular',
            theme:this.props.theme
        }
    }
    onRestart = () => {//重启首页
            // Actions.POPULAR()
       Actions.TAB()
    }
    onAction = (action) => {
        if(ACTION_HONE.A_RESTART===action){
            this.onRestart()
        }
    }
    componentDidMount(){
        super.componentDidMount()
        this.listener = DeviceEventEmitter.addListener('ACTION_HONE',(action)=>{
            this.onAction(action)
        })
    }
    componentWillUnmount(){
        super.componentWillUnmount()
        this.listener&&this.listener.remove()
    }
    _renderTab(Component, selectedTab, title, renderIcon) {
            return (
                <TabNavigator.Item
                    selected={this.state.selectedTab === selectedTab}
                    selectedTitleStyle={this.state.theme.styles.selectedTitleStyle}
                    title={title}
                    renderIcon={() => <Image style={styles.image}
                                         source={renderIcon}/>}
                    renderSelectedIcon={() =><Image style={[styles.image, this.state.theme.styles.tabBarSelectedIcon]}
                                                source={renderIcon}/>}
                    onPress={() => this.setState({selectedTab: selectedTab})}>
                    <Component {...this.props} theme={this.state.theme}/>
                </TabNavigator.Item>
            )
    }
    render() {
        return (
            <View style={styles.container}>
                <TabNavigator>
                    {this._renderTab(ScreenPopular,'tb_popular','最热',require('../../../res/images/ic_polular.png'))}
                    {this._renderTab(ScreenTrend,'tb_trending','趋势',require('../../../res/images/ic_trending.png'))}
                    {this._renderTab(ScreenCollect,'tb_favorite','收藏',require('../../../res/images/ic_favorite.png'))}
                    {this._renderTab(ScreenMy,'tb_my','我的',require('../../../res/images/ic_my.png'))}
                </TabNavigator>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image:{
        width:22,
        height:22
    }
});

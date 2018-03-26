
export const MORE_MENU = {
    Custom_Language:'Custom Language',
    Sort_Language:'Sort Language',
    Custom_Key:'Custom Key',
    Sort_Key:'Sort Key',
    Remove_Key:'Remove Key',
    About_Author:'About Author',
    About:'About',
    Custom_Theme:'Custom Theme',
    Website: 'Website',
    Feedback:'Feedback',
    Copyright:'Copyright',
    Refresh:'Refresh',
    Share:'Share'
}
export const COPY_RIGHT = {
    react:'react',
    react_native:'react-native',
    redux:'redux',
    react_redux:'react-redux',
    redux_thunk:'redux-thunk',
    react_native_router_flux:'react-native-router-flux',
    antd_mobile:'antd-mobile',
    GitHubTrending:'GitHubTrending',
    react_native_check_box:'react-native-check-box',
    react_native_htmlview:'react-native-htmlview',
    react_native_parallax_scroll_view:'react-native-parallax-scroll-view',
    react_native_popup_menu:'react-native-popup-menu',
    react_native_scrollable_tab_view:'react-native-scrollable-tab-view',
    react_native_sortable_listview:'react-native-sortable-listview',
    react_native_tab_navigator:'react-native-tab-navigator',
    githubPopular:'githubPopular'
}
import React, { Component } from 'react';
import { Text, TouchableOpacity,View,Image } from 'react-native';
import Menu, {
    MenuOptions,
    MenuOption,
    MenuTrigger
} from 'react-native-popup-menu';
import {Actions} from 'react-native-router-flux'
import {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
export default class MoreMenu extends Component {
    onOptionSelect(value) {
        switch (value) {
            case MORE_MENU.About:
                Actions.ABOUT({theme:this.props.theme})
                break;
            case MORE_MENU.Custom_Language:
                Actions.CUSTOM_KEY({flag: FLAG_LANGUAGE.flag_language,theme:this.props.theme})
                break;
            case MORE_MENU.Sort_Language:
                Actions.SORT_KEY({'isRemoveKey': true, flag: FLAG_LANGUAGE.flag_language,theme:this.props.theme})
                break;
            case MORE_MENU.Custom_Key:
                Actions.CUSTOM_KEY({isRemoveKey: true, flag: FLAG_LANGUAGE.flag_key,theme:this.props.theme})
                break;
            case MORE_MENU.Sort_Key:
                Actions.SORT_KEY({flag: FLAG_LANGUAGE.flag_key,theme:this.props.theme})
                break;
            case MORE_MENU.Remove_Key:
                Actions.CUSTOM_KEY({isRemoveKey: true, flag: FLAG_LANGUAGE.flag_key,theme:this.props.theme})
                break;
            case MORE_MENU.Custom_Theme:
                break;
            case MORE_MENU.About_Author:
                Actions.ABOUT_ME({theme:this.props.theme})
                break;
        }
    }

    openMenu() {
        this.menu.open();
    }

    onRef = r => {
        this.menu = r;
    }
    onMoreMenuSelect = (tab) => {
        switch (tab) {
            case MORE_MENU.About:
                Actions.ABOUT()
                break;
            case MORE_MENU.Custom_Language:
                Actions.CUSTOM_KEY({flag: FLAG_LANGUAGE.flag_language})
                break;
            case MORE_MENU.Sort_Language:
                Actions.SORT_KEY({'isRemoveKey': true, flag: FLAG_LANGUAGE.flag_language})
                break;
            case MORE_MENU.Custom_Key:
                Actions.CUSTOM_KEY({isRemoveKey: true, flag: FLAG_LANGUAGE.flag_key})
                break;
            case MORE_MENU.Sort_Key:
                Actions.SORT_KEY({flag: FLAG_LANGUAGE.flag_key})
                break;
            case MORE_MENU.Remove_Key:
                Actions.CUSTOM_KEY({isRemoveKey: true, flag: FLAG_LANGUAGE.flag_key})
                break;
            case MORE_MENU.Custom_Theme:
                console.log(1)
                break;
            case MORE_MENU.About_Author:
                Actions.ABOUT_ME()
                break;
        }
    }

    render() {

        return (
            <View style={{flexDirection: 'column',width:24,height:24}}>
                <Menu onSelect={value => this.onOptionSelect(value)} ref={this.onRef}>
                    <MenuTrigger>
                        <Image source={require('../../res/images/ic_more_vert_white_48pt.png')} style={{width:24,height:24}}/>
                    </MenuTrigger>
                    <MenuOptions>
                        {/*<MenuOption value={1} text='One' />*/}
                        {/*<MenuOption value={2} text='Two (not closing)' />*/}
                        {this.props.menus.map((element,i)=>{
                            return (
                                <MenuOption key={i} value={element} text={element} onPress={()=>{this.onMoreMenuSelect(element)}}/>
                            )
                        })}
                    </MenuOptions>
                </Menu>
            </View>
        );
    }
}

import React, { Component } from 'react';
import { Text, TouchableOpacity,View,Image } from 'react-native';
import Menu, {
    MenuOptions,
    MenuOption,
    MenuTrigger
} from 'react-native-popup-menu';
export default class ControlledExample extends Component {
    onOptionSelect(value) {
            this.props.changeTimespan(value)
            this.menu.close()
    }
    openMenu() {
        this.menu.open();
    }

    onRef = r => {
        this.menu = r;
    }

    render() {
        return (
            <View style={{flexDirection: 'column',width:12,height:12}}>
                <Menu onSelect={value => this.onOptionSelect(value)} ref={this.onRef}>
                    <MenuTrigger>
                        <Image source={require('../../res/images/ic_spinner_triangle.png')} style={{width:12,height:12}}/>
                    </MenuTrigger>
                    <MenuOptions>
                        <MenuOption value='?since=daily' text='今天' />
                        <MenuOption value='?since=weekly' text='本周' />
                        <MenuOption value='?since=monthly' text='本月' />
                    </MenuOptions>
                </Menu>
            </View>
        );
    }

}
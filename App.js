import React, {useState} from 'react';
import {View, TouchableOpacity} from "react-native";
import {Icon} from "react-native-elements";
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Produtos from './components/Produtos';
import Carrinho from './components/Carrinho';


import {StackActions} from '@react-navigation/native';
const Stack=createStackNavigator();
global.BGCOLOR = '#6D8EAD'; 

const App=() => {
	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName="Produtos"
				screenOptions={({navigation}) => ({
					headerStyle: {backgroundColor: '#7fc242'},
					headerTintColor: 'black',
					headerTitleStyle: {fontWeight: 'bold'},

					headerRight: () => (
						<TouchableOpacity
							style={{marginRight: 20}}
							onPress={() => navigation.dispatch(StackActions.replace('Carrinho', {carrinhoParam: false}))}>
							<Icon name='shopping-cart' color='black' />
						</TouchableOpacity>
					)
				})}>
								
				<Stack.Screen
					name="Produtos"
					component={Produtos}
					options={{title: 'Produtos'}}
				/>
				
				<Stack.Screen
					name="Carrinho"
					component={Carrinho}
					options={({navigation}) => ({
						title: 'Meu carrinho',
						headerLeft: () => (
							<TouchableOpacity
								style={{marginLeft: 10}}
								onPress={() => navigation.dispatch(StackActions.replace('Produtos', {clearParam: false, updateParam: null}                ))}>
								<Icon name='arrow-back' color='black' />
							</TouchableOpacity>
						),
						headerRight: null
					})}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default App;
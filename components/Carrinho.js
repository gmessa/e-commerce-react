import React, {Component, useState, useEffect} from 'react';
import {
	FlatList,
	StyleSheet,
	View,
	Text,
	Image,
	Alert,
	SafeAreaView,
	TouchableOpacity,
	ScrollView,
} from 'react-native';

import {StackActions} from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

const Carrinho=({route, navigation}) => {
	const [certain, setCertain]=useState(false);
	const [carrinho, setCarrinho]=useState(route.params.carrinhoParam);

	useEffect(() => {
		carrinho == false
		? carregar()
		: null
	});

	async function carregar() {
		let result = await SecureStore.getItemAsync("carrinhoProdutos");
		if (result) setCarrinho(JSON.parse(result));
		else {
			Alert.alert('Carrinho vazio', 'Não há produtos no carrinho!');
			navigation.dispatch(StackActions.replace('Produtos'));
		}
	}
  
	const selecionarProduto=itemSel => {
		Alert.alert(itemSel.name, "Quantidade selecionada: " + itemSel.quantidade + ".\nPreço do produto: " + itemSel.price + ".\nPreço total: " + (itemSel.quantidade * itemSel.price).toFixed(2) + '.');
	}

	const incrementarProduto=itemSel => {
		let carrinho_temp=carrinho.map(itens => (
			itens.id === itemSel.id ? {...itens, quantidade: itens.quantidade + 1}: itens
		))
		
		setCarrinho(carrinho_temp);
		SecureStore.setItemAsync("carrinhoProdutos", JSON.stringify(carrinho_temp));
	}
	
	const encrementarProduto=itemSel => {
		if (itemSel.quantidade === 1) {
			let carrinho_temp=carrinho.filter((itens) => itens.id != itemSel.id).map(({
					id,
					name,
					price,
					quantidade
				}) => ({
          
					id,
					name,
					price,
					quantidade
				})
			)
			
			Alert.alert (itemSel.name, "Produto removido do carrinho.");
			if (carrinho.length === 1) {
				setCarrinho(null);
				SecureStore.setItemAsync("carrinhoProdutos", "");
				navigation.dispatch(StackActions.replace('Produtos', {clearParam: true}));
			} else {
				setCarrinho(carrinho_temp);
				SecureStore.setItemAsync("carrinhoProdutos", JSON.stringify(carrinho_temp));
			}
		} else {
			let carrinho_temp=carrinho.map(itens => (
				itens.id === itemSel.id
				? {...itens, quantidade: itens.quantidade - 1}
				: itens
			))
			
			setCarrinho(carrinho_temp);
			SecureStore.setItemAsync("carrinhoProdutos", JSON.stringify(carrinho_temp));
		}
	}

	async function finalizarCompra() {
		let precoTotal = 0;
		
		{carrinho.map((item) => precoTotal += (item.price * item.quantidade))}
		
		Alert.alert('Compra finalizada', "Preço total da compra: " + precoTotal.toFixed(2));
		SecureStore.setItemAsync("carrinhoProdutos", "");
		navigation.dispatch(StackActions.replace('Produtos'));
	}
	
	return (
		<SafeAreaView style={{flex: 1}}>
			<View style={{flex: 1, padding: 12}}>
				<ScrollView contentContainerStyle={{flexGrow: 1}}>
					{certain == "Limpar carrinho" ? (
						<View
							style={{
								flex: 1,
								alignItems: 'center',
								justifyContent: 'center',
							}}>
							<Text style={{fontWeight: 'bold'}}>
								Você tem certeza que deseja esvaziar o Carrinho?
							</Text>
							<Text style={{marginBottom: 17}}>
								Ainda há produtos no seu Carrinho.
							</Text>
							<View style={{
								flexDirection: 'row',
								marginTop: 10,
								alignSelf: 'center',
								alignItems: 'center'}}>
								<TouchableOpacity
									style={{
										alignItems: 'center',
										alignSelf: 'center',
										backgroundColor: '#7fc242',
										borderRadius: 10,
										padding: 10,
										width: 142,
										marginRight: 10,
									}}
									onPress={() => setCertain(false)}>
									<Text style={{color: "black", fontWeight: "bold"}}>
										Retornar
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={{
										alignItems: 'center',
										alignSelf: 'center',
										backgroundColor: '#7fc242',
										borderRadius: 10,
										padding: 10,
										width: 142,
									}}
									onPress={() => navigation.dispatch(StackActions.replace('Produtos', {clearParam: true}))}>
									<Text style={{color: "black", fontWeight: "bold"}}>
										SIM
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					) : certain == "Finalizar compra" ? (
						<View
							style={{
								flex: 1,
								alignItems: 'center',
								justifyContent: 'center',
							}}>
							<Text style={{fontWeight: 'bold'}}>
								Você tem certeza que deseja finalizar a compra?
							</Text>
							<Text style={{marginBottom: 17}}>
								Quando feito, não será possível desfazer a compra.
							</Text>
							<View style={{
								flexDirection: 'row',
								marginTop: 10,
								alignSelf: 'center',
								alignItems: 'center'}}>
								<TouchableOpacity
									style={{
										alignItems: 'center',
										alignSelf: 'center',
										backgroundColor: '#7fc242',
										borderRadius: 10,
										padding: 10,
										width: 142,
										marginRight: 10,
									}}
									onPress={() => setCertain(false)}>
									<Text style={{color: "black", fontWeight: "bold"}}>
										Retornar
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={{
										alignItems: 'center',
										alignSelf: 'center',
										backgroundColor: '#7fc242',
										borderRadius: 10,
										padding: 10,
										width: 142,
									}}
									onPress={() => finalizarCompra()}>
									<Text style={{color: "black", fontWeight: "bold"}}>
										SIM
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					) : (
						<View
							style={{
								flex: 1.5,
								alignItems: 'center',
								justifyContent: 'center',
							}}>
							<FlatList
								data={carrinho}
								renderItem={({item}) => (
									<TouchableOpacity onPress={() => selecionarProduto(item)}>
										<View style={{
											marginBottom: 10,
											borderLeftWidth: 1,
											borderRightWidth: 1,
											borderTopWidth: 1,
											borderBottomWidth: 1,
											borderRadius: 12,
											paddingHorizontal: 5,
											backgroundColor: 'white'}}>
											<View style={{
												paddingVertical: 10,
												marginTop: 2,
												flexDirection: 'row'}}>
												<View style={{
													borderRightWidth: 1,
													borderRadius: 5,
													marginTop: -4,
													marginRight: 6,
													borderColor: '#7fc242'}}>

												</View>
												
												<Text style={{width: 90, color: '#1f3447'}}>
													{item.name}
												</Text>
												
												<Text style={{width: 80, color: '#1f3447'}}>
													R${item.price}
												</Text>
												
												<TouchableOpacity
													style={{
														width: 30,
														marginTop: -3,
														borderTopWidth: 1,
														borderBottomWidth: 1,
														borderLeftWidth: 1,
														borderRightWidth: 1,
														borderRadius: 2,
														alignSelf: 'center',
														backgroundColor: '#ff9494',
													}}
													onPress={() => encrementarProduto(item)}>
													<Text style={{
														textAlign: 'center',
														color: '#1f3447',
														fontSize: 16,
														fontWeight: 'bold',
														}}>
														-
													</Text>
												</TouchableOpacity>
												
												<Text style={{
													width: 26,
													marginTop: -3,
													marginLeft: 2,
													borderTopWidth: 1,
													borderBottomWidth: 1,
													borderLeftWidth: 1,
													borderRightWidth: 1,
													borderRadius: 2,
													alignSelf: 'center',
													textAlign: 'center',
													color: '#1f3447',
													fontSize: 16,
													fontWeight: 'bold'}}>
													{item.quantidade}
												</Text>
												
												<TouchableOpacity
													style={{
														width: 30,
														marginTop: -3,
														marginLeft: 2,
														marginRight: 2,
														borderTopWidth: 1,
														borderBottomWidth: 1,
														borderLeftWidth: 1,
														borderRightWidth: 1,
														borderRadius: 2,
														alignSelf: 'center',
														backgroundColor: '#94ff9d',
													}}
													onPress={() => incrementarProduto(item)}>
													<Text style={{
														textAlign: 'center',
														fontSize: 16,
														marginRight: 1,
														color: '#1f3447',
														fontWeight: 'bold',
														}}>
														+
													</Text>
												</TouchableOpacity>
											</View>
										</View>
									</TouchableOpacity>
								)}
							/>
							
							<View style={{alignItems: 'center'}}>
								<View style={{flexDirection: 'row', marginTop: 6}}>
									<TouchableOpacity
										style={{
											alignItems: 'center',
											alignSelf: 'center',
											backgroundColor: '#7fc242',
											borderRadius: 10,
											padding: 10,
											width: 148,
											marginRight: 10,
										}}
										onPress={() => setCertain("Limpar carrinho")}>
										<Text style={{color: "black", fontWeight: "bold"}}>
											Limpar carrinho
										</Text>
									</TouchableOpacity>
									
									<TouchableOpacity
										style={{
											alignItems: 'center',
											alignSelf: 'center',
											backgroundColor: '#7fc242',
											borderRadius: 10,
											padding: 10,
											width: 148,
										}}
										onPress={() => setCertain("Finalizar compra")}>
										<Text style={{color: "black", fontWeight: "bold"}}>
											Finalizar compra
										</Text>
									</TouchableOpacity>
								</View>
								<TouchableOpacity
									style={{
										alignItems: 'center',
										alignSelf: 'center',
										backgroundColor: '#7fc242',
										borderRadius: 10,
										padding: 10,
										width: 306,
										marginTop: 10,
									}}
									onPress={() => navigation.dispatch(StackActions.replace('Produtos'))}>
									<Text style={{color: "black", fontWeight: "bold"}}>
										Voltar 
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					)}
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

export default Carrinho;
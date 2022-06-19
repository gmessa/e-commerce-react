import React, {Component, useState, useEffect} from 'react';
import {
	Alert,
	FlatList,
	StyleSheet,
	View,
	Text,
	Image,
	SafeAreaView,
	TouchableOpacity,
	ScrollView,
} from 'react-native';


import {StackActions} from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

const Produtos=({navigation, route}) => {
	const [produtos, setProdutos]=useState([]);
	const [selecionados, setSelecionados]=useState([]);
	
	useEffect(() => { (fetchProdutos())});

	const fetchProdutos = async () => {
		const resp = await fetch("https://618e6a1850e24d0017ce1294.mockapi.io/api/v1/products");
		const data = await resp.json();
		setProdutos(data);
	};
	
	async function limpar() {
		setSelecionados([]);
		SecureStore.setItemAsync("carrinhoProdutos", "");
		fetchProdutos();
		Alert.alert('Carrinho vazio', "O carrinho foi esvaziado.");
	}
	
	async function selecionarProduto(itemSel) {
		let exist = false;
		for (var i=0; i < selecionados.length; i++) {
			if (itemSel.id === selecionados[i].id) {
				exist = true;
				break;
			}
		}
		
		if (!exist) {
			selecionados.push({
				id: itemSel.id,
				name: itemSel.product,
				price: itemSel.price,
				quantidade: 0,
			});
		
			let selecionados_temp=selecionados.map(itens => (
				itens.id === (itemSel.id)
				? {...itens, quantidade: itens.quantidade + 1}
				: itens
			))
			
			setSelecionados(selecionados_temp);
			SecureStore.setItemAsync("carrinhoProdutos", JSON.stringify(selecionados_temp));
			Alert.alert(itemSel.product, "O produto adicionado no carrinho.");
		} else Alert.alert(itemSel.name, "O produto já foi adicionado no carrinho!");
	}
	
	return (
		<SafeAreaView style={{flex: 1}}>
			<View style={{flex: 1}}>
				<ScrollView contentContainerStyle={{flexGrow: 1, padding: 12}}>
					<View>
						<FlatList
							data={produtos}
							renderItem={({item}) => (
								<TouchableOpacity onPress={() => selecionarProduto(item)}>
									<View style={{
										marginBottom: 10,
										borderLeftWidth: 1,
										borderRightWidth: 1,
										borderTopWidth: 1,
										borderBottomWidth: 1,
										borderRadius: 20,
										paddingHorizontal: 5}}>
										<View style={{
											paddingVertical: 12,
											flexDirection: 'row'}}>
											<View style={{
												borderRightWidth: 1,
												borderBottomWidth: 1,
												borderRadius: 10,
												marginRight: 6,
												backgroundColor: '#7fc242'}}>
												<View style={{
													marginLeft: 9,
													marginRight: 7,
													marginTop: 6,
													marginBottom: 6}}>				
													<Image
															style={{height: 100, width: 85}}
															source={{uri: 'https://reactjs.org/logo-og.png'}}
														/>
												</View>
											</View>
											<View style={{
												marginTop: 6,
												borderBottomWidth: 1,
												borderRadius: 10}}>
												<Text style={{
													marginLeft: 6,
													marginRight: 16,
													fontWeight: 'bold'}}>
													{item.product}
												</Text>
												<Text style={{
													marginLeft: 6}}>
													Código: 00{item.id}
												</Text>
												<Text style={{
													marginLeft: 6}}>
													{item.name}
												</Text>
												<Text style={{
													marginLeft: 6,
													}}>
													Departamento: {item.department}
												</Text>
                       <Text style={{
													marginLeft: 6,
													marginBottom: 10,
													}}>
													Preço: R$ {item.price}
												</Text>
                        
											</View>
										</View>
										<Text style={{
											marginBottom: 10}}>
											Descrição: {item.description}
										</Text>

									</View>
								</TouchableOpacity>
							)}
						/>

            
						
						{selecionados.length > 0 ? (
							<TouchableOpacity
								style={{
									alignItems: 'center',
									alignSelf: 'center',
									backgroundColor: '#7fc242',
									borderRadius: 10,
									padding: 10,
									width: 280,
									marginTop: 6,
								}}
								onPress={() => navigation.dispatch(StackActions.replace('Carrinho', {carrinhoParam : false}))}>
								<Text style={{color: 'black', fontWeight: 'bold'}}>
									Meu carrinho
								</Text>
							</TouchableOpacity>
						) : null}


					</View>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

export default Produtos;
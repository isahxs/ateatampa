import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Feather } from '@react-native-vector-icons/feather';
import { useNavigation } from '@react-navigation/native';

import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import { theme } from '../../theme';
import Page from '../../components/Page';

function StatusDot({ cor, piscar }) {
  const opacidade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (piscar) {
      const animacao = Animated.loop(
        Animated.sequence([
          Animated.timing(opacidade, {
            toValue: 0.2,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(opacidade, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      );
      animacao.start();

      return () => animacao.stop();
    } else {
      opacidade.setValue(1);
    }
  }, [piscar, opacidade]);

  return (
    <Animated.View 
      style={[
        styles.dot, 
        { backgroundColor: cor, opacity: opacidade }
      ]} 
    />
  );
}

export default function Pedidos() {
  const navigation = useNavigation();
  const [pesquisa, setPesquisa] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuarioLogado(user);
      } else {
        setUsuarioLogado(null);
        setPedidos([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!usuarioLogado) {
      setPedidos([]);
      return;
    }

    let unsubscribePedidos = null;

    const carregarPedidosDoCliente = async () => {
      try {
        let idClienteNoBanco = usuarioLogado.uid;

        if (usuarioLogado.email) {
          const clientesRef = collection(db, "usuarios");
          const qCliente = query(clientesRef, where("email", "==", usuarioLogado.email));
          const clienteSnap = await getDocs(qCliente);

          if (!clienteSnap.empty) {
            idClienteNoBanco = clienteSnap.docs[0].id;
          }
        }

        const pedidosRef = collection(db, "pedidos");
        unsubscribePedidos = onSnapshot(pedidosRef, (snapshot) => {
          const listaTemporaria = [];

          snapshot.forEach((docItem) => {
            const data = docItem.data();

            const pertenceAoCliente =
              data.clienteID === usuarioLogado.uid ||
              data.clienteID === idClienteNoBanco ||
              (typeof data.clienteID === 'string' &&
                (data.clienteID.includes(usuarioLogado.uid) || data.clienteID.includes(idClienteNoBanco)));

            if (pertenceAoCliente) {
              listaTemporaria.push({
                id: docItem.id,
                ...data
              });
            }
          });

          setPedidos(listaTemporaria);
        });
      } catch (error) {
        console.log("Erro ao buscar pedidos do cliente:", error);
      }
    };

    carregarPedidosDoCliente();

    return () => {
      if (unsubscribePedidos) {
        unsubscribePedidos();
      }
    };
  }, [usuarioLogado]);

  const getInfoStatus = (status) => {
    const statusStr = String(status).toLowerCase();
    if (statusStr.includes('entregue') || statusStr === 'true') {
      return { cor: '#2E7D32', piscar: false };
    }
    if (statusStr.includes('cancelado')) {
      return { cor: '#C62828', piscar: false };
    }
    return { cor: '#EAD008', piscar: true };
  };

  const formatarTextoStatus = (status) => {
    if (typeof status === 'boolean') {
      return status ? 'Entregue' : 'Em processamento';
    }
    return status || 'Em processamento';
  };

  const pedidosFiltrados = pedidos.filter((item, index) => {
    const codigoFormatado = item.codigo || `00${index + 1}`;
    const nomeItem = item.itens?.nome || '';
    const statusTexto = formatarTextoStatus(item.status);

    return (
      nomeItem.toLowerCase().includes(pesquisa.toLowerCase()) ||
      codigoFormatado.toLowerCase().includes(pesquisa.toLowerCase()) ||
      statusTexto.toLowerCase().includes(pesquisa.toLowerCase())
    );
  });

  return (
    <Page>
      <View style={styles.boxTitle}>
        <Text style={styles.title}>Meus Pedidos</Text>
      </View>

      <View style={styles.containerBox}>
        {pedidos.length === 0 ? (
          <View style={styles.box}>
            <Feather name='shopping-cart' style={styles.icon} />
            <Text style={styles.text}>Nenhum pedido foi realizado</Text>
            <Text style={styles.subText}>Que tal dar uma olhada nos nossos produtos?</Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Produtos')}>
              <Text style={styles.buttonText}>Ver produtos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.boxTabela}>
            <View style={styles.searchBox}>
              <Feather name="search" size={18} color="#4A4A4A" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar pedido"
                placeholderTextColor="#888888"
                value={pesquisa}
                onChangeText={setPesquisa}
              />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.headerCell, styles.colPedido]}>Pedido</Text>
                  <Text style={[styles.headerCell, styles.colItens]}>Itens</Text>
                  <Text style={[styles.headerCell, styles.colTotal]}>Total</Text>
                  <Text style={[styles.headerCell, styles.colStatus]}>Status</Text>
                </View>

                {pedidosFiltrados.map((item, index) => {
                  const textoItem = item.itens?.nome
                    ? `${item.itens.quantidade > 1 ? `${item.itens.quantidade}x ` : ''}${item.itens.nome}`
                    : 'Sem itens';

                  const valorTotalFormatado = Number(item.total || 0).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  });

                  const statusTexto = formatarTextoStatus(item.status);
                  const { cor, piscar } = getInfoStatus(item.status);

                  return (
                    <View 
                      key={item.id}
                      style={[
                        styles.tableRow, 
                        index % 2 === 0 ? styles.rowEven : styles.rowOdd
                      ]}
                    >
                      <Text style={[styles.cell, styles.colPedido]}>
                        #{item.codigo || `00${index + 1}`}
                      </Text>

                      <Text style={[styles.cell, styles.colItens]} numberOfLines={1}>
                        {textoItem}
                      </Text>

                      <Text style={[styles.cell, styles.colTotal]}>
                        {valorTotalFormatado}
                      </Text>

                      <View style={[styles.cell, styles.colStatus, styles.statusCell]}>
                        <StatusDot cor={cor} piscar={piscar} />
                        <Text style={styles.statusText}>{statusTexto}</Text>
                      </View>
                    </View>
                  );
                })}

                {pedidosFiltrados.length === 0 && (
                  <Text style={styles.emptySearchText}>Nenhum pedido encontrado para essa busca.</Text>
                )}
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  boxTitle: {
    width: '100%',
    paddingHorizontal: 40,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontFamily: theme.typography.fonts.story,
  },
  containerBox: {
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  box: {
    width: '90%',
    paddingVertical: 40,
    paddingHorizontal: 16,
    backgroundColor: '#F2F0F1',
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#333333',
  },
  boxTabela: {
    width: '90%',
    paddingVertical: 20,
    paddingHorizontal: 14,
    backgroundColor: '#F2F0F1',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#333333',
  },
  icon: {
    color: '#6D76A6',
    fontSize: 45,
    marginBottom: 12,
  },
  text: {
    fontFamily: theme.typography.fonts.story,
    fontSize: 30,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    fontFamily: theme.typography.fonts.story,
    color: '#505050',
    textAlign: 'center',
  },
  button: {
    marginTop: 25,
    borderWidth: 1,
    borderRadius: 10,
    width: 180,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#6D76A6',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: theme.typography.fonts.story,
    color: '#6D76A6',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8A436A',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 38,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: theme.typography.fonts.story,
    fontSize: 14,
    color: '#333333',
  },
  table: {
    borderWidth: 1,
    borderColor: '#AAAAAA',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    minWidth: 380,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E5E5E5',
    borderBottomWidth: 1,
    borderColor: '#AAAAAA',
  },
  headerCell: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    fontFamily: theme.typography.fonts.story,
    fontSize: 15,
    color: '#111111',
    borderRightWidth: 1,
    borderColor: '#AAAAAA',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#AAAAAA',
    alignItems: 'center',
  },
  rowEven: {
    backgroundColor: '#DCDCDC',
  },
  rowOdd: {
    backgroundColor: '#EAEAEA',
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    fontFamily: theme.typography.fonts.story,
    fontSize: 13,
    color: '#111111',
    borderRightWidth: 1,
    borderColor: '#AAAAAA',
    textAlign: 'center',
    justifyContent: 'center',
  },
  colPedido: { width: 70 },
  colItens: { width: 140 },
  colTotal: { width: 85 },
  colStatus: { width: 135, borderRightWidth: 0 },
  statusCell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: theme.typography.fonts.story,
    fontSize: 12,
    color: '#222222',
  },
  emptySearchText: {
    textAlign: 'center',
    paddingVertical: 16,
    fontFamily: theme.typography.fonts.story,
    color: '#666666',
  },
});
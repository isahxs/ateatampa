import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { collection, getDocs } from 'firebase/firestore';

import { db } from '../../services/firebase';
import { theme } from '../../theme';

import Card from '../../components/Card';

export default function Produtos({ navigation }) {
    const insets = useSafeAreaInsets();

    const [products, setProducts] = useState([]);

    const handleProductPress = (productId) => {
        navigation.navigate('Produto', {
            productId,
        });
    };

    useEffect(() => {
        const getProducts = async () => {
            try {
                const docsRef = collection(db, 'produtos');
                const querySnapshot = await getDocs(docsRef);

                const productsList = [];

                querySnapshot.forEach((doc) => {
                    productsList.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });

                setProducts(productsList);
            } catch (error) {
                console.log('An error occurred:', error);
            }
        };
        getProducts();
    }, []);

    const HeroSection = () => (
        <View style={styles.hero}>
            <Text style={styles.title}>Nossos Produtos</Text>

            <Text style={styles.subtitle}>Aproveite nossa variedade de sabores!</Text>
        </View>
    );

    return (
        <View
            style={[
                styles.container,
                {
                    paddingBottom: insets.bottom,
                },
            ]}
        >
            <FlatList
                keyExtractor={(item) => item.id.toString()}
                data={products}
                renderItem={({ item }) => (
                    <Card
                        title={item.nome}
                        price={item.preco}
                        image={item.imagemUrl}
                        onPress={() => handleProductPress(item.id)}
                        showFooter={true}
                    />
                )}
                numColumns={2}
                columnWrapperStyle={styles.grid}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={HeroSection}
                contentContainerStyle={styles.content}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        flex: 1,
    },

    hero: {
        marginTop: theme.spacing[4],
        marginBottom: theme.spacing[8],
    },

    content: {
        paddingHorizontal: theme.spacing[3],
        paddingBottom: theme.spacing[6],
    },

    grid: {
        flex: 1,
        justifyContent: 'space-between',
        gap: theme.spacing[4],
        marginBottom: theme.spacing[5],
    },

    title: {
        color: theme.colors.title,
        fontFamily: theme.typography.fonts.story,
        fontSize: theme.typography.sizes.xl,
        fontWeight: theme.typography.weights.medium,
        marginBottom: theme.spacing[2],
    },

    subtitle: {
        color: theme.colors.title,
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.light,
    },
});

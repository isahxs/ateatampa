import { StyleSheet, View, FlatList } from 'react-native';
import { useState } from 'react';

import { theme } from '../../theme';

import Card from '../Card';

export default function Carousel({ data, cardStyle, onCardPress }) {
    const [curIndex, setCurIndex] = useState(0);

    /**
     * Define o ponto de parada do carrossel.
     * Ele calcula o espaço em pixels de 2 Cards que ocupam a tela por vez:
     *
     * Fórmula: (`CardWidth` * `Amount`) + `Total Horizontal Margins`
     */
    const cardInterval = 392;

    return (
        <View style={styles.container}>
            <FlatList
                keyExtractor={(item) => item.id.toString()}
                data={data}
                renderItem={({ item }) => (
                    <View style={styles.cardContainer}>
                        <Card
                            style={cardStyle}
                            title={item.name}
                            image={item.imageUrl}
                            onPress={() => onCardPress?.(item.id)}
                        />
                    </View>
                )}
                onScroll={(event) => {
                    const totalDragged = event.nativeEvent.contentOffset.x;
                    const currentPage = Math.round(totalDragged / cardInterval);
                    setCurIndex(currentPage * 2);
                }}
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
                snapToAlignment='center'
                snapToInterval={cardInterval}
                horizontal
            />

            <View
                style={[
                    theme.utils.flexRow,
                    theme.utils.justifyCenter,
                    { gap: theme.spacing[4], marginTop: theme.spacing[3] },
                ]}
            >
                {data.map((item, index) => {
                    if (index % 2 !== 0) return null;

                    return (
                        <View
                            key={index}
                            style={{
                                backgroundColor: index === curIndex ? '#808080' : '#FAFAFA',
                                width: 16,
                                height: 16,
                                borderRadius: theme.borders.radius.md,
                            }}
                        />
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: theme.spacing[4],
    },

    cardContainer: {
        marginHorizontal: theme.spacing[2],
    },
});

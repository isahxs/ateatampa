import { StyleSheet, View, FlatList } from 'react-native';
import { useState } from 'react';

import { theme } from '../../theme';

import Card from '../Card';

const cardWidth = 180;
const cardsPerPage = 2;
const cardHorizontalMargin = theme.spacing[2];

const pageInterval = cardWidth * cardsPerPage + cardHorizontalMargin * 2 * cardsPerPage;

export default function Carousel({ data = [], cardStyle = 'Standard', onCardPress }) {
    const [currentPage, setCurrentPage] = useState(0);

    const pageCount = Math.ceil(data.length / cardsPerPage);

    const handleScrollEnd = (event) => {
        const horizontalOffset = event.nativeEvent.contentOffset.x;

        const nextPage = Math.round(horizontalOffset / pageInterval);

        setCurrentPage(nextPage);
    };

    const renderItem = ({ item }) => {
        return (
            <View style={styles.cardContainer}>
                <Card
                    style={cardStyle}
                    title={item.name}
                    price={item.price}
                    image={item.imageUrl}
                    onPress={() => onCardPress?.(item.id)}
                />
            </View>
        );
    };

    if (data.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                onMomentumScrollEnd={handleScrollEnd}
                showsHorizontalScrollIndicator={false}
                snapToAlignment='start'
                snapToInterval={pageInterval}
                decelerationRate='fast'
                horizontal
            />

            {pageCount > 1 && (
                <View style={styles.pagination}>
                    {Array.from({ length: pageCount }).map((_, pageIndex) => (
                        <View
                            key={pageIndex}
                            style={[styles.paginationDot, pageIndex === currentPage && styles.paginationDotActive]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: theme.spacing[4],
    },

    cardContainer: {
        marginHorizontal: cardHorizontalMargin,
    },

    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: theme.spacing[4],
        marginTop: theme.spacing[3],
    },

    paginationDot: {
        backgroundColor: theme.colors.cardBackground,
        width: 16,
        height: 16,
        borderRadius: theme.borders.radius.md,
    },

    paginationDotActive: {
        backgroundColor: theme.colors.mutedMedium,
    },
});

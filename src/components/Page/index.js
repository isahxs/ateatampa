import { ScrollView, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Footer from '../Footer';

export default function Page({ children, footer = true }) {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <View style={[styles.content, !footer && { paddingBottom: 24 + insets.bottom }]}>{children}</View>
            {footer && <Footer />}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        backgroundColor: '#F2F0E4',
    },
    container: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 24,
    },
});

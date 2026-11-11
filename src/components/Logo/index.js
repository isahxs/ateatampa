import { StyleSheet, View, Image } from 'react-native';

import { theme } from '../../theme';

import imageLogo from '../../assets/logo.png';

export default function Logo({
    width = 100,
    height = 100
}) {
    return (
        <View style={styles.container}>
            <Image
                style={[
                    styles.imgLogo,
                    {
                        width: width,
                        height: height
                    }
                ]}
                source={imageLogo} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing[4]
    },

    imgLogo: {
        resizeMode: 'contain'
    }
});
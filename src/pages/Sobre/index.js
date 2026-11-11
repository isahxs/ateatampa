import { useWindowDimensions, StyleSheet, View, ScrollView, Text, Image } from 'react-native';

import { theme } from '../../theme';

import Page from '../../components/Page';

import ImgAboutBackground from '../../assets/about-background.jpg';

export default function Sobre() {
    const { width } = useWindowDimensions();

    return (
        <Page>
            <ScrollView
                style={style.scroll}
                contentContainerStyle={style.container}
                showsVerticalScrollIndicator={false}
            >
                <View style={style.container}>
                    <View style={style.boxtitle}>
                        <Text style={style.title}>Conheça nossa história</Text>
                    </View>

                    <View style={style.box}>
                        <Text style={style.text}>
                            Meu nome é Gabriella e a minha história, assim como a do Até a Tampa, nasceu um dos momentos
                            mais desafiadores da minha vida. Durante a minha gestação de gêmeos, um erro médico tirou de
                            nós um dos nossos bebês. O nosso pequeno guerreiro que permaneceu conosco veio ao mundo com
                            microcefalia, hidrocefalia e paralisia cerebral — e, desde então, nossa jornada se tornou um
                            caminho de superação, fé e amor incondicional.
                        </Text>
                    </View>

                    <View style={style.box}>
                        <Text style={style.text}>
                            Em meio a tantas mudanças e emoções intensas, meu marido e incentivou a encontrar algo que
                            me trouxesse leveza, propósito e também ajudasse na renda da nossa família. Foi assim que
                            surgiu a ideia dos bolos de pote. Eu escolhi não transformar nossa história na minha
                            história, e sim na nossa. Porque tudo que construímos até aqui nasce da força da nossa
                            família.
                        </Text>
                    </View>

                    <View style={style.img}>
                        <Image
                            style={[
                                style.img,
                                {
                                    width: width * 0.9,
                                },
                            ]}
                            source={ImgAboutBackground}
                            resizeMode='cover'
                        />
                    </View>

                    <View style={style.box}>
                        <Text style={style.text}>
                            Meu compromisso é que, ao provar nossos bolos, você sinta exatamente isso, a doçura de algo
                            feito com o coração e a certeza de que cada potinho é preparado com todo o carinho que nossa
                            história merece e que você também merece receber.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </Page>
    );
}

const style = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingBottom: 40,
    },

    scroll: {
        flex: 1,
        backgroundColor: '#F2F0E4',
        width: '100%',
    },

    box: {
        width: '90%',
        backgroundColor: '#D9BD8B',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: 20,
        padding: 16,
    },

    boxtitle: {
        width: '90%',
        paddingVertical: 15,
        backgroundColor: '#D9BD8B',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: 30,
        paddingLeft: 50,
        paddingRight: 50,
    },

    title: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: theme.typography.fonts.story,
        color: '#161C5C',
    },

    text: {
        fontSize: 15,
        textAlign: 'center',
        fontFamily: theme.typography.fonts.noto,
        color: '#161C5C',
    },

    img: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: '95%',
        height: 70,
        marginBottom: 15,
    },
});

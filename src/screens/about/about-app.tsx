import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import {
    StatusBar,
    Dimensions,
    TouchableOpacity,
    Text,
    View,
    StyleSheet,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolate,
    runOnJS,
    interpolateColor,
    SharedValue,
} from 'react-native-reanimated';
import { RootStackParamList } from '../../navigations/navigation';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

type AboutNavigationProp = StackNavigationProp<RootStackParamList>;

const DURATION = 1000;
const TEXT_DURATION = DURATION * 0.8;

const quotes = [
    {
        quote: 'Welcome to JobFinder, your ultimate tool for finding your dream job. With JobFinder, you can search through thousands of job listings from top companies worldwide. Our advanced search filters and personalized recommendations make it easier than ever to find the perfect job that matches your skills and interests.',
        author: 'JobFinder Team',
    },
    {
        quote: 'At JobFinder, we believe in connecting talent with opportunities. Our platform is designed to help you navigate the job market effortlessly. Whether you are looking for a full-time position, part-time work, or freelance gigs, JobFinder has got you covered with a wide range of job listings.',
        author: 'JobFinder Team',
    },
    {
        quote: 'Finding your next career move should be a seamless and stress-free experience. With JobFinder, you can explore thousands of job listings, receive alerts for new opportunities, and apply to jobs with just a few clicks. Our user-friendly interface and powerful tools make job hunting simple, fast, and effective.',
        author: 'JobFinder Team',
    },
    {
        quote: 'Our app helps you navigate the job market effortlessly. From personalized job recommendations to resume-building tips, JobFinder provides all the resources you need to land your next job. We are committed to helping you achieve your career goals and find a job that you love.',
        author: 'JobFinder Team',
    },
    {
        quote: "Don't wait for opportunities, create them with JobFinder. Our platform empowers you to take control of your career and find the job that you have always dreamed of. With JobFinder, you can stay ahead of the competition and seize the best job opportunities in your field.",
        author: 'JobFinder Team',
    },
    {
        quote: 'Explore thousands of job listings tailored to your skills and preferences. JobFinder uses advanced algorithms to match you with the best job opportunities based on your profile. Whether you are a recent graduate or an experienced professional, we have jobs for all career levels.',
        author: 'JobFinder Team',
    },
    {
        quote: 'Job hunting made simple, fast, and effective. With our app, you can search for jobs, track your applications, and receive notifications about new job openings. JobFinder is your one-stop solution for all your job search needs.',
        author: 'JobFinder Team',
    },
    {
        quote: 'Your career journey starts here with JobFinder. Our app is designed to support you every step of the way, from job search to application and beyond. Join thousands of satisfied users who have found their dream jobs with JobFinder.',
        author: 'JobFinder Team',
    },
    {
        quote: 'Find the job you love and make your professional dreams come true with JobFinder. Our platform offers a wide range of job opportunities in various industries and locations. Start your job search today and take the first step towards a successful career with JobFinder.',
        author: 'JobFinder Team',
    },
];


type ColorScheme = {
    initialBgColor: string;
    bgColor: string;
    nextBgColor: string;
};

const colors: ColorScheme[] = [
    {
        initialBgColor: 'goldenrod',
        bgColor: '#222',
        nextBgColor: '#222',
    },
    {
        initialBgColor: 'goldenrod',
        bgColor: '#222',
        nextBgColor: 'yellowgreen',
    },
    {
        initialBgColor: '#222',
        bgColor: 'yellowgreen',
        nextBgColor: 'midnightblue',
    },
    {
        initialBgColor: 'yellowgreen',
        bgColor: 'midnightblue',
        nextBgColor: 'turquoise',
    },
    {
        initialBgColor: 'midnightblue',
        bgColor: 'turquoise',
        nextBgColor: 'goldenrod',
    },
    {
        initialBgColor: 'turquoise',
        bgColor: 'goldenrod',
        nextBgColor: '#222',
    },
];

interface CircleProps {
    onPress: () => void;
    index: number;
    animatedValue: SharedValue<number>;
    animatedValue2: SharedValue<number>;
}

const Circle: React.FC<CircleProps> = ({ onPress, index, animatedValue, animatedValue2 }) => {
    const { initialBgColor, nextBgColor, bgColor } = colors[index];
    const inputRange = [0, 0.001, 0.5, 0.501, 1];

    const backgroundColor = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                animatedValue2.value,
                inputRange,
                [
                    initialBgColor,
                    initialBgColor,
                    initialBgColor,
                    bgColor,
                    bgColor,
                ],
            ),
        };
    });

    const dotBgColor = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                animatedValue2.value,
                [0, 0.001, 0.5, 0.501, 0.8, 1],
                [
                    bgColor,
                    bgColor,
                    bgColor,
                    initialBgColor,
                    initialBgColor,
                    nextBgColor,
                ],
            ),
            transform: [
                { perspective: 400 },
                {
                    rotateY: interpolate(
                        animatedValue2.value,
                        [0, 0.5, 1],
                        [0, -90, -180],
                    ).toString().concat('deg')
                },
                {
                    scale: interpolate(animatedValue2.value, [0, 0.5, 1], [1, 6, 1]),
                },
                {
                    translateX: interpolate(
                        animatedValue2.value,
                        [0, 0.5, 1],
                        [0, 50, 0],
                    )
                },
            ],
        };
    });

    const buttonStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: interpolate(animatedValue.value, [0, 0.05, 0.5, 1], [1, 0, 0, 1]),
                },
                {
                    rotateY: interpolate(animatedValue.value, [0, 0.5, 0.8, 1], [0, 180, 180, 180]).toString().concat('deg')
                },
            ],
            opacity: interpolate(animatedValue.value, [0, 0.05, 0.8, 1], [1, 0, 0, 1]),
        };
    });

    return (
        <Animated.View style={[StyleSheet.absoluteFillObject, styles.container, backgroundColor]}>
            <Animated.View style={[styles.circle, dotBgColor]}>
                <TouchableOpacity onPress={onPress}>
                    <Animated.View style={[styles.button, buttonStyle]}>
                        <Text>Next</Text>
                    </Animated.View>
                </TouchableOpacity>
            </Animated.View>
        </Animated.View>
    );
};

const AboutApp: React.FC = () => {
    const animatedValue = useSharedValue(0);
    const animatedValue2 = useSharedValue(0);
    const sliderAnimatedValue = useSharedValue(0);
    const [index, setIndex] = React.useState(0);
    const navigation = useNavigation<AboutNavigationProp>();
    const goBack = () => { navigation.goBack() }
    const onPress = () => {
        animatedValue.value = 0;
        animatedValue2.value = 0;
        sliderAnimatedValue.value = withTiming(index + 1, { duration: TEXT_DURATION }, (isFinished) => {
            if (isFinished) {
                runOnJS(setIndex)((index + 1) % colors.length);
                if (index === colors.length - 1) {
                    runOnJS(goBack)()
                }
            }
        });
        animatedValue.value = withTiming(1, { duration: DURATION });
        animatedValue2.value = withTiming(1, { duration: DURATION });
    };

    const sliderStyle = useAnimatedStyle(() => {
        const inputRange = Array.from({ length: quotes.length }, (_, i) => i);
        return {
            transform: [
                {
                    translateX: interpolate(
                        sliderAnimatedValue.value,
                        inputRange,
                        quotes.map((_, i) => -i * width * 2),
                    ),
                },
            ],
            opacity: interpolate(
                sliderAnimatedValue.value,
                Array.from({ length: quotes.length * 2 + 1 }, (_, i) => i / 2),
                Array.from({ length: quotes.length * 2 + 1 }, (_, i) => (i % 2 === 0 ? 1 : 0)),
            ),
        };
    });

    return (
        <View style={{ flex: 1, justifyContent: 'flex-start', paddingTop: 100 }}>
            <StatusBar hidden />
            <Circle index={index} onPress={onPress} animatedValue={animatedValue} animatedValue2={animatedValue2} />
            <Animated.View style={[{ flexDirection: 'row' }, sliderStyle]}>
                {quotes.slice(0, colors.length).map(({ quote, author }, i) => {
                    return (
                        <View style={{ paddingRight: width, width: width * 2 }} key={i}>
                            <Text style={[styles.paragraph, { color: colors[i].nextBgColor }]}>
                                {quote}
                            </Text>
                            <Text
                                style={[
                                    styles.paragraph,
                                    {
                                        color: colors[i].nextBgColor,
                                        fontSize: 10,
                                        fontWeight: 'normal',
                                        textAlign: 'right',
                                        opacity: 0.8,
                                    },
                                ]}
                            >
                                ______ {author}
                            </Text>
                        </View>
                    );
                })}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        //   paddingTop: Constants.statusBarHeight,
        padding: 8,
        paddingBottom: 50,
    },
    paragraph: {
        margin: 12,
        fontSize: 24,
        textAlign: 'auto',
        color: 'white',
    },
    button: {
        height: 100,
        width: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        backgroundColor: 'turquoise',
        width: 100,
        height: 100,
        borderRadius: 50,
    },
});

export default AboutApp;
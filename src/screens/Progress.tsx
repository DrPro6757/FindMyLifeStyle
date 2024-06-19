import { View, Text, TextInput } from 'react-native'
import React from 'react'
import Animated, { interpolateColor, useAnimatedProps, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated'
import { Svg, Circle } from 'react-native-svg'


const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(TextInput);

const radius = 45;
const circumference = radius * Math.PI * 2;
const duration = 6000;
const Progress = () => {


    const strokeOffset = useSharedValue(circumference);
    const prercentage = useDerivedValue(() => {
        const number = ((circumference - strokeOffset.value)/circumference)*100
        return withTiming(number)
    })
    const strokeColor = useDerivedValue(()=>{
        return interpolateColor(
            prercentage.value,
            [0,50,100],
            ['#9E4784','#66347f','#37306B']
        );
    });
    
    const animatedCircleProps = useAnimatedProps(()=>{
        return{
            strokeDashoffset: withTiming(strokeOffset.value,{duration:duration}),
            stroke: strokeColor.value,
        };
    });

    const animatedTextProps = useAnimatedProps(()=>{
        return{
            text:`${Math.round(prercentage.value)}%`
        }
    })

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <Text>Progress Bar</Text>
            <AnimatedText
            style={{
                color :'#373068',
                fontSize:24,
                fontWeight:'bold',
                position:'absolute'
            }}
            animatedProps={animatedTextProps}
            />
            <Svg height="50%" width="50%" viewBox='0 0 100 100'>
                <Circle
                    cx='50'
                    cy='50'
                    r='45'
                    stroke='#E7E7E7'
                    strokeWidth='10'
                    fill='transparent'
                >

                </Circle>
                <AnimatedCircle
                animatedProps={animatedCircleProps}
                cx='50'
                cy='50'
                r='45'
                strokeDasharray={`${radius * Math.PI * 2}`}
                strokeWidth='10'
                fill='transparent'
                 />
            </Svg>

        </View>
    )
}

export default Progress
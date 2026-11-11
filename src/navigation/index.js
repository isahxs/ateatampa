import { NavigationContainer } from '@react-navigation/native';

import RootStack from './stacks/RootStack';

export default function AppNavigation() {
    return (
        <NavigationContainer>
            <RootStack />
        </NavigationContainer>
    );
}
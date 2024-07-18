// navigationRef.tsx

import { NavigationContainerRef } from '@react-navigation/native';
import { createRef } from 'react';
import { RootStackParamList } from './navigation';

export const navigationRef = createRef<NavigationContainerRef<RootStackParamList>>();

import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { createApi } from '../../lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function QrCodeScreen() {
    const { accessToken } = useAuth();

    return (
        <ProtectedRoute
            allowedRoles={['participant']}
        >
            <View>
                
            </View>
        </ProtectedRoute>
    )
}
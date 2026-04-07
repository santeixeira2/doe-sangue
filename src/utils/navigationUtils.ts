import { Linking, Platform } from 'react-native';

export type MapProvider = 'google' | 'waze' | 'apple';

export const openMapRoute = (lat: number, lon: number, provider: MapProvider, label: string = 'Hospital') => {
  let url = '';

  const latLng = `${lat},${lon}`;
  
  switch (provider) {
    case 'google':
      url = Platform.select({
        ios: `comgooglemaps://?daddr=${latLng}&directionsmode=driving`,
        android: `google.navigation:q=${latLng}`,
      }) || `https://www.google.com/maps/dir/?api=1&destination=${latLng}`;
      break;
    
    case 'waze':
      url = `waze://?ll=${latLng}&navigate=yes`;
      break;
    
    case 'apple':
      url = `maps://0,0?q=${label}@${latLng}`;
      break;
  }

  Linking.canOpenURL(url).then((supported) => {
    if (supported) {
      Linking.openURL(url);
    } else {
      // Fallback para browser se o app não estiver instalado
      const browserUrl = `https://www.google.com/maps/dir/?api=1&destination=${latLng}`;
      Linking.openURL(browserUrl);
    }
  });
};

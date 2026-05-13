# Vendored from @santeixeira2/react-native-geolocation-bridge (upstream has no CocoaPods layout).
Pod::Spec.new do |s|
  s.name         = 'GeolocationBridge'
  s.version      = '1.0.0'
  s.summary      = 'React Native geolocation bridge'
  s.license      = { :type => 'MIT' }
  s.authors      = { 'santeixeira2' => 'https://github.com/santeixeira2' }
  s.homepage     = 'https://github.com/santeixeira2/react-native-geolocation-bridge'
  s.platform     = :ios, '15.1'
  s.source       = { :path => '.' }
  s.source_files = '*.{h,m}'
  s.frameworks   = 'CoreLocation'
  s.dependency 'React-Core'
end

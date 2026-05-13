#import "GeolocationBridge.h"
#import <CoreLocation/CoreLocation.h>

@interface GeolocationBridge () <CLLocationManagerDelegate>
@property(nonatomic, strong) CLLocationManager *locationManager;
@property(nonatomic, assign) BOOL tracking;
@property(nonatomic, copy) RCTPromiseResolveBlock permissionResolver;
@end

@implementation GeolocationBridge

RCT_EXPORT_MODULE();

- (instancetype)init {
  if (self = [super init]) {
    _locationManager = [CLLocationManager new];
    _locationManager.delegate = self;
    _locationManager.desiredAccuracy = kCLLocationAccuracyBest;
  }
  return self;
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[ @"LOCATION_UPDATE", @"LOCATION_ERROR" ];
}

RCT_REMAP_METHOD(hasLocationPermission,
                 hasLocationPermissionWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  CLAuthorizationStatus s = self.locationManager.authorizationStatus;
  BOOL granted = (s == kCLAuthorizationStatusAuthorizedAlways || s == kCLAuthorizationStatusAuthorizedWhenInUse);
  resolve(@(granted));
}

RCT_REMAP_METHOD(requestLocationPermission,
                 requestLocationPermissionWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  self.permissionResolver = resolve;
  [self.locationManager requestWhenInUseAuthorization];
}

RCT_REMAP_METHOD(isLocationEnabled,
                 isLocationEnabledWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  resolve(@([CLLocationManager locationServicesEnabled]));
}

RCT_REMAP_METHOD(getCurrentLocation,
                 getCurrentLocationWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  CLLocation *location = self.locationManager.location;
  if (!location) {
    reject(@"LOCATION_UNAVAILABLE", @"No location available", nil);
    return;
  }
  resolve([self toMap:location]);
}

RCT_REMAP_METHOD(startLocationUpdates,
                 startLocationUpdates:(nonnull NSNumber *)updateInterval
                 updateDistance:(nonnull NSNumber *)updateDistance
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  self.locationManager.distanceFilter = updateDistance.doubleValue;
  [self.locationManager startUpdatingLocation];
  self.tracking = YES;
  resolve(@YES);
}

RCT_REMAP_METHOD(stopLocationUpdates,
                 stopLocationUpdatesWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  [self.locationManager stopUpdatingLocation];
  self.tracking = NO;
  resolve(@YES);
}

- (NSDictionary *)toMap:(CLLocation *)location {
  return @{
    @"latitude": @(location.coordinate.latitude),
    @"longitude": @(location.coordinate.longitude),
    @"accuracy": @(location.horizontalAccuracy),
    @"altitude": @(location.altitude),
    @"speed": @(location.speed),
    @"bearing": @(location.course),
    @"time": @([location.timestamp timeIntervalSince1970] * 1000.0)
  };
}

- (void)locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status {
  if (!self.permissionResolver) return;
  BOOL granted = (status == kCLAuthorizationStatusAuthorizedAlways || status == kCLAuthorizationStatusAuthorizedWhenInUse);
  self.permissionResolver(@(granted));
  self.permissionResolver = nil;
}

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray<CLLocation *> *)locations {
  if (!self.tracking) return;
  CLLocation *last = locations.lastObject;
  if (last) {
    [self sendEventWithName:@"LOCATION_UPDATE" body:[self toMap:last]];
  }
}

@end

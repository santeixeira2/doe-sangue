import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
  SlideInRight,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Button } from '../../../components/Button';
import { useAuthStore } from '../../../store/authStore';
import { colors } from '../../../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  title: string;
  description: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    icon: 'notifications',
    iconBg: colors.primary[50],
    title: 'Somente Quando\nVocê é Necessário',
    description:
      'Receba notificações instantâneas quando seu tipo sanguíneo específico é necessário por perto. Sem spam.',
  },
  {
    id: '2',
    icon: 'document-text',
    iconBg: colors.teal[50],
    title: 'Pule a\nBurocracia',
    description:
      'Complete a pré-triagem no celular e vá direto para a doação, sem filas de espera.',
  },
  {
    id: '3',
    icon: 'heart',
    iconBg: colors.primary[50],
    title: 'Salve 3 Vidas\nHoje',
    description:
      'Junte-se à rede de Salvadores Ativos da sua cidade. Pronto para ser um herói?',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const setOnboarded = useAuthStore((s) => s.setOnboarded);
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = () => {
    setOnboarded();
    router.replace('/login');
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => (
    <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
      {/* Illustration Area */}
      <View style={styles.illustrationContainer}>
        <View style={[styles.illustrationBg, { backgroundColor: item.iconBg }]}>
          <View style={styles.iconCircleOuter}>
            <View style={styles.iconCircleInner}>
              <Ionicons
                name={item.icon}
                size={48}
                color={colors.primary.DEFAULT}
              />
            </View>
          </View>
          {/* Decorative elements */}
          <View style={[styles.decorDot, styles.dotTopRight]} />
          <View style={[styles.decorDot, styles.dotBottomLeft]} />
          <View style={[styles.decorLine, styles.lineTop]} />
          <View style={[styles.decorLine, styles.lineBottom]} />
          {/* Floating hearts */}
          <View style={styles.floatingHeart1}>
            <Ionicons name="heart" size={16} color={colors.primary[200]} />
          </View>
          <View style={styles.floatingHeart2}>
            <Ionicons name="heart" size={12} color={colors.primary[100]} />
          </View>
          <View style={styles.floatingHeart3}>
            <Ionicons name="heart" size={20} color={colors.primary.DEFAULT} />
          </View>
        </View>
      </View>

      {/* Pagination Dots */}
      <View style={styles.dotsContainer}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>

      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        bounces={false}
      />

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        {isLastSlide ? (
          <Button
            title="Começar"
            onPress={handleGetStarted}
            icon={<Ionicons name="arrow-forward" size={20} color="#FFF" />}
          />
        ) : (
          <View style={styles.buttonRow}>
            <Button
              title="Pular"
              onPress={handleSkip}
              variant="secondary"
              fullWidth={false}
              style={styles.skipButton}
            />
            <Button
              title="Próximo"
              onPress={handleNext}
              fullWidth={false}
              style={styles.nextButton}
              icon={<Ionicons name="arrow-forward" size={18} color="#FFF" />}
            />
          </View>
        )}
      </View>

      {/* Bottom red bar */}
      <View style={styles.bottomBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  slide: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  illustrationBg: {
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_WIDTH * 0.65,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  iconCircleOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  decorDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary.DEFAULT,
    opacity: 0.4,
  },
  dotTopRight: {
    top: 24,
    right: 32,
  },
  dotBottomLeft: {
    bottom: 32,
    left: 24,
  },
  decorLine: {
    position: 'absolute',
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary.DEFAULT,
    opacity: 0.2,
  },
  lineTop: {
    top: 40,
    left: 40,
    transform: [{ rotate: '45deg' }],
  },
  lineBottom: {
    bottom: 48,
    right: 40,
    transform: [{ rotate: '-30deg' }],
  },
  floatingHeart1: {
    position: 'absolute',
    top: 32,
    right: 48,
  },
  floatingHeart2: {
    position: 'absolute',
    bottom: 40,
    left: 48,
  },
  floatingHeart3: {
    position: 'absolute',
    top: 56,
    left: 32,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: colors.primary.DEFAULT,
    width: 24,
  },
  dotInactive: {
    backgroundColor: colors.primary[100],
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  bottomContainer: {
    paddingHorizontal: 32,
    paddingBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  skipButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1.5,
  },
  bottomBar: {
    height: 5,
    backgroundColor: colors.primary.DEFAULT,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});

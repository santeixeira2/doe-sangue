import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter} from 'expo-router';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { colors } from '../../../theme/colors';
import { borderRadius } from '../../../theme/spacing';
import { mockApi } from '../../../services/mockApi';
import { EligibilityQuestion } from '../../../types';

export default function SafetyCheckScreen() {
  const router = useRouter();
  const [questions, setQuestions] = useState<EligibilityQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    const qs = await mockApi.eligibility.getQuestions();
    setQuestions(qs);
    setLoading(false);
  };

  const handleAnswer = (questionId: string, answer: boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const isAllAnswered = questions.length > 0 && questions.every((q) => answers[q.id] !== undefined);

  const isEligible = questions.every((q) => {
    const answer = answers[q.id];
    if (answer === undefined) return true;
    // If disqualifyOnYes is true and user answered yes, not eligible
    if (q.disqualifyOnYes && answer) return false;
    // If disqualifyOnYes is false and user answered no (e.g. "feeling well?" answered no)
    if (!q.disqualifyOnYes && !answer) return false;
    return true;
  });

  const handleConfirm = () => {
    if (isEligible) {
      router.push('/map-navigation');
    } else {
      Alert.alert(
        'Inelegível no momento',
        'Com base nas suas respostas, você não está apto a doar sangue agora. Tente novamente em breve.',
        [{ text: 'Entendi', onPress: () => router.back() }]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Triagem</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text style={styles.title}>
            Você está apto{'\n'}a doar agora?
          </Text>
          <Text style={styles.subtitle}>
            Por favor, responda honestamente para economizar tempo no hospital.
          </Text>
        </Animated.View>

        {/* Questions */}
        {questions.map((question, index) => (
          <Animated.View
            key={question.id}
            entering={FadeInDown.delay(200 + index * 100).duration(400)}
          >
            <View style={styles.questionCard}>
              <Text style={styles.questionText}>{question.question}</Text>
              <View style={styles.answerButtons}>
                <TouchableOpacity
                  onPress={() => handleAnswer(question.id, false)}
                  style={[
                    styles.answerButton,
                    answers[question.id] === false && styles.answerButtonNoActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="close"
                    size={18}
                    color={answers[question.id] === false ? '#FFF' : colors.text.muted}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleAnswer(question.id, true)}
                  style={[
                    styles.answerButton,
                    answers[question.id] === true && styles.answerButtonYesActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="checkmark"
                    size={18}
                    color={answers[question.id] === true ? '#FFF' : colors.text.muted}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <Button
          title="Confirmar e Navegar"
          onPress={handleConfirm}
          disabled={!isAllAnswered}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 8,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  content: {
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text.primary,
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: 28,
  },
  questionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: '500',
    lineHeight: 21,
    marginRight: 12,
  },
  answerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  answerButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  answerButtonNoActive: {
    backgroundColor: colors.text.muted,
    borderColor: colors.text.muted,
  },
  answerButtonYesActive: {
    backgroundColor: colors.teal.DEFAULT,
    borderColor: colors.teal.DEFAULT,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 28,
    paddingBottom: 36,
    paddingTop: 16,
    backgroundColor: colors.background,
  },
});

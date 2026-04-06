import {
  BloodRequest,
  BloodType,
  DonationRecord,
  DonorProfile,
  EligibilityQuestion,
  Notification,
  UrgencyLevel,
} from '../types';

// ─── Mock Data ───

const HOSPITALS = [
  'Hospital São José',
  'Hospital Universitário Walter Cantídio',
  'Hospital Geral de Fortaleza',
  'Hospital do Coração',
  'Santa Casa de Misericórdia',
  'Hospital Albert Sabin',
  'Hospital Infantil',
  'UPA do Jangurussu',
];

const ADDRESSES = [
  'R. Prof. Costa Mendes, 1608 - Rodolfo Teófilo',
  'Av. Abolição, 4043 - Mucuripe',
  'R. Ávila Goulart, 900 - Papicu',
  'R. Des. Lauro Nogueira, 1500 - Papicu',
  'R. Barão do Rio Branco, 1816 - Centro',
  'R. Tertuliano Sales, 544 - Vila União',
  'Av. Santos Dumont, 5753 - Papicu',
  'R. Beni de Carvalho, s/n - Jangurussu',
];

function randomId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBloodType(): BloodType {
  const types: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  return randomItem(types);
}

function randomUrgency(): UrgencyLevel {
  const levels: UrgencyLevel[] = ['critical', 'high', 'medium', 'low'];
  const weights = [0.15, 0.30, 0.35, 0.20];
  const r = Math.random();
  let cumulative = 0;
  for (let i = 0; i < levels.length; i++) {
    cumulative += weights[i];
    if (r <= cumulative) return levels[i];
  }
  return 'medium';
}

function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function hoursFromNow(hours: number): string {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date.toISOString();
}

// ─── Generate Mock Data ───

function generateRequests(count: number): BloodRequest[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `req-${randomId()}`,
    bloodType: randomBloodType(),
    hospitalName: HOSPITALS[i % HOSPITALS.length],
    hospitalAddress: ADDRESSES[i % ADDRESSES.length],
    urgency: randomUrgency(),
    unitsNeeded: Math.floor(Math.random() * 5) + 1,
    unitsFulfilled: Math.floor(Math.random() * 3),
    distance: parseFloat((Math.random() * 20 + 0.5).toFixed(1)),
    createdAt: daysAgo(Math.floor(Math.random() * 3)),
    expiresAt: hoursFromNow(Math.floor(Math.random() * 48) + 6),
    description: 'Paciente necessita de transfusão urgente. Por favor, entre em contato com o hospital.',
    contactPhone: `(85) 9${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`,
    latitude: -3.7327 + (Math.random() - 0.5) * 0.05,
    longitude: -38.5270 + (Math.random() - 0.5) * 0.05,
  }));
}

function generateDonationHistory(): DonationRecord[] {
  return [
    {
      id: 'don-1',
      date: daysAgo(90),
      hospitalName: 'Hospital São José',
      bloodType: 'O-',
      status: 'completed',
      livesSaved: 3,
    },
    {
      id: 'don-2',
      date: daysAgo(180),
      hospitalName: 'Hospital Universitário Walter Cantídio',
      bloodType: 'O-',
      status: 'completed',
      livesSaved: 3,
    },
    {
      id: 'don-3',
      date: daysAgo(270),
      hospitalName: 'Hospital do Coração',
      bloodType: 'O-',
      status: 'completed',
      livesSaved: 3,
    },
    {
      id: 'don-4',
      date: daysAgo(365),
      hospitalName: 'Santa Casa de Misericórdia',
      bloodType: 'O-',
      status: 'completed',
      livesSaved: 3,
    },
  ];
}

function generateNotifications(): Notification[] {
  return [
    {
      id: 'notif-1',
      title: '🚨 Pedido Urgente',
      message: 'O- é necessário urgentemente no Hospital São José. Você está a 3.2 km.',
      type: 'urgent_request',
      isRead: false,
      createdAt: daysAgo(0),
      relatedRequestId: 'req-1',
    },
    {
      id: 'notif-2',
      title: '💪 Você já pode doar!',
      message: 'Já se passaram 90 dias desde sua última doação. Agende agora!',
      type: 'donation_reminder',
      isRead: false,
      createdAt: daysAgo(1),
    },
    {
      id: 'notif-3',
      title: '❤️ Obrigado!',
      message: 'Sua doação de 15/01 ajudou a salvar 3 vidas. Você é um herói!',
      type: 'thank_you',
      isRead: true,
      createdAt: daysAgo(5),
    },
    {
      id: 'notif-4',
      title: 'Novo centro de coleta',
      message: 'Um novo centro de coleta foi aberto no Papicu. Veja os horários.',
      type: 'general',
      isRead: true,
      createdAt: daysAgo(7),
    },
    {
      id: 'notif-5',
      title: '🚨 A+ Necessário',
      message: 'Hospital Geral de Fortaleza precisa de A+ urgentemente.',
      type: 'urgent_request',
      isRead: true,
      createdAt: daysAgo(2),
      relatedRequestId: 'req-3',
    },
  ];
}

const ELIGIBILITY_QUESTIONS: EligibilityQuestion[] = [
  { id: 'q1', question: 'Você está se sentindo bem e saudável hoje?', disqualifyOnYes: false },
  { id: 'q2', question: 'Está tomando antibióticos atualmente?', disqualifyOnYes: true },
  { id: 'q3', question: 'Fez tatuagem ou piercing nos últimos 4 meses?', disqualifyOnYes: true },
  { id: 'q4', question: 'Pesou menos de 50kg?', disqualifyOnYes: true },
  { id: 'q5', question: 'Consumiu bebida alcoólica nas últimas 12 horas?', disqualifyOnYes: true },
];

// ─── Mock Data Store ───

let mockRequests = generateRequests(12);
let mockNotifications = generateNotifications();
let mockDonationHistory = generateDonationHistory();

const mockUser: DonorProfile = {
  id: 'user-1',
  name: 'Carlos',
  email: 'carlos@email.com',
  bloodType: 'O-',
  phone: '(85) 99876-5432',
  isAvailable: true,
  locationEnabled: true,
  createdAt: daysAgo(365),
  totalDonations: 4,
  livesSaved: 12,
  lastDonationDate: daysAgo(90),
  nextEligibleDate: daysAgo(-1), // eligible now
  streak: 4,
  badges: [
    {
      id: 'badge-1',
      name: 'Primeiro Passo',
      icon: '🩸',
      description: 'Primeira doação realizada',
      earnedAt: daysAgo(365),
    },
    {
      id: 'badge-2',
      name: 'Herói Regular',
      icon: '🦸',
      description: '3 doações consecutivas',
      earnedAt: daysAgo(180),
    },
    {
      id: 'badge-3',
      name: 'Doador de Ouro',
      icon: '🏅',
      description: 'Mais de 10 vidas salvas',
      earnedAt: daysAgo(90),
    },
  ],
};

// ─── Simulated Delays ───

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Mock API ───

export const mockApi = {
  auth: {
    login: async (email: string, _password: string): Promise<{ user: DonorProfile; token: string }> => {
      await delay(800);
      return { user: { ...mockUser, email }, token: 'mock-jwt-token' };
    },
    register: async (name: string, email: string, _password: string): Promise<{ user: DonorProfile; token: string }> => {
      await delay(1000);
      const newUser: DonorProfile = {
        ...mockUser,
        id: `user-${randomId()}`,
        name,
        email,
        totalDonations: 0,
        livesSaved: 0,
        lastDonationDate: null,
        nextEligibleDate: null,
        streak: 0,
        badges: [],
      };
      return { user: newUser, token: 'mock-jwt-token' };
    },
  },

  donor: {
    getProfile: async (): Promise<DonorProfile> => {
      await delay(500);
      return { ...mockUser };
    },
    updateBloodType: async (bloodType: BloodType): Promise<DonorProfile> => {
      await delay(300);
      mockUser.bloodType = bloodType;
      return { ...mockUser };
    },
    toggleAvailability: async (isAvailable: boolean): Promise<DonorProfile> => {
      await delay(300);
      mockUser.isAvailable = isAvailable;
      return { ...mockUser };
    },
    getDonationHistory: async (): Promise<DonationRecord[]> => {
      await delay(600);
      return [...mockDonationHistory];
    },
  },

  requests: {
    getAll: async (filters?: { bloodType?: BloodType; urgency?: UrgencyLevel }): Promise<BloodRequest[]> => {
      await delay(700);
      let results = [...mockRequests];
      if (filters?.bloodType) {
        results = results.filter((r) => r.bloodType === filters.bloodType);
      }
      if (filters?.urgency) {
        results = results.filter((r) => r.urgency === filters.urgency);
      }
      return results;
    },
    getById: async (id: string): Promise<BloodRequest | null> => {
      await delay(400);
      return mockRequests.find((r) => r.id === id) ?? null;
    },
    respond: async (requestId: string): Promise<{ success: boolean }> => {
      await delay(500);
      const request = mockRequests.find((r) => r.id === requestId);
      if (request) {
        request.unitsFulfilled += 1;
      }
      return { success: true };
    },
  },

  notifications: {
    getAll: async (): Promise<Notification[]> => {
      await delay(500);
      return [...mockNotifications];
    },
    markAsRead: async (id: string): Promise<void> => {
      await delay(200);
      const notif = mockNotifications.find((n) => n.id === id);
      if (notif) notif.isRead = true;
    },
    getUnreadCount: async (): Promise<number> => {
      await delay(200);
      return mockNotifications.filter((n) => !n.isRead).length;
    },
  },

  eligibility: {
    getQuestions: async (): Promise<EligibilityQuestion[]> => {
      await delay(300);
      return [...ELIGIBILITY_QUESTIONS];
    },
  },
};

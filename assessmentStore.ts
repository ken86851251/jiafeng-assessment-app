import { create } from 'zustand';
import { Assessment, BasicInfo, HealthMedical, PhysicalBody, SocialFamily, CarePlan, CompletionSignature } from '@/types';

interface AssessmentState {
  // 當前評估資料
  currentAssessment: Assessment | null;
  
  // 評估步驟
  currentStep: number;
  totalSteps: number;
  
  // 各模組資料
  basicInfo: Partial<BasicInfo>;
  healthMedical: Partial<HealthMedical>;
  physicalBody: Partial<PhysicalBody>;
  socialFamily: Partial<SocialFamily>;
  carePlan: Partial<CarePlan>;
  completionSignature: Partial<CompletionSignature>;
  
  // 操作方法
  setCurrentAssessment: (assessment: Assessment | null) => void;
  setCurrentStep: (step: number) => void;
  updateBasicInfo: (data: Partial<BasicInfo>) => void;
  updateHealthMedical: (data: Partial<HealthMedical>) => void;
  updatePhysicalBody: (data: Partial<PhysicalBody>) => void;
  updateSocialFamily: (data: Partial<SocialFamily>) => void;
  updateCarePlan: (data: Partial<CarePlan>) => void;
  updateCompletionSignature: (data: Partial<CompletionSignature>) => void;
  resetAssessment: () => void;
  
  // 智慧功能
  autoSuggestCareProblems: () => number[];
  generateRiskAlerts: () => any[];
}

const initialState = {
  currentAssessment: null,
  currentStep: 1,
  totalSteps: 4,
  basicInfo: {},
  healthMedical: {
    currentTreatment: [],
    hospitalizationRecords: [],
    surgeryRecords: [],
    medicationPhotos: [],
    hasDialysis: false
  },
  physicalBody: {
    mentalFunction: {
      consciousness: [],
      cognitiveStatus: '',
      memoryStatus: 'normal' as 'normal' | 'short_term_poor',
      communicationAbility: '',
      emotionalExpression: [],
      behaviorExpression: []
    },
    sensoryFunction: {
      vision: '',
      hearing: '',
      smell: '',
      oralCondition: []
    },
    nutritionDiet: {
      dietType: '',
      eatingCondition: ''
    },
    muscleStrength: {
      rightUpperLimb: 5,
      leftUpperLimb: 5,
      rightLowerLimb: 5,
      leftLowerLimb: 5
    },
    mobilityAbility: {
      standingPosture: '',
      sittingPosture: '',
      transferAbility: '',
      walkingAbility: '',
      fallFrequency: '',
      assistiveDevices: []
    },
    excretoryFunction: {
      bowelMovement: '',
      urination: ''
    },
    skinCondition: {
      skinProblems: [],
      pressureInjury: '',
      skinPhotos: []
    },
    otherAssessments: {
      diseaseCondition: '',
      painCondition: '',
      sleepCondition: '',
      otherTubes: '',
      hygieneBathing: ''
    }
  },
  socialFamily: {
    assistiveDevices: [],
    intensiveVisitNeeds: [],
    environmentPhotos: []
  },
  carePlan: {
    careProblems: {
      selectedProblems: [],
      autoSuggested: []
    }
  },
  completionSignature: {
    riskAlerts: []
  }
};

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  ...initialState,
  
  setCurrentAssessment: (assessment) => set({ currentAssessment: assessment }),
  
  setCurrentStep: (step) => set({ currentStep: step }),
  
  updateBasicInfo: (data) => set((state) => ({
    basicInfo: { ...state.basicInfo, ...data }
  })),
  
  updateHealthMedical: (data) => set((state) => ({
    healthMedical: { ...state.healthMedical, ...data }
  })),
  
  updatePhysicalBody: (data) => set((state) => ({
    physicalBody: { ...state.physicalBody, ...data }
  })),
  
  updateSocialFamily: (data) => set((state) => ({
    socialFamily: { ...state.socialFamily, ...data }
  })),
  
  updateCarePlan: (data) => set((state) => ({
    carePlan: { ...state.carePlan, ...data }
  })),
  
  updateCompletionSignature: (data) => set((state) => ({
    completionSignature: { ...state.completionSignature, ...data }
  })),
  
  resetAssessment: () => set(initialState),
  
  // 智慧功能：根據評估結果自動建議照顧問題
  autoSuggestCareProblems: () => {
    const state = get();
    const suggestions: number[] = [];
    
    // 根據皮膚狀況建議照顧問題
    if (state.physicalBody.skinCondition?.pressureInjury?.includes('2級') || 
        state.physicalBody.skinCondition?.pressureInjury?.includes('3級') || 
        state.physicalBody.skinCondition?.pressureInjury?.includes('4級')) {
      suggestions.push(20, 21); // 皮膚照護問題、傷口問題
    }
    
    // 根據移動能力建議跌倒風險
    if (state.physicalBody.mobilityAbility?.walkingAbility?.includes('不穩') ||
        state.physicalBody.mobilityAbility?.fallFrequency !== '無跌倒') {
      suggestions.push(26); // 跌倒風險
    }
    
    // 根據認知狀況建議記憶問題
    if (state.physicalBody.mentalFunction?.memoryStatus === 'short_term_poor') {
      suggestions.push(17); // 短期記憶障礙
    }
    
    // 根據用藥狀況建議用藥問題
    if (state.healthMedical.medicationStatus === 'reminder' ||
        state.healthMedical.medicationStatus === 'partial_help' ||
        state.healthMedical.medicationStatus === 'full_help' ||
        state.healthMedical.medicationStatus === 'poor_compliance') {
      suggestions.push(14); // 用藥問題
    }
    
    // 根據排泄功能建議相關問題
    if (state.physicalBody.excretoryFunction?.bowelMovement?.includes('失禁') ||
        state.physicalBody.excretoryFunction?.urination?.includes('失禁')) {
      suggestions.push(5, 6); // 大小便控制問題、上廁所問題
    }
    
    return [...new Set(suggestions)]; // 去重
  },
  
  // 智慧功能：生成風險警示
  generateRiskAlerts: () => {
    const state = get();
    const alerts: any[] = [];
    
    // 跌倒風險警示
    if (state.physicalBody.mobilityAbility?.walkingAbility?.includes('不穩') &&
        state.socialFamily.familySocialSupport?.livingSituation?.includes('獨居')) {
      alerts.push({
        type: 'fall',
        message: '注意：此個案為跌倒高風險群（行走不穩且獨居）',
        severity: 'high'
      });
    }
    
    // 壓傷風險警示
    if (state.physicalBody.skinCondition?.pressureInjury?.includes('3級') ||
        state.physicalBody.skinCondition?.pressureInjury?.includes('4級')) {
      alerts.push({
        type: 'pressure_injury',
        message: '注意：此個案有嚴重壓傷風險',
        severity: 'high'
      });
    }
    
    // 營養風險警示
    if (state.physicalBody.nutritionDiet?.eatingCondition?.includes('完全依賴') ||
        state.physicalBody.nutritionDiet?.dietType?.includes('管灌')) {
      alerts.push({
        type: 'nutrition',
        message: '注意：此個案有營養攝取風險',
        severity: 'medium'
      });
    }
    
    return alerts;
  }
}));
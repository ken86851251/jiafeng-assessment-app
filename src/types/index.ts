// 嘉豐智能訪視評估 App - 資料類型定義

// 基本資料類型
export interface BasicInfo {
  caseCode: string;
  assessor: string;
  caseName: string;
  visitDate: string;
  planType: 'AA01' | 'AA02'; // 初評 AA01 | 計畫異動 AA02
  interviewSubject: string;
  birthday: string;
  gender: 'male' | 'female';
  cmsLevel: number; // 2-8
  ltcBenefit: 'type1' | 'type2' | 'type3'; // 第一類 | 第二類 | 第三類
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed' | 'other';
  disabilityICF: 'none' | 'mild' | 'moderate' | 'severe' | 'profound';
  medicalHistory: string[];
  medicalHistoryOther: string;
  problemNeeds: string;
  gpsLocation?: string;
  visitTimestamp?: string;
}

// 健康醫療面向資料
export interface HealthMedical {
  currentTreatment: string[];
  hospitalizationRecords: HospitalizationRecord[];
  surgeryRecords: SurgeryRecord[];
  clinicName: string;
  medicationStatus: 'stable' | 'reminder' | 'partial_help' | 'full_help' | 'poor_compliance' | 'none';
  medicationFrequency: string;
  medicationPhotos: PhotoRecord[];
  hasDialysis: boolean;
  dialysisInfo?: DialysisInfo;
}

export interface HospitalizationRecord {
  id: string;
  reason: string;
  hospital: string;
  dischargeDate: string;
}

export interface SurgeryRecord {
  id: string;
  bodyPart: string;
  surgeryName: string;
  surgeryDate: string;
}

export interface DialysisInfo {
  frequency: string;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  hospital: string;
  condition: string[];
  tubeType: 'AVF' | 'AVG' | 'PermCath';
  lastCheckDate: string;
  tubeCare: 'normal' | 'bleeding' | 'infection';
}

// 生理身體面向資料
export interface PhysicalBody {
  mentalFunction: MentalFunction;
  sensoryFunction: SensoryFunction;
  nutritionDiet: NutritionDiet;
  muscleStrength: MuscleStrength;
  mobilityAbility: MobilityAbility;
  excretoryFunction: ExcretoryFunction;
  skinCondition: SkinCondition;
  otherAssessments: OtherAssessments;
}

export interface MentalFunction {
  consciousness: string[];
  cognitiveStatus: string;
  memoryStatus: 'normal' | 'short_term_poor';
  communicationAbility: string;
  emotionalExpression: string[];
  behaviorExpression: string[];
}

export interface SensoryFunction {
  vision: string;
  hearing: string;
  smell: string;
  oralCondition: string[];
}

export interface NutritionDiet {
  dietType: string;
  eatingCondition: string;
}

export interface MuscleStrength {
  rightUpperLimb: number; // 1-5
  leftUpperLimb: number; // 1-5
  rightLowerLimb: number; // 1-5
  leftLowerLimb: number; // 1-5
}

export interface MobilityAbility {
  standingPosture: string;
  sittingPosture: string;
  transferAbility: string;
  walkingAbility: string;
  fallFrequency: string;
  assistiveDevices: string[];
}

export interface ExcretoryFunction {
  bowelMovement: string;
  urination: string;
}

export interface SkinCondition {
  skinProblems: string[];
  pressureInjury: string;
  skinPhotos: PhotoRecord[];
}

export interface OtherAssessments {
  diseaseCondition: string;
  painCondition: string;
  sleepCondition: string;
  otherTubes: string;
  hygieneBathing: string;
}

// 社會心理與家庭環境資料
export interface SocialFamily {
  primaryCaregiver: PrimaryCaregiver;
  familySocialSupport: FamilySocialSupport;
  livingEnvironment: LivingEnvironment;
  assistiveDevices: string[];
  intensiveVisitNeeds: string[];
  environmentPhotos: PhotoRecord[];
}

export interface PrimaryCaregiver {
  name: string;
  birthday: string;
  relationship: string;
  idNumber: string;
  phone: string;
  occupation: string;
  maritalStatus: string;
}

export interface FamilySocialSupport {
  livingSituation: string;
  familyInteraction: string;
  familySupport: string;
  socialParticipation: string;
  economicSource: string;
  resourceUsage: string;
  careStress: string;
}

export interface LivingEnvironment {
  housingType: string;
  homeEntrance: string;
  livingEnvironment: string;
  homeEnvironment: string;
  corridorSpace: string;
}

// 照顧計畫與目標資料
export interface CarePlan {
  careProblems: CareProblems;
  careGoals: string;
  carePlanArrangement: CarePlanArrangement;
}

export interface CareProblems {
  selectedProblems: number[]; // 1-34的問題編號
  autoSuggested: number[]; // 系統自動建議的問題編號
}

export interface CarePlanArrangement {
  homeService: string; // B碼
  rehabilitationService: string; // C碼
  assistiveDeviceAssessment: string; // EF碼
  transportation: string;
  respiteService: string;
}

// 完成與簽核資料
export interface CompletionSignature {
  riskAlerts: RiskAlert[];
  signature: string; // Base64 encoded signature
  comparisonData?: AssessmentComparison;
}

export interface RiskAlert {
  type: 'fall' | 'pressure_injury' | 'nutrition' | 'other';
  message: string;
  severity: 'high' | 'medium' | 'low';
}

export interface AssessmentComparison {
  previousAssessmentId: string;
  differences: AssessmentDifference[];
}

export interface AssessmentDifference {
  field: string;
  previousValue: any;
  currentValue: any;
  category: string;
}

// 照片記錄
export interface PhotoRecord {
  id: string;
  url: string;
  description: string;
  category: 'medication' | 'skin' | 'environment' | 'other';
  timestamp: string;
}

// 完整評估資料
export interface Assessment {
  id: string;
  basicInfo: BasicInfo;
  healthMedical: HealthMedical;
  physicalBody: PhysicalBody;
  socialFamily: SocialFamily;
  carePlan: CarePlan;
  completionSignature: CompletionSignature;
  status: 'draft' | 'completed' | 'synced';
  createdAt: string;
  updatedAt: string;
}

// 個案資料
export interface CaseRecord {
  id: string;
  name: string;
  caseCode: string;
  birthDate: string;
  gender: 'male' | 'female';
  address: string;
  phone: string;
  emergencyContact: string;
  assessments: Assessment[];
  createdAt: string;
  updatedAt: string;
}

// 使用者資料
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'case_manager' | 'admin';
}

// API 回應類型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 照顧問題清單常數
export const CARE_PROBLEMS = [
  { id: 1, name: '進食問題' },
  { id: 2, name: '洗澡問題' },
  { id: 3, name: '個人修飾問題' },
  { id: 4, name: '穿脫衣物問題' },
  { id: 5, name: '大小便控制問題' },
  { id: 6, name: '上廁所問題' },
  { id: 7, name: '移位問題' },
  { id: 8, name: '走路問題' },
  { id: 9, name: '上下樓梯問題' },
  { id: 10, name: '使用電話問題' },
  { id: 11, name: '購物或外出問題' },
  { id: 12, name: '備餐問題' },
  { id: 13, name: '處理家務問題' },
  { id: 14, name: '用藥問題' },
  { id: 15, name: '處理財務問題' },
  { id: 16, name: '溝通問題' },
  { id: 17, name: '短期記憶障礙' },
  { id: 18, name: '疼痛問題' },
  { id: 19, name: '不動症候群風險' },
  { id: 20, name: '皮膚照護問題' },
  { id: 21, name: '傷口問題' },
  { id: 22, name: '水份及營養問題' },
  { id: 23, name: '吞嚥問題' },
  { id: 24, name: '管路照顧問題' },
  { id: 25, name: '其他醫療照護問題' },
  { id: 26, name: '跌倒風險' },
  { id: 27, name: '安全疑慮' },
  { id: 28, name: '居住環境障礙' },
  { id: 29, name: '社會參與需協助' },
  { id: 30, name: '困擾行為' },
  { id: 31, name: '照顧負荷過重' },
  { id: 32, name: '輔具使用問題' },
  { id: 33, name: '感染問題' },
  { id: 34, name: '其他問題' }
] as const;
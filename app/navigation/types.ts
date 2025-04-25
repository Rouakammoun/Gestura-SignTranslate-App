// /app/navigation/types.ts
export type RootStackParamList = {
  SetLanguage: undefined; // No parameters for this screen
  Home: undefined;
  ChooseLanguage: undefined;
  TextOrSpeechToSign: undefined;
  SignToText:undefined;
  VideoTranslation:undefined;
  Welcome: undefined; // No parameters for this screen
  SignIn: undefined;
  SignUp: undefined;
  Home0: undefined;
  ModeSelection:undefined;
  GetStarted:undefined;
  LearnMore:undefined;
  Profile:undefined;
  Settings:undefined;
  Feedback:undefined;

};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
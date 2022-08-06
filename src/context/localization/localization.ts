import LocalizedStrings, { LocalizedStringsMethods } from "react-localization";

export interface LocalizationType extends LocalizedStringsMethods {
    accountSettings: string;
    signOut: string;
    uploadImage: string;
    lots: string;
    addAverage: string;
    buildCharts: string;
    selectFiles: string;
    selected: string;
    browse: string;
    methodName: string;
    operatorName: string;
    foundingDate: string;
    controlMaterial: string;
    materialName: string;
    materialManufacturer: string;
    materialLot: string;
    materialExpDate: string;
    materialLvl1: string;
    materialLvl2: string;
    machineName: string;
    submit: string;
    about: string;
    language: string;
    madeFor: string;
    loginWith: string;
    email: string;
    password: string;
    forgotPassword: string;
    signUp: string;
    signIn: string;
    reset: string;
    username: string;
    passwordConfirm: string;
    hide: string;
    show: string;
    chooseDataFiles: string;
    chooseAvatarPicture: string;
    userIsNotSignedIn: string;
    loading: string;
    settings: string;
    recoveryLinkWasSent: string;
}

const localization: LocalizationType = new LocalizedStrings({
    en: {
        accountSettings: "Account settings",
        signOut: "Sign out",
        uploadImage: "Upload image",
        lots: "Lots",
        addAverage: "Add average",
        buildCharts: "Build charts",
        selectFiles: "Select files",
        selected: "selected",
        browse: "Browse",
        methodName: "Method name",
        operatorName: "Operator",
        foundingDate: "Date of founding measurements",
        controlMaterial: "Control material",
        materialName: "Name",
        materialManufacturer: "Manufacturer",
        materialLot: "Lot",
        materialExpDate: "Expiration date",
        materialLvl1: "Level 1",
        materialLvl2: "Level 2",
        machineName: "Measurements machine name",
        submit: "Submit",
        preferences: "Preferences",
        about: "About",
        language: "Language",
        madeFor: "Made for",
        loginWith: "Login with",
        email: "Email",
        password: "Password",
        forgotPassword: "Forgot password?",
        signUp: "Sign up",
        signIn: "Sign in",
        reset: "Reset",
        username: "Username",
        passwordConfirm: "Confirm password",
        hide: "Hide",
        show: "Show",
        loading: "Loading...",
        recoveryLinkWasSent: "An email with your recovery link was sent",
        settings: "Settings",
        userIsNotSignedIn: "User is not signed in",
        chooseDataFiles: "Choose data files",
        chooseAvatarPicture: "Choose avatar picture",
    },
    uk: {
        accountSettings: "Акаунт",
        signOut: "Вийти",
        uploadImage: "Завантажити зображення",
        lots: "Лоти",
        addAverage: "Поточний контроль якості",
        buildCharts: "Побудова контрольних карт",
        selectFiles: "Вибрати файли",
        selected: "вибрано",
        browse: "Переглянути",
        methodName: "Назва методики",
        operatorName: "Оператор",
        foundingDate: "Дата установчих вимірювань",
        controlMaterial: "Контрольний матеріал",
        materialName: "Назва",
        materialManufacturer: "Виробник",
        materialLot: "Лот",
        materialExpDate: "Термін придатності",
        materialLvl1: "Рівень 1",
        materialLvl2: "Рівень 2",
        machineName: "Засіб вимірювальної техніки",
        submit: "Підтвердити",
        preferences: "Налаштування",
        about: "Про програму",
        language: "Мова",
        madeFor: "Зроблено для",
        loginWith: "Увійти за допомогою",
        email: "Email",
        password: "Пароль",
        forgotPassword: "Забули пароль?",
        signUp: "Зареєструватися",
        signIn: "Увійти",
        reset: "Скинути",
        username: "Логін",
        passwordConfirm: "Підтвердити пароль",
        hide: "Сховати",
        show: "Показати",
        loading: "Завантажується...",
        recoveryLinkWasSent:
            "Лист для скидавання паролю був надісланий вам на пошту",
        settings: "Налаштування",
        userIsNotSignedIn: "Користувач не увійшов",
        chooseDataFiles: "Оберіть файли для розрахунку",
        chooseAvatarPicture: "Оберіть фото для аватару",
    },
});

export default localization;

import LocalizedStrings, { LocalizedStringsMethods } from "react-localization";

export interface localizationTypeUnknown extends LocalizedStringsMethods {
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
    preferences: string;
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
}

const localization: localizationTypeUnknown = new LocalizedStrings({
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
        show: "Show"
    },
    ru: {
        accountSettings: "Аккаунт",
        signOut: "Выйти",
        uploadImage: "Загрузить картинку",
        lots: "Лоты",
        addAverage: "Добавить среднее",
        buildCharts: "Построить графики",
        selectFiles: "Выбрать файлы",
        selected: "выбрано",
        browse: "Просмотреть",
        methodName: "Название методики",
        operatorName: "Оператор",
        foundingDate: "Дата изначальных измерений",
        controlMaterial: "Контрольный материал",
        materialName: "Название",
        materialManufacturer: "Изготовитель",
        materialLot: "Лот",
        materialExpDate: "Срок годности",
        materialLvl1: "Уровень 1",
        materialLvl2: "Уровень 2",
        machineName: "Инструмент измерения",
        submit: "Принять",
        preferences: "Настройки",
        about: "Про прогамму",
        language: "Язык",
        madeFor: "Сделано для",
        loginWith: "Войти с помощью",
        email: "Email",
        password: "Пароль",
        forgotPassword: "Забыли пароль?",
        signUp: "Зарегистрироваться",
        signIn: "Войти",
        reset: "Восстановить",
        username: "Логин",
        passwordConfirm: "Подтвердите пароль",
        hide: "Спрятать",
        show: "Показать"
    },
    uk: {
        accountSettings: "Аккаунт",
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
        show: "Показати"
    },
});

export default localization;

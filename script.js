let currentScreen = 1;
let totalScreens = 10;
let consentGiven = false;
let selectedLanguage = 'fr'; // Default to French
let userName = '';
let surveyData = {
    ageRange: '',
    learningObjective: '',
    subObjectives: [],
    activityFormats: [],
    skillsToImprove: [],
    level: '',
    practiceTime: '',
    tutorChoice: ''
};

// Translation object
const translations = {
    en: {
        welcome: "Welcome!",
        welcomeText: "Help us personalize your French learning experience by participating in this quick survey.",
        consentText: "I consent to the collection and processing of my personal data for this survey. Read our",
        privacyPolicy: "Privacy Policy",
        privacyPolicyText: "for more details.",
        chooseLanguage: "Choose Language",
        languageText: "Select your preferred language for this survey interface.",
        whatsYourName: "What's your name?",
        nameText: "Tell us your name so we can personalize your survey experience.",
        namePlaceholder: "Enter your full name",
        back: "Back",
        next: "Next",
        complete: "Complete",
        stepText: "Step",
        ofText: "of",
        surveyComplete: "Survey completed! Welcome"
    },
    fr: {
        welcome: "Bienvenue !",
        welcomeText: "Aidez-nous à personnaliser votre expérience d'apprentissage du français en participant à cette enquête rapide.",
        consentText: "Je consens à la collecte et au traitement de mes données personnelles pour cette enquête. Lisez notre",
        privacyPolicy: "Politique de confidentialité",
        privacyPolicyText: "pour plus de détails.",
        chooseLanguage: "Choisir la langue",
        languageText: "Sélectionnez votre langue préférée pour cette interface d'enquête.",
        whatsYourName: "Quel est votre nom ?",
        nameText: "Dites-nous votre nom pour que nous puissions personnaliser votre expérience d'enquête.",
        namePlaceholder: "Entrez votre nom complet",
        back: "Précédent",
        next: "Suivant",
        complete: "Terminer",
        stepText: "Étape",
        ofText: "sur",
        surveyComplete: "Enquête terminée ! Bienvenue"
    },
    ar: {
        welcome: "مرحباً!",
        welcomeText: "ساعدنا في تخصيص تجربة تعلم الفرنسية الخاصة بك من خلال المشاركة في هذا الاستطلاع السريع.",
        consentText: "أوافق على جمع ومعالجة بياناتي الشخصية لهذا الاستطلاع. اقرأ",
        privacyPolicy: "سياسة الخصوصية",
        privacyPolicyText: "لمزيد من التفاصيل.",
        chooseLanguage: "اختر اللغة",
        languageText: "اختر لغتك المفضلة لواجهة الاستطلاع هذه.",
        whatsYourName: "ما اسمك؟",
        nameText: "أخبرنا باسمك حتى نتمكن من تخصيص تجربة الاستطلاع الخاصة بك.",
        namePlaceholder: "أدخل اسمك الكامل",
        back: "رجوع",
        next: "التالي",
        complete: "إكمال",
        stepText: "خطوة",
        ofText: "من",
        surveyComplete: "تم إكمال الاستطلاع! مرحباً"
    }
};

// Elements
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const backBtn = document.getElementById('backBtn');
const nextBtn = document.getElementById('nextBtn');
const consentCheckbox = document.getElementById('consentCheckbox');
const languageOptions = document.querySelectorAll('.language-option');
const nameInput = document.getElementById('nameInput');

// Initialize
updateProgress();
updateNavigationState();
updateLanguage(); // Initialize with default language
setupEventListeners();

function setupEventListeners() {
    // Consent checkbox
    consentCheckbox.addEventListener('click', () => {
        consentGiven = !consentGiven;
        consentCheckbox.classList.toggle('checked', consentGiven);
        updateNavigationState();
    });

    // Language selection
    languageOptions.forEach(option => {
        option.addEventListener('click', () => {
            languageOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedLanguage = option.dataset.lang;
            updateLanguage();
            updateNavigationState();
        });
    });

    // Name input
    nameInput.addEventListener('input', (e) => {
        userName = e.target.value.trim();
        updateNavigationState();
    });

    // Navigation buttons
    backBtn.addEventListener('click', goBack);
    nextBtn.addEventListener('click', goNext);
    
    // Survey option selection handlers
    setupSurveyOptionHandlers();
}

function setupSurveyOptionHandlers() {
    // Handle all survey option selections (screens 4-10)
    document.querySelectorAll('.option-item').forEach(option => {
        option.addEventListener('click', function() {
            const screen = this.closest('.screen');
            const container = this.closest('.options-container');
            const isMultipleSelect = container.classList.contains('multiple-select');
            const group = container.dataset.group;
            
            if (isMultipleSelect) {
                // Multiple selection
                this.classList.toggle('selected');
            } else {
                // Single selection
                if (group) {
                    // For grouped selections (like level & time)
                    container.querySelectorAll('.option-item').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                } else {
                    // For regular single selections
                    screen.querySelectorAll('.option-item').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                }
                this.classList.add('selected');
            }
            
            // Update survey data
            updateSurveyData();
            updateNavigationState();
        });
    });
}

function updateSurveyData() {
    // Age Range (Screen 4)
    const ageSelected = document.querySelector('#screen4 .option-item.selected');
    if (ageSelected) {
        surveyData.ageRange = ageSelected.dataset.value;
    }
    
    // Learning Objective (Screen 5)
    const objectiveSelected = document.querySelector('#screen5 .option-item.selected');
    if (objectiveSelected) {
        surveyData.learningObjective = objectiveSelected.dataset.value;
    }
    
    // Sub-objectives (Screen 6) - Multiple selection
    const subObjectivesSelected = document.querySelectorAll('#screen6 .option-item.selected');
    surveyData.subObjectives = Array.from(subObjectivesSelected).map(item => item.dataset.value);
    
    // Activity Formats (Screen 7) - Multiple selection
    const formatsSelected = document.querySelectorAll('#screen7 .option-item.selected');
    surveyData.activityFormats = Array.from(formatsSelected).map(item => item.dataset.value);
    
    // Skills to Improve (Screen 8) - Multiple selection
    const skillsSelected = document.querySelectorAll('#screen8 .option-item.selected');
    surveyData.skillsToImprove = Array.from(skillsSelected).map(item => item.dataset.value);
    
    // Level & Practice Time (Screen 9)
    const levelSelected = document.querySelector('#screen9 [data-group="level"] .option-item.selected');
    const timeSelected = document.querySelector('#screen9 [data-group="time"] .option-item.selected');
    if (levelSelected) surveyData.level = levelSelected.dataset.value;
    if (timeSelected) surveyData.practiceTime = timeSelected.dataset.value;
    
    // Tutor Choice (Screen 10)
    const tutorSelected = document.querySelector('#screen10 .option-item.selected');
    if (tutorSelected) {
        surveyData.tutorChoice = tutorSelected.dataset.value;
    }
}

function canProceedFromCurrentScreen() {
    switch (currentScreen) {
        case 1:
            return consentGiven;
        case 2:
            return selectedLanguage !== '';
        case 3:
            return userName !== '';
        case 4:
            return surveyData.ageRange !== '';
        case 5:
            return surveyData.learningObjective !== '';
        case 6:
            // Skip this screen if learning objective is not "employment"
            if (surveyData.learningObjective !== 'employment') {
                return true;
            }
            return surveyData.subObjectives.length > 0;
        case 7:
            return surveyData.activityFormats.length > 0;
        case 8:
            return surveyData.skillsToImprove.length > 0;
        case 9:
            return surveyData.level !== '' && surveyData.practiceTime !== '';
        case 10:
            return surveyData.tutorChoice !== '';
        default:
            return false;
    }
}

function goBack() {
    if (currentScreen > 1) {
        currentScreen--;
        
        // Skip screen 6 if going back and learning objective is not employment
        if (currentScreen === 6 && surveyData.learningObjective !== 'employment') {
            currentScreen--;
        }
        
        showScreen();
        updateProgress();
        updateNavigationState();
    }
}

function goNext() {
    if (currentScreen < totalScreens) {
        currentScreen++;
        
        // Skip screen 6 if learning objective is not employment
        if (currentScreen === 6 && surveyData.learningObjective !== 'employment') {
            currentScreen++;
        }
        
        showScreen();
        updateProgress();
        updateNavigationState();
    } else {
        // Survey complete
        completeSurvey();
    }
}

function showScreen() {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show current screen with animation
    const currentScreenElement = document.getElementById(`screen${currentScreen}`);
    currentScreenElement.classList.add('active');
    
    // Update screen-specific content
    updateScreenContent();
}

function updateScreenContent() {
    // Update screen 6 visibility based on learning objective
    const screen6 = document.getElementById('screen6');
    if (surveyData.learningObjective === 'employment') {
        screen6.style.display = 'flex';
    } else {
        screen6.style.display = 'none';
    }
}

function updateProgress() {
    let effectiveTotal = totalScreens;
    let effectiveCurrent = currentScreen;
    
    // Adjust for skipped screen 6
    if (surveyData.learningObjective !== 'employment') {
        effectiveTotal = totalScreens - 1;
        if (currentScreen > 6) {
            effectiveCurrent = currentScreen - 1;
        }
    }
    
    const progress = (effectiveCurrent / effectiveTotal) * 100;
    progressFill.style.width = `${progress}%`;
    
    const t = translations[selectedLanguage];
    progressText.textContent = `${t.stepText} ${effectiveCurrent} ${t.ofText} ${effectiveTotal}`;
}

function updateNavigationState() {
    // Update survey data first
    updateSurveyData();
    
    const t = translations[selectedLanguage];
    
    // Back button
    backBtn.disabled = currentScreen === 1;
    backBtn.querySelector('span') ? backBtn.querySelector('span').textContent = t.back : backBtn.lastChild.textContent = ` ${t.back}`;
    
    // Next button
    const canProceed = canProceedFromCurrentScreen();
    nextBtn.disabled = !canProceed;
    
    // Update next button text
    const nextSpan = nextBtn.querySelector('span');
    if (currentScreen === totalScreens) {
        nextSpan.textContent = t.complete;
    } else {
        nextSpan.textContent = t.next;
    }
}

function updateLanguage() {
    const t = translations[selectedLanguage];
    
    // Update screen 1 content
    document.querySelector('#screen1 h1').textContent = t.welcome;
    document.querySelector('#screen1 p').textContent = t.welcomeText;
    document.querySelector('.consent-text').innerHTML = `${t.consentText} <a href="#">${t.privacyPolicy}</a> ${t.privacyPolicyText}`;
    
    // Update screen 2 content
    document.querySelector('#screen2 h1').textContent = t.chooseLanguage;
    document.querySelector('#screen2 p').textContent = t.languageText;
    
    // Update screen 3 content
    document.querySelector('#screen3 h1').textContent = t.whatsYourName;
    document.querySelector('#screen3 p').textContent = t.nameText;
    document.querySelector('#nameInput').placeholder = t.namePlaceholder;
    
    // Update navigation buttons
    const backText = backBtn.querySelector('span') || backBtn.lastChild;
    if (backText.nodeType === Node.TEXT_NODE) {
        backText.textContent = ` ${t.back}`;
    } else {
        backBtn.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg> ${t.back}`;
    }
    
    // Update progress text
    updateProgress();
    
    // Update navigation state to refresh button text
    updateNavigationState();
    
    // Apply RTL direction for Arabic
    if (selectedLanguage === 'ar') {
        document.body.style.direction = 'rtl';
        document.body.style.textAlign = 'right';
    } else {
        document.body.style.direction = 'ltr';
        document.body.style.textAlign = 'left';
    }
}

function completeSurvey() {
    // Create summary of responses
    const summary = createSummary();
    
    // Show completion message
    showCompletionMessage(summary);
    
    // Log survey data for debugging
    console.log('Survey completed:', {
        consent: consentGiven,
        language: selectedLanguage,
        name: userName,
        surveyData: surveyData
    });
}

function createSummary() {
    const ageLabels = {
        'under18': 'Moins de 18 ans',
        '18-24': '18 – 24 ans',
        '25-34': '25 – 34 ans',
        '35-44': '35 – 44 ans',
        '45-54': '45 – 54 ans',
        '55plus': '55 ans et plus'
    };
    
    const objectiveLabels = {
        'employment': 'Obtenir un emploi',
        'daily-life': 'Améliorer ma vie quotidienne',
        'exam': 'Préparer un examen (DELF, TCF…)',
        'culture': 'Découvrir la langue et la culture'
    };
    
    const levelLabels = {
        'beginner': 'Débutant (A1–A2)',
        'intermediate': 'Intermédiaire+ (B1 et plus)'
    };
    
    const timeLabels = {
        '5min': '5 min',
        '10min': '10 min',
        '15min': '15 min',
        '20min': '20 min',
        '30min': '30 min et plus'
    };
    
    const tutorLabels = {
        'friendly': 'Ami(e) sympathique',
        'formal': 'Professeur formel',
        'neutral': 'Coach neutre'
    };
    
    return {
        name: userName,
        language: selectedLanguage,
        age: ageLabels[surveyData.ageRange] || surveyData.ageRange,
        objective: objectiveLabels[surveyData.learningObjective] || surveyData.learningObjective,
        level: levelLabels[surveyData.level] || surveyData.level,
        time: timeLabels[surveyData.practiceTime] || surveyData.practiceTime,
        tutor: tutorLabels[surveyData.tutorChoice] || surveyData.tutorChoice,
        subObjectives: surveyData.subObjectives,
        activityFormats: surveyData.activityFormats,
        skillsToImprove: surveyData.skillsToImprove
    };
}

function showCompletionMessage(summary) {
    const t = translations[selectedLanguage];
    const message = `
🎉 ${t.surveyComplete} ${summary.name} !

Voici un résumé de vos préférences :
• Langue d'interface : ${summary.language.toUpperCase()}
• Âge : ${summary.age}
• Objectif : ${summary.objective}
• Niveau : ${summary.level}
• Temps quotidien : ${summary.time}
• Style de tuteur : ${summary.tutor}

${summary.activityFormats.length > 0 ? `• Formats préférés : ${summary.activityFormats.length} sélectionnés` : ''}
${summary.skillsToImprove.length > 0 ? `• Compétences à améliorer : ${summary.skillsToImprove.length} sélectionnées` : ''}

Merci pour votre participation ! 🚀
    `;
    
    alert(message);
}

// Initialize the survey
document.addEventListener('DOMContentLoaded', function() {
    showScreen();
    updateScreenContent();
});

// Add smooth transitions
function addTransitionEffects() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
}

// Call transition effects setup
addTransitionEffects();
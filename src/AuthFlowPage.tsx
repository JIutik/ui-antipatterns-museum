// src/pages/AuthFlowPage.tsx
import { useState, useEffect, useMemo } from 'react';

// --- Типы данных ---
type Country = { name: string; code: string; iso: string };
type Question = { question: string; answers: string[]; correct: number };

// --- Данные (взяты из вашего скрипта) ---
const countries: Country[] = [
    { name: 'Bhutan', code: '+975', iso: 'BT' }, { name: 'Liechtenstein', code: '+423', iso: 'LI' }, { name: 'San Marino', code: '+378', iso: 'SM' }, { name: 'Andorra', code: '+376', iso: 'AD' }, { name: 'Monaco', code: '+377', iso: 'MC' }, { name: 'Palau', code: '+680', iso: 'PW' }, { name: 'Tonga', code: '+676', iso: 'TO' }, { name: 'Tuvalu', code: '+688', iso: 'TV' }, { name: 'Nauru', code: '+674', iso: 'NR' }, { name: 'Kiribati', code: '+686', iso: 'KI' }, { name: 'Comoros', code: '+269', iso: 'KM' }, { name: 'Djibouti', code: '+253', iso: 'DJ' }, { name: 'Eritrea', code: '+291', iso: 'ER' }, { name: 'Lesotho', code: '+266', iso: 'LS' }, { name: 'Eswatini', code: '+268', iso: 'SZ' }, { name: 'Suriname', code: '+597', iso: 'SR' }, { name: 'Guyana', code: '+592', iso: 'GY' }, { name: 'Turkmenistan', code: '+993', iso: 'TM' }, { name: 'Timor-Leste', code: '+670', iso: 'TL' }, { name: 'Russia', code: '+7', iso: 'RU' },
];
const questions: Question[] = [
    { question: "Какое животное не умеет прыгать?", answers: ["A: Слон", "B: Кенгуру", "C: Лягушка", "D: Заяц"], correct: 0 },
    { question: "Сколько сердец у осьминога?", answers: ["A: Одно", "B: Два", "C: Три", "D: Четыре"], correct: 2 },
    { question: "Из чего сделан рог носорога?", answers: ["A: Из кости", "B: Из кератина", "C: Из хряща", "D: Из дерева"], correct: 1 },
    { question: "Какая планета вращается в обратную сторону?", answers: ["A: Марс", "B: Юпитер", "C: Сатурн", "D: Венера"], correct: 3 },
    { question: "Что измеряет 'шкала Сковилла'?", answers: ["A: Силу ветра", "B: Твердость минералов", "C: Остроту перца", "D: Громкость звука"], correct: 2 }
];
const correctOtp = "1240";

export default function AuthFlowPage() {
    // --- Состояние (State) ---
    const [stage, setStage] = useState<'phone' | 'otp' | 'millionaire' | 'success'>('phone');
    const [phoneDigits, setPhoneDigits] = useState<string[]>(Array(10).fill(''));
    const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);
    const [stepperValue, setStepperValue] = useState(0);
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showPush, setShowPush] = useState(false);
    const [otp, setOtp] = useState<string[]>(Array(4).fill(''));
    const [otpError, setOtpError] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [millionaireError, setMillionaireError] = useState(false);

    // --- Вычисляемые значения ---
    const isPhoneFilled = useMemo(() => phoneDigits.every(d => d !== ''), [phoneDigits]);
    const fullPhoneNumber = useMemo(() => selectedCountry ? `${selectedCountry.code}${phoneDigits.join('')}` : '', [selectedCountry, phoneDigits]);

    // --- Эффекты (Side Effects) ---
    useEffect(() => {
        if (stage === 'otp') {
            const timer = setTimeout(() => setShowPush(true), 500);
            const hideTimer = setTimeout(() => setShowPush(false), 10000);
            return () => {
                clearTimeout(timer);
                clearTimeout(hideTimer);
            };
        }
    }, [stage]);
    
    useEffect(() => {
        if (stage === 'millionaire' && !currentQuestion) {
            loadNewQuestion();
        }
    }, [stage, currentQuestion]);
    
    // --- Обработчики событий ---
    const handlePhoneInputClick = (index: number) => {
        if (activeInputIndex !== null && phoneDigits[activeInputIndex] === '') {
            handleDigitSet(activeInputIndex, stepperValue);
        }
        setActiveInputIndex(index);
        if (phoneDigits[index] !== '') {
            setStepperValue(parseInt(phoneDigits[index]));
        } else {
            setStepperValue(0);
        }
    };

    const handleDigitSet = (index: number, value: number) => {
        const newDigits = [...phoneDigits];
        newDigits[index] = String(value);
        setPhoneDigits(newDigits);
    };

    const handleStepperChange = (increment: boolean) => {
        if (activeInputIndex === null || phoneDigits[activeInputIndex] !== '') return;
        const newValue = increment
            ? (stepperValue + 1) % 10
            : (stepperValue - 1 + 10) % 10;
        setStepperValue(newValue);
    };

    const handleReset = () => {
        setPhoneDigits(Array(10).fill(''));
        setActiveInputIndex(null);
        setSelectedCountry(null);
    };

    const handleGetCode = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isPhoneFilled || !selectedCountry) return;
        setStage('otp');
    };
    
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Только цифры
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 3) {
            document.getElementById(`otp-input-${index + 1}`)?.focus();
        }
    };
    
    const handleOtpKeyDown = (index: number, key: string) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-input-${index - 1}`)?.focus();
        }
    };
    
    const handleVerifyOtp = () => {
        if (otp.join('') === correctOtp) {
            setOtpError(false);
            setStage('millionaire');
        } else {
            setOtpError(true);
        }
    };
    
    const loadNewQuestion = () => {
        setMillionaireError(false);
        const randomIndex = Math.floor(Math.random() * questions.length);
        setCurrentQuestion(questions[randomIndex]);
    };

    const checkAnswer = (selectedIndex: number) => {
        if (selectedIndex === currentQuestion?.correct) {
            setMillionaireError(false);
            setStage('success');
        } else {
            setMillionaireError(true);
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
            {/* --- Пуш-уведомление --- */}
            {showPush && (
                <div className="fixed top-0 left-0 right-0 p-4 z-50">
                    <div className="push-notification w-full max-w-sm mx-auto bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border dark:border-gray-700">
                        <p className="font-bold">Новое сообщение</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Для входа используйте ОТП: один, два, четыре, 0</p>
                    </div>
                </div>
            )}
            
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-sm mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                    {/* --- Этап 1: Ввод телефона --- */}
                    {stage === 'phone' && (
                        <div>
                             <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold">Введите номер телефона</h1>
                                <p className="text-gray-500 dark:text-gray-400 mt-2">Отправим вам СМС по номеру телефона</p>
                            </div>
                            <form onSubmit={handleGetCode}>
                                <div className="flex items-end space-x-2">
                                    <div>
                                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Код страны</label>
                                        <button type="button" onClick={() => setIsModalOpen(true)} className="w-20 h-12 flex items-center justify-center bg-gray-200 dark:bg-gray-700 p-3 rounded-lg font-semibold text-lg">
                                           {selectedCountry ? selectedCountry.code : '--'}
                                        </button>
                                    </div>
                                    <div className="flex-grow grid grid-cols-10 gap-1">
                                       {phoneDigits.map((digit, index) => (
                                           <input
                                               key={index}
                                               type="text"
                                               value={digit}
                                               readOnly
                                               onClick={() => handlePhoneInputClick(index)}
                                               className={`w-full h-12 text-center text-lg font-semibold bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none transition cursor-pointer ${activeInputIndex === index ? 'input-active' : ''}`}
                                           />
                                       ))}
                                    </div>
                                </div>
                                
                                {activeInputIndex !== null && (
                                     <div className="mt-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-between">
                                        <button type="button" onClick={() => handleStepperChange(false)} disabled={phoneDigits[activeInputIndex] !== ''} className="w-12 h-10 rounded-md bg-white dark:bg-gray-800 font-bold text-2xl hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">-</button>
                                        <span className="text-2xl font-bold w-16 text-center">{stepperValue}</span>
                                        <button type="button" onClick={() => handleStepperChange(true)} disabled={phoneDigits[activeInputIndex] !== ''} className="w-12 h-10 rounded-md bg-white dark:bg-gray-800 font-bold text-2xl hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">+</button>
                                    </div>
                                )}

                                <div className="mt-8 flex space-x-2">
                                     <button type="button" onClick={handleReset} className="w-1/3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">Сбросить</button>
                                     <button type="submit" disabled={!isPhoneFilled || !selectedCountry} className="w-2/3 font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-gray-300 disabled:dark:bg-gray-600 disabled:text-gray-500 disabled:dark:text-gray-400 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700 text-white">Получить код</button>
                                </div>
                            </form>
                        </div>
                    )}
                    
                    {/* --- Этап 2: Ввод ОТП --- */}
                    {stage === 'otp' && (
                        <div>
                           <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold">Код подтверждения</h1>
                                <p className="text-gray-500 dark:text-gray-400 mt-2">Мы отправили код на номер {fullPhoneNumber}</p>
                            </div>
                            <div className="flex justify-center gap-3 mb-4">
                               {otp.map((digit, index) => (
                                   <input 
                                     key={index} 
                                     id={`otp-input-${index}`}
                                     type="text" 
                                     maxLength={1} 
                                     value={digit}
                                     onChange={(e) => handleOtpChange(index, e.target.value)}
                                     onKeyDown={(e) => handleOtpKeyDown(index, e.key)}
                                     className="w-14 h-16 text-center text-3xl font-semibold bg-gray-200 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition otp-input" 
                                   />
                               ))}
                            </div>
                            {otpError && <div className="text-red-500 text-sm mt-4 text-center">Неверный код! Попробуйте еще раз.</div>}
                            <div className="mt-8">
                                <button onClick={handleVerifyOtp} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">Подтвердить</button>
                            </div>
                        </div>
                    )}

                    {/* --- Этап 3: Миллионер --- */}
                    {stage === 'millionaire' && currentQuestion && (
                         <div>
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold">Докажите, что вы человек и не тупой</h1>
                            </div>
                            <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg text-center mb-4">
                                <p className="font-semibold">{currentQuestion.question}</p>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {currentQuestion.answers.map((answer, index) => (
                                    <button 
                                        key={index}
                                        type="button" 
                                        onClick={() => checkAnswer(index)}
                                        className="w-full text-left p-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                    >
                                        {answer}
                                    </button>
                                ))}
                            </div>
                            {millionaireError && <div className="text-red-500 text-sm mt-4 text-center">Неверный ответ! Попробуйте снова.</div>}
                        </div>
                    )}
                    
                    {/* --- Этап 4: Успех --- */}
                    {stage === 'success' && (
                        <div className="text-center">
                            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                                <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                            </svg>
                            <h1 className="text-2xl font-bold mt-4">Вход выполнен!</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Поздравляем, вы справились. to be continued...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- Модальное окно выбора страны --- */}
            {isModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Выберите страну</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-2xl">&times;</button>
                        </div>
                        <div className="flag-carousel flex overflow-x-auto space-x-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                           {countries.map(country => (
                               <button 
                                 key={country.iso} 
                                 type="button" 
                                 onClick={() => {
                                     setSelectedCountry(country);
                                     setIsModalOpen(false);
                                 }}
                                 className="flex-shrink-0 cursor-pointer transform hover:scale-110 transition-transform duration-200 rounded-md overflow-hidden"
                                >
                                 <img src={`https://flagcdn.com/w40/${country.iso.toLowerCase()}.png`} alt={country.name} className="w-10 h-auto" />
                               </button>
                           ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
// data/wordsData.ts

export interface Word {
  id: string;
  grade: 7 | 8 | 9;
  lesson: number;
  word: string;
  translation: string;
  type: string;
  example: string;
  image: any; 
}

export const allWords: Word[] = [
  // --- پایه هفتم - درس ۱ ---
  {
    id: 'g7-l1-1',
    grade: 7,
    lesson: 1,
    word: 'Class',
    translation: 'کلاس',
    type: 'Noun',
    example: 'Our class starts at 9 o’clock. 📘',
     image: require('../assets/words/grade7/Class.jpg'),
  },
  {
    id: 'g7-l1-1',
    grade: 7,
    lesson: 1,
    word: 'Everyone',
    translation: 'همگی',
    type: 'Noun',
    example: 'Hello everyone! 👋',
     image: require('../assets/words/grade7/Everyone.jpg'),
  },
  {
    id: 'g7-l1-1',
    grade: 7,
    lesson: 1,
    word: 'Myname',
    translation: 'اسم من',
    type: 'Noun',
    example: 'My name is Sara. 😀',
     image: require('../assets/words/grade7/Myname.jpg'),
  },
  {
    id: 'g7-l1-1',
    grade: 7,
    lesson: 1,
    word: 'Name',
    translation: 'اسم',
    type: 'Noun',
    example: 'What is your name? 📝',
     image: require('../assets/words/grade7/Name.jpg'),
  },
  {
    id: 'g7-l1-1',
    grade: 7,
    lesson: 1,
    word: 'Spell',
    translation: 'املا',
    type: 'Noun',
    example: 'Can you spell this word? 🔠',
     image: require('../assets/words/grade7/Spell.jpg'),
  },
  {
    id: 'g7-l1-1',
    grade: 7,
    lesson: 1,
    word: 'Apple',
    translation: 'سیب',
    type: 'Noun',
    example: 'I eat a red apple. 🍎',
     image: require('../assets/words/grade7/Class.jpg'),
  },
  {
    id: 'g7-l1-1',
    grade: 7,
    lesson: 1,
    word: 'Apple',
    translation: 'سیب',
    type: 'Noun',
    example: 'I eat a red apple. 🍎',
     image: require('../assets/words/grade7/Class.jpg'),
  },
  // --- پایه هشتم - درس ۱ ---
  {
    id: 'g8-l1-1',
    grade: 8,
    lesson: 1,
    word: 'Bicycle',
    translation: 'دوچرخه',
    type: 'Noun',
    example: 'He rides his bicycle. 🚲',
     image: require('../assets/words/grade7/Class.jpg'),
  },
  // بقیه لغات را با همین الگو برای پایه 7، 8 و 9 و درس‌های 1 تا 8 اضافه کنید...
];
